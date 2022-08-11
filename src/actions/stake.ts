/* eslint-disable */

import * as anchor from '@project-serum/anchor';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
    EPOCH,
    GLOBAL_AUTHORITY_SEED,
    METAPLEX,
    PROGRAM_ID,
    REWARD_TOKEN_DECIMAL,
    REWARD_TOKEN_MINT,
    STAKING_CONFIG_ID,
    STAKING_REWARD_MINT,
    USER_POOL_SIZE
} from 'config/config';
import { solConnection, getNftTokenAccount, getAssociatedTokenAccount, getATokenAccountsNeedCreate } from 'actions/shared';
import { WalletContextState } from '@solana/wallet-adapter-react';

// types
export interface GlobalPool {
    admin: PublicKey;
    totalAmount: anchor.BN;
    adventureRate: anchor.BN;
    scientistRate: anchor.BN;
    doctorRate: anchor.BN;
    specialistRate: anchor.BN;
    commanderRate: anchor.BN;
    normalRate: anchor.BN;
}

export interface StakedNFT {
    nftAddr: PublicKey;
    stakeTime: anchor.BN;
    rewardTime: anchor.BN;
    lockTime: anchor.BN;
    rate: anchor.BN;
    model: anchor.BN;
}

export interface UserPool {
    owner: PublicKey;
    itemCount: anchor.BN;
    items: StakedNFT[];
    rewardTime: anchor.BN;
    pendingReward: anchor.BN;
}

// helpers
export const setAmount = async (
    wallet: WalletContextState,
    advAmount: number,
    sciAmount: number,
    docAmount: number,
    speAmount: number,
    comAmount: number,
    norAmount: number
) => {
    if (wallet.publicKey === null) return;

    const userAddress = wallet.publicKey;
    const cloneWindow: any = window;
    const provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions());
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    const [globalAuthority, bump] = await PublicKey.findProgramAddress([Buffer.from(GLOBAL_AUTHORITY_SEED)], program.programId);

    try {
        const tx = await program.rpc.setAmount(bump, advAmount, sciAmount, docAmount, speAmount, comAmount, norAmount, {
            accounts: {
                admin: userAddress,
                globalAuthority
            },
            signers: []
        });

        await solConnection.confirmTransaction(tx, 'finalized');
    } catch (error) {
        console.error(error);
    }
};

export const calculateAllRewards = async (wallet: WalletContextState) => {
    if (wallet.publicKey === null) return 0;

    const globalPool: GlobalPool | null = await getGlobalState();
    if (globalPool === null) return 0;

    const userPool: UserPool | null = await getUserPoolState(wallet);
    if (userPool === null) return 0;

    let now = Math.floor(Date.now() / 1000);
    let total_reward = 0;

    for (let i = 0; i < userPool.itemCount.toNumber(); i++) {
        let lastRewardTime = userPool.rewardTime.toNumber();
        if (lastRewardTime < userPool.items[i].rewardTime.toNumber()) {
            lastRewardTime = userPool.items[i].rewardTime.toNumber();
        }

        let reward = 0;
        if (userPool.items[i].model.toNumber() === 1 && userPool.items[i].lockTime.toNumber() > now) {
            reward = Math.floor(((now - lastRewardTime) / EPOCH) * (userPool.items[i].rate.toNumber() * 0.75));
        } else {
            reward = Math.floor(((now - lastRewardTime) / EPOCH) * userPool.items[i].rate.toNumber());
        }

        total_reward += reward;
    }

    total_reward += userPool.pendingReward.toNumber();

    return total_reward / REWARD_TOKEN_DECIMAL;
};

export const calculateReward = async (wallet: WalletContextState, nftMint: PublicKey) => {
    if (wallet.publicKey === null) return 0;

    const globalPool: GlobalPool | null = await getGlobalState();
    if (globalPool === null) return 0;

    const userPool: UserPool | null = await getUserPoolState(wallet);
    if (userPool === null) return 0;

    let now = Math.floor(Date.now() / 1000);
    let reward = 0;

    for (let i = 0; i < userPool.itemCount.toNumber(); i++) {
        if (userPool.items[i].nftAddr.toBase58() === nftMint.toBase58()) {
            if (userPool.items[i].model.toNumber() === 1 && now < userPool.items[i].lockTime.toNumber()) {
                reward =
                    Math.floor((now - userPool.items[i].rewardTime.toNumber()) / EPOCH) *
                    (userPool.items[i].rate.toNumber() / LAMPORTS_PER_SOL) *
                    0.75;
            } else {
                reward = Math.floor(((now - userPool.items[i].rewardTime.toNumber()) * userPool.items[i].rate.toNumber()) / EPOCH);
            }
        }
    }
    return reward / REWARD_TOKEN_DECIMAL;
};

