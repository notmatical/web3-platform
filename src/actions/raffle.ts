/* eslint-disable */

import * as anchor from '@project-serum/anchor';
import { LAMPORTS_PER_SOL, PublicKey, Signer, SystemProgram, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { GLOBAL_AUTHORITY_SEED, YAKU_DECIMALS, RAFFLE_PROGRAM, RAFFLE_SIZE, YAKU_TOKEN_MINT } from 'config';
import { solConnection, getAssociatedTokenAccount, getATokenAccountsNeedCreate } from 'actions/shared';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { RafflePool } from 'types/raffles';

// helpers

/**
 * @dev CreateRaffle function
 * @param userAddress The raffle creator's address
 * @param nft_mint The nft_mint address
 * @param ticketPriceSol The ticket price by SOL
 * @param ticketPriceToken The ticket price by SPL token
 * @param endTimestamp The raffle end timestamp
 * @param rewardAmount Reward amount
 * @param winnerCount The winner_cap of this raffle
 * @param whitelisted The variable if 1: winner get NFt as price and if 0: get whitelist spot  2: get spl token reward
 * @param max The max entrants of this raffle
 */
export const createRaffle = async (
    wallet: WalletContextState,
    nft_mint: PublicKey,
    ticketPriceSol: number,
    ticketPriceToken: number,
    endTimestamp: number,
    rewardAmount: number,
    winnerCount: number,
    whitelisted: number,
    max: number
) => {
    if (!wallet.publicKey) return;
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions());
    const program = new anchor.Program(IDL as anchor.Idl, RAFFLE_PROGRAM, provider);
    const userAddress = wallet.publicKey;
    const [globalAuthority, bump] = await PublicKey.findProgramAddress([Buffer.from(GLOBAL_AUTHORITY_SEED)], program.programId);

    let ownerNftAccount = await getAssociatedTokenAccount(userAddress, nft_mint);

    let ix0 = await getATokenAccountsNeedCreate(solConnection, userAddress, globalAuthority, [nft_mint]);

    let ix1 = await getATokenAccountsNeedCreate(solConnection, userAddress, userAddress, [YAKU_TOKEN_MINT]);

    let raffle;
    let i;

    for (i = 10; i > 0; i--) {
        raffle = await PublicKey.createWithSeed(userAddress, nft_mint.toBase58().slice(0, i), program.programId);
        let state = await getStateByKey(raffle);
        if (state === null) {
            console.log(i);
            break;
        }
    }
    console.log(i);
    if (raffle === undefined) return;
    let ix = SystemProgram.createAccountWithSeed({
        fromPubkey: userAddress,
        basePubkey: userAddress,
        seed: nft_mint.toBase58().slice(0, i),
        newAccountPubkey: raffle,
        lamports: await solConnection.getMinimumBalanceForRentExemption(RAFFLE_SIZE),
        space: RAFFLE_SIZE,
        programId: program.programId
    });
    let tx = new Transaction();
    tx.add(ix);
    if (ix0.instructions.length !== 0) tx.add(...ix0.instructions);
    if (ix1.instructions.length !== 0) tx.add(...ix1.instructions);

    tx.add(
        program.instruction.createRaffle(
            bump,
            new anchor.BN(ticketPriceToken * YAKU_DECIMALS),
            new anchor.BN(ticketPriceSol * LAMPORTS_PER_SOL),
            new anchor.BN(endTimestamp),
            new anchor.BN(winnerCount),
            new anchor.BN(rewardAmount),
            new anchor.BN(whitelisted),
            new anchor.BN(max),
            {
                accounts: {
                    admin: userAddress,
                    globalAuthority,
                    raffle,
                    ownerTempNftAccount: ownerNftAccount,
                    destNftTokenAccount: ix0.destinationAccounts[0],
                    nftMintAddress: nft_mint,
                    tokenProgram: TOKEN_PROGRAM_ID
                },
                instructions: [],
                signers: []
            }
        )
    );
    const txId = await wallet.sendTransaction(tx, solConnection);
    await solConnection.confirmTransaction(txId, 'finalized');
};

/**
 * @dev BuyTicket function
 * @param userAddress The use's address
 * @param nft_mint The nft_mint address
 * @param amount The amount of ticket to buy
 */