export const initUserPool = async (wallet: WalletContextState) => {
    if (wallet.publicKey === null) return;

    let userAddress: PublicKey = wallet.publicKey;
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions());
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    try {
        let userPoolKey = await PublicKey.createWithSeed(userAddress, 'user-pool', program.programId);

        let ix = SystemProgram.createAccountWithSeed({
            fromPubkey: userAddress,
            basePubkey: userAddress,
            seed: 'user-pool',
            newAccountPubkey: userPoolKey,
            lamports: await solConnection.getMinimumBalanceForRentExemption(USER_POOL_SIZE),
            space: USER_POOL_SIZE,
            programId: program.programId
        });

        let tx = new Transaction();
        tx.add(ix);
        tx.add(
            program.instruction.initializeFixedPool({
                accounts: {
                    userFixedPool: userPoolKey,
                    owner: userAddress
                },
                instructions: [],
                signers: []
            })
        );
        const txId = await wallet.sendTransaction(tx, solConnection);
        await solConnection.confirmTransaction(txId, 'finalized');
    } catch (error) {
        console.log(error);
    }
};

export const stakeNft = async (wallet: WalletContextState, mint: PublicKey, lock_period: number, role: String, model: number) => {
    if (wallet.publicKey === null) return;

    const userAddress = wallet.publicKey;
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions());
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    let userTokenAccount = await getAssociatedTokenAccount(userAddress, mint);
    let accountOfNft = await getNftTokenAccount(mint);

    if (userTokenAccount.toBase58() !== accountOfNft.toBase58()) {
        let nftOwner = await getOwnerOfNft(mint);
        if (nftOwner.toBase58() === userAddress.toBase58()) userTokenAccount = accountOfNft;
        else {
            console.log('ERROR: NFT is not owned by user.');
            return;
        }
    }

    const [globalAuthority, bump] = await PublicKey.findProgramAddress([Buffer.from(GLOBAL_AUTHORITY_SEED)], program.programId);

    let { instructions, destinationAccounts } = await getATokenAccountsNeedCreate(solConnection, userAddress, globalAuthority, [mint]);

    let userPoolKey = await PublicKey.createWithSeed(userAddress, 'user-pool', program.programId);

    let poolAccount = await solConnection.getAccountInfo(userPoolKey);
    if (poolAccount === null || poolAccount.data === null) {
        await initUserPool(wallet);
    }
    const metadata = await getMetadata(mint);

    let tx = new Transaction();
    if (instructions.length > 0) tx.add(instructions[0]);
    tx.add(
        program.instruction.stakeNftToFixed(bump, new anchor.BN(lock_period), role, new anchor.BN(model), {
            accounts: {
                owner: userAddress,
                userFixedPool: userPoolKey,
                globalAuthority,
                userTokenAccount,
                destNftTokenAccount: destinationAccounts[0],
                nftMint: mint,
                mintMetadata: metadata,
                tokenProgram: TOKEN_PROGRAM_ID,
                tokenMetadataProgram: METAPLEX
            },
            instructions: [
                // ...instructions,
            ],
            signers: []
        })
    );

    const txId = await wallet.sendTransaction(tx, solConnection);
    await solConnection.confirmTransaction(txId, 'finalized');
};

export const withdrawNft = async (wallet: WalletContextState, mint: PublicKey) => {
    if (wallet.publicKey === null) return;
    const userAddress = wallet.publicKey;
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions());
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    let userTokenAccount = await getAssociatedTokenAccount(userAddress, mint);

    const [globalAuthority, bump] = await PublicKey.findProgramAddress([Buffer.from(GLOBAL_AUTHORITY_SEED)], program.programId);

    let { instructions, destinationAccounts } = await getATokenAccountsNeedCreate(solConnection, userAddress, globalAuthority, [mint]);

    // console.log(instructions, "instructions..")
    let userPoolKey = await PublicKey.createWithSeed(userAddress, 'user-pool', program.programId);

    let tx = new Transaction();
    if (instructions.length > 0) tx.add(...instructions);
    tx.add(
        program.instruction.withdrawNftFromFixed(bump, {
            accounts: {
                owner: userAddress,
                userFixedPool: userPoolKey,
                globalAuthority,
                userTokenAccount,
                destNftTokenAccount: destinationAccounts[0],
                nftMint: mint,
                tokenProgram: TOKEN_PROGRAM_ID
            },
            instructions: [],
            signers: []
        })
    );

    const txId = await wallet.sendTransaction(tx, solConnection);
    await solConnection.confirmTransaction(txId, 'finalized');
};