export const buyTicket = async (wallet: WalletContextState, nft_mint: PublicKey, amount: number) => {
    if (wallet.publicKey === null) return;
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions());
    const program = new anchor.Program(IDL as anchor.Idl, RAFFLE_PROGRAM, provider);
    const userAddress = wallet.publicKey;
    const [globalAuthority, bump] = await PublicKey.findProgramAddress([Buffer.from(GLOBAL_AUTHORITY_SEED)], program.programId);
    const raffleKey = await getRaffleKey(nft_mint);
    if (raffleKey === null) return;
    let raffleState = await getRaffleState(nft_mint);
    if (raffleState === null) return;

    const creator = raffleState.creator;

    let userTokenAccount = await getAssociatedTokenAccount(userAddress, YAKU_TOKEN_MINT);
    const tx = await program.rpc.buyTickets(bump, new anchor.BN(amount), {
        accounts: {
            buyer: userAddress,
            raffle: raffleKey,
            globalAuthority,
            creator,
            tokenMint: YAKU_TOKEN_MINT,
            userTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId
        },
        instructions: [],
        signers: []
    });
    await solConnection.confirmTransaction(tx, 'finalized');
};

/**
 * @dev RevealWinner function
 * @param userAddress The user's address to call this function
 * @param nft_mint The nft_mint address
 */
export const revealWinner = async (wallet: WalletContextState, raffleKey: PublicKey) => {
    if (wallet.publicKey === null) return;
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions());
    const program = new anchor.Program(IDL as anchor.Idl, RAFFLE_PROGRAM, provider);
    const userAddress = wallet.publicKey;
    const tx = await program.rpc.revealWinner({
        accounts: {
            buyer: userAddress,
            raffle: raffleKey
        },
        instructions: [],
        signers: []
    });
    await solConnection.confirmTransaction(tx, 'confirmed');
    console.log('txHash =', tx);
};

/**
 * @dev ClaimReward function
 * @param userAddress The winner's address
 * @param nft_mint The nft_mint address
 */
export const claimReward = async (wallet: WalletContextState, nft_mint: PublicKey) => {
    if (wallet.publicKey === null) return;
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions());
    const program = new anchor.Program(IDL as anchor.Idl, RAFFLE_PROGRAM, provider);
    const userAddress = wallet.publicKey;
    const [globalAuthority, bump] = await PublicKey.findProgramAddress([Buffer.from(GLOBAL_AUTHORITY_SEED)], program.programId);

    const raffleKey = await getRaffleKey(nft_mint);
    if (raffleKey === null) return;
    const srcNftTokenAccount = await getAssociatedTokenAccount(globalAuthority, nft_mint);

    let ix0 = await getATokenAccountsNeedCreate(solConnection, userAddress, userAddress, [nft_mint]);
    const srcYakuTokenAccount = await getAssociatedTokenAccount(globalAuthority, YAKU_TOKEN_MINT);
    const claimerYakuTokenAccount = await getAssociatedTokenAccount(userAddress, YAKU_TOKEN_MINT);

    let tx = new Transaction();
    tx.add(...ix0.instructions);
    tx.add(
        program.instruction.claimReward(bump, {
            accounts: {
                claimer: userAddress,
                globalAuthority,
                raffle: raffleKey,
                claimerNftTokenAccount: ix0.destinationAccounts[0],
                srcNftTokenAccount,
                srcPreyTokenAccount: srcYakuTokenAccount,
                claimerPreyTokenAccount: claimerYakuTokenAccount,
                nftMintAddress: nft_mint,
                tokenProgram: TOKEN_PROGRAM_ID
            },
            instructions: [],
            signers: []
        })
    );

    const txId = await wallet.sendTransaction(tx, solConnection);
    await solConnection.confirmTransaction(txId, 'finalized');
    console.log('txHash =', tx);
};

/**
 * @dev WithdrawNFT function
 * @param userAddress The creator's address
 * @param nft_mint The nft_mint address
 */