export const claimRewardAll = async (wallet: WalletContextState) => {
    if (wallet.publicKey === null) return;
    const userAddress = wallet.publicKey;
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions());
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    const [globalAuthority, bump] = await PublicKey.findProgramAddress([Buffer.from(GLOBAL_AUTHORITY_SEED)], program.programId);

    let userPoolKey = await PublicKey.createWithSeed(userAddress, 'user-pool', program.programId);

    let { instructions, destinationAccounts } = await getATokenAccountsNeedCreate(solConnection, userAddress, userAddress, [
        REWARD_TOKEN_MINT
    ]);

    let rewardVault = await getAssociatedTokenAccount(globalAuthority, REWARD_TOKEN_MINT);
    // let tx = new Transaction();
    // if (instructions.length !== 0) tx.add(...instructions);
    // tx.add(program.instruction.claimRewardAll(
    //     bump, {
    //     accounts: {
    //         owner: userAddress,
    //         userFixedPool: userPoolKey,
    //         globalAuthority,
    //         rewardVault,
    //         userRewardAccount: destinationAccounts[0],
    //         tokenProgram: TOKEN_PROGRAM_ID,
    //     },
    //     instructions: [],
    //     signers: []
    // }
    // ))

    // const txId = await wallet.sendTransaction(tx, solConnection);
    // await solConnection.confirmTransaction(txId, "finalized");
    const tx = await program.rpc.claimRewardAll(bump, {
        accounts: {
            owner: userAddress,
            userFixedPool: userPoolKey,
            globalAuthority,
            rewardVault,
            userRewardAccount: destinationAccounts[0],
            tokenProgram: TOKEN_PROGRAM_ID
        },
        instructions: [...instructions],
        signers: []
    });

    await solConnection.confirmTransaction(tx, 'singleGossip');
};

export const claimReward = async (wallet: WalletContextState, mint: PublicKey) => {
    if (wallet.publicKey === null) return;
    const userAddress = wallet.publicKey;
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions());
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    const [globalAuthority, bump] = await PublicKey.findProgramAddress([Buffer.from(GLOBAL_AUTHORITY_SEED)], program.programId);

    let userPoolKey = await PublicKey.createWithSeed(userAddress, 'user-pool', program.programId);

    let { instructions, destinationAccounts } = await getATokenAccountsNeedCreate(solConnection, userAddress, userAddress, [
        REWARD_TOKEN_MINT
    ]);
    let rewardVault = await getAssociatedTokenAccount(globalAuthority, REWARD_TOKEN_MINT);

    let tx = new Transaction();
    if (instructions.length > 0) tx.add(...instructions);

    tx.add(
        program.instruction.claimReward(bump, {
            accounts: {
                owner: userAddress,
                userFixedPool: userPoolKey,
                globalAuthority,
                rewardVault,
                userRewardAccount: destinationAccounts[0],
                nftMint: mint,
                tokenProgram: TOKEN_PROGRAM_ID
            },
            instructions: [],
            signers: []
        })
    );

    const txId = await wallet.sendTransaction(tx, solConnection);
    await solConnection.confirmTransaction(txId, 'finalized');
};

export const getGlobalState = async (): Promise<GlobalPool | null> => {
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions());
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    const [globalAuthority, bump] = await PublicKey.findProgramAddress([Buffer.from(GLOBAL_AUTHORITY_SEED)], program.programId);

    try {
        let globalState = await program.account.globalPool.fetch(globalAuthority);
        return globalState as GlobalPool;
    } catch {
        return null;
    }
};