export const withdrawNft = async (wallet: WalletContextState, nft_mint: PublicKey) => {
    if (wallet.publicKey === null) return;
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions());
    const program = new anchor.Program(IDL as anchor.Idl, RAFFLE_PROGRAM, provider);
    const userAddress = wallet.publicKey;
    const [globalAuthority, bump] = await PublicKey.findProgramAddress([Buffer.from(GLOBAL_AUTHORITY_SEED)], program.programId);
    const raffleKey = await getRaffleKey(nft_mint);
    if (raffleKey === null) return;
    const srcNftTokenAccount = await getAssociatedTokenAccount(globalAuthority, nft_mint);

    let ix0 = await getATokenAccountsNeedCreate(solConnection, userAddress, userAddress, [nft_mint]);
    console.log("Creator's NFT Account: ", ix0.destinationAccounts[0]);

    let tx = new Transaction();
    if (ix0.instructions.length !== 0) tx.add(...ix0.instructions);
    tx.add(
        program.instruction.withdrawNft(bump, {
            accounts: {
                claimer: userAddress,
                globalAuthority,
                raffle: raffleKey,
                claimerNftTokenAccount: ix0.destinationAccounts[0],
                srcNftTokenAccount,
                nftMintAddress: nft_mint,
                tokenProgram: TOKEN_PROGRAM_ID
            },
            instructions: [],
            signers: []
        })
    );
    const txId = await wallet.sendTransaction(tx, solConnection);
    await solConnection.confirmTransaction(txId, 'finalized');
    console.log('txHash =', tx);
};

export const closeRaffle = async (wallet: WalletContextState, raffleKey: PublicKey) => {
    if (wallet.publicKey === null) return;
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions());
    const program = new anchor.Program(IDL as anchor.Idl, RAFFLE_PROGRAM, provider);
    const userAddress = wallet.publicKey;
    let tx = new Transaction();
    tx.add(
        program.instruction.close({
            accounts: {
                payer: userAddress,
                raffle: raffleKey,
                systemProgram: SystemProgram.programId
            },
            signers: [wallet as unknown as Signer]
        })
    );
    const txId = await wallet.sendTransaction(tx, solConnection);
    await solConnection.confirmTransaction(txId, 'finalized');
    console.log('txHash =', tx);
};

export const getRaffleKey = async (nft_mint: PublicKey): Promise<PublicKey | null> => {
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions());
    const program = new anchor.Program(IDL as anchor.Idl, RAFFLE_PROGRAM, provider);
    let poolAccounts = await solConnection.getParsedProgramAccounts(program.programId, {
        filters: [
            {
                dataSize: RAFFLE_SIZE
            },
            {
                memcmp: {
                    offset: 40,
                    bytes: nft_mint.toBase58()
                }
            }
        ]
    });
    if (poolAccounts.length !== 0) {
        let len = poolAccounts.length;
        console.log(len);
        let max = 0;
        let maxId = 0;
        for (let i = 0; i < len; i++) {
            let state = await getStateByKey(poolAccounts[i].pubkey);
            if (state !== null && state.endTimestamp.toNumber() > max) {
                max = state.endTimestamp.toNumber();
                maxId = i;
            }
        }
        let raffleKey = poolAccounts[maxId].pubkey;
        return raffleKey;
    } else {
        return null;
    }
};

export const getRaffleGlobalState = async () => {
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions());
    const program = new anchor.Program(IDL as anchor.Idl, RAFFLE_PROGRAM, provider);
    let poolAccounts = await solConnection.getParsedProgramAccounts(program.programId, {
        filters: [
            {
                dataSize: RAFFLE_SIZE
            }
        ]
    });
    if (poolAccounts.length !== 0) {
        let len = poolAccounts.length;
        let list = [];
        for (let i = 0; i < len; i++) {
            let state = await getStateByKey(poolAccounts[i].pubkey);
            if (state) state.raffleKey = poolAccounts[i].pubkey.toBase58();
            list.push(state);
        }
        return list;
    } else {
        return null;
    }
};

export const getRaffleState = async (nft_mint: PublicKey): Promise<RafflePool | null> => {
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions());
    const program = new anchor.Program(IDL as anchor.Idl, RAFFLE_PROGRAM, provider);
    let poolAccounts = await solConnection.getParsedProgramAccounts(program.programId, {
        filters: [
            {
                dataSize: RAFFLE_SIZE
            },
            {
                memcmp: {
                    offset: 40,
                    bytes: nft_mint.toBase58()
                }
            }
        ]
    });
    if (poolAccounts.length !== 0) {
        let rentalKey = poolAccounts[0].pubkey;

        try {
            let rentalState = await program.account.rafflePool.fetch(rentalKey);
            return rentalState as unknown as RafflePool;
        } catch {
            return null;
        }
    } else {
        return null;
    }
};