export const getUserPoolState = async (wallet: WalletContextState): Promise<UserPool | null> => {
    if (wallet.publicKey === null) return null;

    const userAddress = wallet.publicKey;
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions());
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    let userPoolKey = await PublicKey.createWithSeed(userAddress, 'user-pool', program.programId);

    try {
        let poolState = await program.account.userPool.fetch(userPoolKey);
        return poolState as UserPool;
    } catch {
        return null;
    }
};

const getOwnerOfNft = async (nftMintPk: PublicKey): Promise<PublicKey> => {
    let tokenAccountPK = await getNftTokenAccount(nftMintPk);
    let tokenAccountInfo = await solConnection.getAccountInfo(tokenAccountPK);

    if (tokenAccountInfo && tokenAccountInfo.data) {
        let ownerPubkey = new PublicKey(tokenAccountInfo.data.slice(32, 64));
        return ownerPubkey;
    }
    return new PublicKey('');
};

export const getMetadata = async (mint: PublicKey): Promise<PublicKey> => {
    return (await PublicKey.findProgramAddress([Buffer.from('metadata'), METAPLEX.toBuffer(), mint.toBuffer()], METAPLEX))[0];
};

// IDL
export type StakingType = {
    version: '0.1.0';
    name: 'staking_program';
    instructions: [
        {
            name: 'initialize';
            accounts: [
                {
                    name: 'admin';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'globalAuthority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'rent';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'globalBump';
                    type: 'u8';
                }
            ];
        },
        {
            name: 'setAmount';
            accounts: [
                {
                    name: 'admin';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'globalAuthority';
                    isMut: true;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'globalBump';
                    type: 'u8';
                },
                {
                    name: 'advAmount';
                    type: 'u64';
                },
                {
                    name: 'sciAmount';
                    type: 'u64';
                },
                {
                    name: 'docAmount';
                    type: 'u64';
                },
                {
                    name: 'speAmount';
                    type: 'u64';
                },
                {
                    name: 'comAmount';
                    type: 'u64';
                },
                {
                    name: 'norAmount';
                    type: 'u64';
                }
            ];
        },
        {
            name: 'initializeFixedPool';
            accounts: [
                {
                    name: 'userFixedPool';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                }
            ];
            args: [];
        },
        {
            name: 'stakeNftToFixed';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'userFixedPool';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'globalAuthority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'userTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'destNftTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'nftMint';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'mintMetadata';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenMetadataProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'globalBump';
                    type: 'u8';
                },
                {
                    name: 'lockPeriod';
                    type: 'i64';
                },
                {
                    name: 'role';
                    type: 'string';
                },
                {
                    name: 'model';
                    type: 'u64';
                }
            ];
        },
        {
            name: 'withdrawNftFromFixed';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'userFixedPool';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'globalAuthority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'userTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'destNftTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'nftMint';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'globalBump';
                    type: 'u8';
                }
            ];
        },
        {
            name: 'claimRewardAll';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'userFixedPool';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'globalAuthority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'rewardVault';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'userRewardAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'globalBump';
                    type: 'u8';
                }
            ];
        },
        {
            name: 'claimReward';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'userFixedPool';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'globalAuthority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'rewardVault';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'userRewardAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'nftMint';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'globalBump';
                    type: 'u8';
                }
            ];
        }
    ];
    accounts: [
        {
            name: 'GlobalPool';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'admin';
                        type: 'publicKey';
                    },
                    {
                        name: 'totalAmount';
                        type: 'u64';
                    },
                    {
                        name: 'adventureRate';
                        type: 'u64';
                    },
                    {
                        name: 'scientistRate';
                        type: 'u64';
                    },
                    {
                        name: 'doctorRate';
                        type: 'u64';
                    },
                    {
                        name: 'specialistRate';
                        type: 'u64';
                    },
                    {
                        name: 'commanderRate';
                        type: 'u64';
                    },
                    {
                        name: 'normalRate';
                        type: 'u64';
                    }
                ];
            };
        },
        {
            name: 'UserPool';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'owner';
                        type: 'publicKey';
                    },
                    {
                        name: 'itemCount';
                        type: 'u64';
                    },
                    {
                        name: 'items';
                        type: {
                            array: [
                                {
                                    defined: 'StakedNFT';
                                },
                                50
                            ];
                        };
                    },
                    {
                        name: 'rewardTime';
                        type: 'i64';
                    },
                    {
                        name: 'pendingReward';
                        type: 'u64';
                    }
                ];
            };
        }
    ];
    types: [
        {
            name: 'StakedNFT';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'nftAddr';
                        type: 'publicKey';
                    },
                    {
                        name: 'stakeTime';
                        type: 'i64';
                    },
                    {
                        name: 'rewardTime';
                        type: 'i64';
                    },
                    {
                        name: 'lockTime';
                        type: 'i64';
                    },
                    {
                        name: 'rate';
                        type: 'i64';
                    },
                    {
                        name: 'model';
                        type: 'u64';
                    }
                ];
            };
        }
    ];
    errors: [
        {
            code: 6000;
            name: 'InvalidUserPool';
            msg: 'Invalid User Pool';
        },
        {
            code: 6001;
            name: 'InvalidCollection';
            msg: 'Invalid Collection';
        },
        {
            code: 6002;
            name: 'InvalidAdmin';
            msg: 'Invalid User Pool';
        },
        {
            code: 6003;
            name: 'InvalidPoolError';
            msg: 'Invalid pool number';
        },
        {
            code: 6004;
            name: 'InvalidNFTAddress';
            msg: 'No Matching NFT to withdraw';
        },
        {
            code: 6005;
            name: 'InvalidOwner';
            msg: 'NFT Owner key mismatch';
        },
        {
            code: 6006;
            name: 'InvalidWithdrawTime';
            msg: 'Staking Locked Now';
        },
        {
            code: 6007;
            name: 'IndexOverflow';
            msg: 'Withdraw NFT Index OverFlow';
        },
        {
            code: 6008;
            name: 'BeforeLockTime';
            msg: "You can't Unstake Before LockTime";
        },
        {
            code: 6009;
            name: 'LackLamports';
            msg: 'Insufficient Lamports';
        },
        {
            code: 6010;
            name: 'MetadataCreatorParseError';
            msg: "Can't Parse The NFT's Creators";
        },
        {
            code: 6011;
            name: 'InvaliedMetadata';
            msg: 'Invalid Metadata Address';
        }
    ];
};
export const IDL: StakingType = {
    version: '0.1.0',
    name: 'staking_program',
    instructions: [
        {
            name: 'initialize',
            accounts: [
                {
                    name: 'admin',
                    isMut: true,
                    isSigner: true
                },
                {
                    name: 'globalAuthority',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'rent',
                    isMut: false,
                    isSigner: false
                }
            ],
            args: [
                {
                    name: 'globalBump',
                    type: 'u8'
                }
            ]
        },
        {
            name: 'setAmount',
            accounts: [
                {
                    name: 'admin',
                    isMut: true,
                    isSigner: true
                },
                {
                    name: 'globalAuthority',
                    isMut: true,
                    isSigner: false
                }
            ],
            args: [
                {
                    name: 'globalBump',
                    type: 'u8'
                },
                {
                    name: 'advAmount',
                    type: 'u64'
                },
                {
                    name: 'sciAmount',
                    type: 'u64'
                },
                {
                    name: 'docAmount',
                    type: 'u64'
                },
                {
                    name: 'speAmount',
                    type: 'u64'
                },
                {
                    name: 'comAmount',
                    type: 'u64'
                },
                {
                    name: 'norAmount',
                    type: 'u64'
                }
            ]
        },
        {
            name: 'initializeFixedPool',
            accounts: [
                {
                    name: 'userFixedPool',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'owner',
                    isMut: true,
                    isSigner: true
                }
            ],
            args: []
        },
        {
            name: 'stakeNftToFixed',
            accounts: [
                {
                    name: 'owner',
                    isMut: true,
                    isSigner: true
                },
                {
                    name: 'userFixedPool',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'globalAuthority',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'userTokenAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'destNftTokenAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'nftMint',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'mintMetadata',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'tokenProgram',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'tokenMetadataProgram',
                    isMut: false,
                    isSigner: false
                }
            ],
            args: [
                {
                    name: 'globalBump',
                    type: 'u8'
                },
                {
                    name: 'lockPeriod',
                    type: 'i64'
                },
                {
                    name: 'role',
                    type: 'string'
                },
                {
                    name: 'model',
                    type: 'u64'
                }
            ]
        },
        {
            name: 'withdrawNftFromFixed',
            accounts: [
                {
                    name: 'owner',
                    isMut: true,
                    isSigner: true
                },
                {
                    name: 'userFixedPool',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'globalAuthority',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'userTokenAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'destNftTokenAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'nftMint',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'tokenProgram',
                    isMut: false,
                    isSigner: false
                }
            ],
            args: [
                {
                    name: 'globalBump',
                    type: 'u8'
                }
            ]
        },
        {
            name: 'claimRewardAll',
            accounts: [
                {
                    name: 'owner',
                    isMut: true,
                    isSigner: true
                },
                {
                    name: 'userFixedPool',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'globalAuthority',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'rewardVault',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'userRewardAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'tokenProgram',
                    isMut: false,
                    isSigner: false
                }
            ],
            args: [
                {
                    name: 'globalBump',
                    type: 'u8'
                }
            ]
        },
        {
            name: 'claimReward',
            accounts: [
                {
                    name: 'owner',
                    isMut: true,
                    isSigner: true
                },
                {
                    name: 'userFixedPool',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'globalAuthority',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'rewardVault',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'userRewardAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'nftMint',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'tokenProgram',
                    isMut: false,
                    isSigner: false
                }
            ],
            args: [
                {
                    name: 'globalBump',
                    type: 'u8'
                }
            ]
        }
    ],
    accounts: [
        {
            name: 'GlobalPool',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'admin',
                        type: 'publicKey'
                    },
                    {
                        name: 'totalAmount',
                        type: 'u64'
                    },
                    {
                        name: 'adventureRate',
                        type: 'u64'
                    },
                    {
                        name: 'scientistRate',
                        type: 'u64'
                    },
                    {
                        name: 'doctorRate',
                        type: 'u64'
                    },
                    {
                        name: 'specialistRate',
                        type: 'u64'
                    },
                    {
                        name: 'commanderRate',
                        type: 'u64'
                    },
                    {
                        name: 'normalRate',
                        type: 'u64'
                    }
                ]
            }
        },
        {
            name: 'UserPool',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'owner',
                        type: 'publicKey'
                    },
                    {
                        name: 'itemCount',
                        type: 'u64'
                    },
                    {
                        name: 'items',
                        type: {
                            array: [
                                {
                                    defined: 'StakedNFT'
                                },
                                50
                            ]
                        }
                    },
                    {
                        name: 'rewardTime',
                        type: 'i64'
                    },
                    {
                        name: 'pendingReward',
                        type: 'u64'
                    }
                ]
            }
        }
    ],
    types: [
        {
            name: 'StakedNFT',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'nftAddr',
                        type: 'publicKey'
                    },
                    {
                        name: 'stakeTime',
                        type: 'i64'
                    },
                    {
                        name: 'rewardTime',
                        type: 'i64'
                    },
                    {
                        name: 'lockTime',
                        type: 'i64'
                    },
                    {
                        name: 'rate',
                        type: 'i64'
                    },
                    {
                        name: 'model',
                        type: 'u64'
                    }
                ]
            }
        }
    ],
    errors: [
        {
            code: 6000,
            name: 'InvalidUserPool',
            msg: 'Invalid User Pool'
        },
        {
            code: 6001,
            name: 'InvalidCollection',
            msg: 'Invalid Collection'
        },
        {
            code: 6002,
            name: 'InvalidAdmin',
            msg: 'Invalid User Pool'
        },
        {
            code: 6003,
            name: 'InvalidPoolError',
            msg: 'Invalid pool number'
        },
        {
            code: 6004,
            name: 'InvalidNFTAddress',
            msg: 'No Matching NFT to withdraw'
        },
        {
            code: 6005,
            name: 'InvalidOwner',
            msg: 'NFT Owner key mismatch'
        },
        {
            code: 6006,
            name: 'InvalidWithdrawTime',
            msg: 'Staking Locked Now'
        },
        {
            code: 6007,
            name: 'IndexOverflow',
            msg: 'Withdraw NFT Index OverFlow'
        },
        {
            code: 6008,
            name: 'BeforeLockTime',
            msg: "You can't Unstake Before LockTime"
        },
        {
            code: 6009,
            name: 'LackLamports',
            msg: 'Insufficient Lamports'
        },
        {
            code: 6010,
            name: 'MetadataCreatorParseError',
            msg: "Can't Parse The NFT's Creators"
        },
        {
            code: 6011,
            name: 'InvaliedMetadata',
            msg: 'Invalid Metadata Address'
        }
    ]
};