export const getStateByKey = async (raffleKey: PublicKey): Promise<RafflePool | null> => {
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions());
    const program = new anchor.Program(IDL as anchor.Idl, RAFFLE_PROGRAM, provider);

    try {
        let rentalState = await program.account.rafflePool.fetch(raffleKey);
        return rentalState as unknown as RafflePool;
    } catch {
        return null;
    }
};

// IDL
export type RaffleType = {
    version: '0.1.0';
    name: 'raffle';
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
                    name: 'bump';
                    type: 'u8';
                }
            ];
        },
        {
            name: 'createRaffle';
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
                    name: 'raffle';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'ownerTempNftAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'destNftTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'nftMintAddress';
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
                },
                {
                    name: 'ticketPricePrey';
                    type: 'u64';
                },
                {
                    name: 'ticketPriceSol';
                    type: 'u64';
                },
                {
                    name: 'endTimestamp';
                    type: 'i64';
                },
                {
                    name: 'winnerCount';
                    type: 'u64';
                },
                {
                    name: 'rewardAmount';
                    type: 'u64';
                },
                {
                    name: 'whitelisted';
                    type: 'u64';
                },
                {
                    name: 'maxEntrants';
                    type: 'u64';
                }
            ];
        },
        {
            name: 'buyTickets';
            accounts: [
                {
                    name: 'buyer';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'raffle';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'globalAuthority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'creator';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'userTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenMint';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
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
                    name: 'amount';
                    type: 'u64';
                }
            ];
        },
        {
            name: 'revealWinner';
            accounts: [
                {
                    name: 'buyer';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'raffle';
                    isMut: true;
                    isSigner: false;
                }
            ];
            args: [];
        },
        {
            name: 'claimReward';
            accounts: [
                {
                    name: 'claimer';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'globalAuthority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'raffle';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'claimerNftTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'srcNftTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'srcPreyTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'claimerPreyTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'nftMintAddress';
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
            name: 'withdrawNft';
            accounts: [
                {
                    name: 'claimer';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'globalAuthority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'raffle';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'claimerNftTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'srcNftTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'nftMintAddress';
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
            name: 'close';
            accounts: [
                {
                    name: 'payer';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'raffle';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [];
        }
    ];
    accounts: [
        {
            name: 'GlobalPool';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'superAdmin';
                        type: 'publicKey';
                    }
                ];
            };
        },
        {
            name: 'RafflePool';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'creator';
                        type: 'publicKey';
                    },
                    {
                        name: 'nftMint';
                        type: 'publicKey';
                    },
                    {
                        name: 'count';
                        type: 'u64';
                    },
                    {
                        name: 'winnerCount';
                        type: 'u64';
                    },
                    {
                        name: 'noRepeat';
                        type: 'u64';
                    },
                    {
                        name: 'maxEntrants';
                        type: 'u64';
                    },
                    {
                        name: 'endTimestamp';
                        type: 'i64';
                    },
                    {
                        name: 'ticketPricePrey';
                        type: 'u64';
                    },
                    {
                        name: 'ticketPriceSol';
                        type: 'u64';
                    },
                    {
                        name: 'rewardAmount';
                        type: 'u64';
                    },
                    {
                        name: 'whitelisted';
                        type: 'u64';
                    },
                    {
                        name: 'claimedWinner';
                        type: {
                            array: ['u64', 50];
                        };
                    },
                    {
                        name: 'indexes';
                        type: {
                            array: ['u64', 50];
                        };
                    },
                    {
                        name: 'winner';
                        type: {
                            array: ['publicKey', 50];
                        };
                    },
                    {
                        name: 'entrants';
                        type: {
                            array: ['publicKey', 2000];
                        };
                    }
                ];
            };
        }
    ];
    errors: [
        {
            code: 6000;
            name: 'MaxEntrantsTooLarge';
            msg: 'Max entrants is too large';
        },
        {
            code: 6001;
            name: 'RaffleEnded';
            msg: 'Raffle has ended';
        },
        {
            code: 6002;
            name: 'NotREAPToken';
            msg: 'Your Token is not REAP Token';
        },
        {
            code: 6003;
            name: 'RaffleNotEnded';
            msg: 'Raffle has not ended';
        },
        {
            code: 6004;
            name: 'InvalidPrizeIndex';
            msg: 'Invalid prize index';
        },
        {
            code: 6005;
            name: 'EndTimeError';
            msg: 'Invalid new End time';
        },
        {
            code: 6006;
            name: 'NoPrize';
            msg: 'No prize';
        },
        {
            code: 6007;
            name: 'NotCreator';
            msg: 'You are not the Creator';
        },
        {
            code: 6008;
            name: 'NotWinner';
            msg: 'You are not the Winnner';
        },
        {
            code: 6009;
            name: 'OtherEntrants';
            msg: 'There are other Entrants';
        },
        {
            code: 6010;
            name: 'InvalidCalculation';
            msg: 'Invalid calculation';
        },
        {
            code: 6011;
            name: 'NotEnoughToken';
            msg: "You don't have enough token";
        },
        {
            code: 6012;
            name: 'NotEnoughSOL';
            msg: "You don't have enough SOL";
        },
        {
            code: 6013;
            name: 'NotEnoughTicketsLeft';
            msg: 'Not enough tickets left';
        },
        {
            code: 6014;
            name: 'RaffleStillRunning';
            msg: 'Raffle is still running';
        },
        {
            code: 6015;
            name: 'WinnersAlreadyDrawn';
            msg: 'Winner already drawn';
        },
        {
            code: 6016;
            name: 'WinnerNotDrawn';
            msg: 'Winner not drawn';
        },
        {
            code: 6017;
            name: 'InvalidRevealedData';
            msg: 'Invalid revealed data';
        },
        {
            code: 6018;
            name: 'TokenAccountNotOwnedByWinner';
            msg: 'Ticket account not owned by winner';
        },
        {
            code: 6019;
            name: 'TicketHasNotWon';
            msg: 'Ticket has not won';
        },
        {
            code: 6020;
            name: 'UnclaimedPrizes';
            msg: 'Unclaimed prizes';
        },
        {
            code: 6021;
            name: 'InvalidRecentBlockhashes';
            msg: 'Invalid recent blockhashes';
        }
    ];
};
export const IDL: RaffleType = {
    version: '0.1.0',
    name: 'raffle',
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
                    name: 'bump',
                    type: 'u8'
                }
            ]
        },
        {
            name: 'createRaffle',
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
                    name: 'raffle',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'ownerTempNftAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'destNftTokenAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'nftMintAddress',
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
                },
                {
                    name: 'ticketPricePrey',
                    type: 'u64'
                },
                {
                    name: 'ticketPriceSol',
                    type: 'u64'
                },
                {
                    name: 'endTimestamp',
                    type: 'i64'
                },
                {
                    name: 'winnerCount',
                    type: 'u64'
                },
                {
                    name: 'rewardAmount',
                    type: 'u64'
                },
                {
                    name: 'whitelisted',
                    type: 'u64'
                },
                {
                    name: 'maxEntrants',
                    type: 'u64'
                }
            ]
        },
        {
            name: 'buyTickets',
            accounts: [
                {
                    name: 'buyer',
                    isMut: true,
                    isSigner: true
                },
                {
                    name: 'raffle',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'globalAuthority',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'creator',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'userTokenAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'tokenMint',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'tokenProgram',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'systemProgram',
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
                    name: 'amount',
                    type: 'u64'
                }
            ]
        },
        {
            name: 'revealWinner',
            accounts: [
                {
                    name: 'buyer',
                    isMut: true,
                    isSigner: true
                },
                {
                    name: 'raffle',
                    isMut: true,
                    isSigner: false
                }
            ],
            args: []
        },
        {
            name: 'claimReward',
            accounts: [
                {
                    name: 'claimer',
                    isMut: true,
                    isSigner: true
                },
                {
                    name: 'globalAuthority',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'raffle',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'claimerNftTokenAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'srcNftTokenAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'srcPreyTokenAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'claimerPreyTokenAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'nftMintAddress',
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
            name: 'withdrawNft',
            accounts: [
                {
                    name: 'claimer',
                    isMut: true,
                    isSigner: true
                },
                {
                    name: 'globalAuthority',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'raffle',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'claimerNftTokenAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'srcNftTokenAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'nftMintAddress',
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
            name: 'close',
            accounts: [
                {
                    name: 'payer',
                    isMut: true,
                    isSigner: true
                },
                {
                    name: 'raffle',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false
                }
            ],
            args: []
        }
    ],
    accounts: [
        {
            name: 'GlobalPool',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'superAdmin',
                        type: 'publicKey'
                    }
                ]
            }
        },
        {
            name: 'RafflePool',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'creator',
                        type: 'publicKey'
                    },
                    {
                        name: 'nftMint',
                        type: 'publicKey'
                    },
                    {
                        name: 'count',
                        type: 'u64'
                    },
                    {
                        name: 'winnerCount',
                        type: 'u64'
                    },
                    {
                        name: 'noRepeat',
                        type: 'u64'
                    },
                    {
                        name: 'maxEntrants',
                        type: 'u64'
                    },
                    {
                        name: 'endTimestamp',
                        type: 'i64'
                    },
                    {
                        name: 'ticketPricePrey',
                        type: 'u64'
                    },
                    {
                        name: 'ticketPriceSol',
                        type: 'u64'
                    },
                    {
                        name: 'rewardAmount',
                        type: 'u64'
                    },
                    {
                        name: 'whitelisted',
                        type: 'u64'
                    },
                    {
                        name: 'claimedWinner',
                        type: {
                            array: ['u64', 50]
                        }
                    },
                    {
                        name: 'indexes',
                        type: {
                            array: ['u64', 50]
                        }
                    },
                    {
                        name: 'winner',
                        type: {
                            array: ['publicKey', 50]
                        }
                    },
                    {
                        name: 'entrants',
                        type: {
                            array: ['publicKey', 2000]
                        }
                    }
                ]
            }
        }
    ],
    errors: [
        {
            code: 6000,
            name: 'MaxEntrantsTooLarge',
            msg: 'Max entrants is too large'
        },
        {
            code: 6001,
            name: 'RaffleEnded',
            msg: 'Raffle has ended'
        },
        {
            code: 6002,
            name: 'NotREAPToken',
            msg: 'Your Token is not REAP Token'
        },
        {
            code: 6003,
            name: 'RaffleNotEnded',
            msg: 'Raffle has not ended'
        },
        {
            code: 6004,
            name: 'InvalidPrizeIndex',
            msg: 'Invalid prize index'
        },
        {
            code: 6005,
            name: 'EndTimeError',
            msg: 'Invalid new End time'
        },
        {
            code: 6006,
            name: 'NoPrize',
            msg: 'No prize'
        },
        {
            code: 6007,
            name: 'NotCreator',
            msg: 'You are not the Creator'
        },
        {
            code: 6008,
            name: 'NotWinner',
            msg: 'You are not the Winnner'
        },
        {
            code: 6009,
            name: 'OtherEntrants',
            msg: 'There are other Entrants'
        },
        {
            code: 6010,
            name: 'InvalidCalculation',
            msg: 'Invalid calculation'
        },
        {
            code: 6011,
            name: 'NotEnoughToken',
            msg: "You don't have enough token"
        },
        {
            code: 6012,
            name: 'NotEnoughSOL',
            msg: "You don't have enough SOL"
        },
        {
            code: 6013,
            name: 'NotEnoughTicketsLeft',
            msg: 'Not enough tickets left'
        },
        {
            code: 6014,
            name: 'RaffleStillRunning',
            msg: 'Raffle is still running'
        },
        {
            code: 6015,
            name: 'WinnersAlreadyDrawn',
            msg: 'Winner already drawn'
        },
        {
            code: 6016,
            name: 'WinnerNotDrawn',
            msg: 'Winner not drawn'
        },
        {
            code: 6017,
            name: 'InvalidRevealedData',
            msg: 'Invalid revealed data'
        },
        {
            code: 6018,
            name: 'TokenAccountNotOwnedByWinner',
            msg: 'Ticket account not owned by winner'
        },
        {
            code: 6019,
            name: 'TicketHasNotWon',
            msg: 'Ticket has not won'
        },
        {
            code: 6020,
            name: 'UnclaimedPrizes',
            msg: 'Unclaimed prizes'
        },
        {
            code: 6021,
            name: 'InvalidRecentBlockhashes',
            msg: 'Invalid recent blockhashes'
        }
    ]
};