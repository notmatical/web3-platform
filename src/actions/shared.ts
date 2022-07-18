/* eslint-disable */

import * as anchor from '@project-serum/anchor';
import { web3 } from '@project-serum/anchor';
import { programs } from '@metaplex/js';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { RAFFLE_ADMINS, METAPLEX } from 'config';

// helpers

export const solConnection = new web3.Connection(web3.clusterApiUrl('mainnet-beta'), { confirmTransactionInitialTimeout: 120000 });

export const adminValidation = (wallet: WalletContextState) => {
    let res = false;
    if (wallet.publicKey === null) return false;
    const address = wallet.publicKey;
    for (let item of RAFFLE_ADMINS) {
        res = res || (item.address === address.toBase58())
    }
    return res
}

export const getNftMetaData = async (nftMintPk: PublicKey) => {
    let { metadata: { Metadata } } = programs;
    let metadataAccount = await Metadata.getPDA(nftMintPk);
    const metadata = await Metadata.load(solConnection, metadataAccount);
    return metadata.data.data.uri;
}

export const getMetadata = async (mint: PublicKey): Promise<PublicKey> => {
    return (
        await PublicKey.findProgramAddress([Buffer.from('metadata'), METAPLEX.toBuffer(), mint.toBuffer()], METAPLEX)
    )[0];
};

export const getNftTokenAccount = async (nftMintPk: PublicKey): Promise<PublicKey> => {
    let tokenAccount = await solConnection.getProgramAccounts(
        TOKEN_PROGRAM_ID,
        {
            filters: [
                {
                    dataSize: 165
                },
                {
                    memcmp: {
                        offset: 64,
                        bytes: '2'
                    }
                },
                {
                    memcmp: {
                        offset: 0,
                        bytes: nftMintPk.toBase58()
                    }
                 },
            ]
        }
    );
    return tokenAccount[0].pubkey;
}

export const getOwnerOfNFT = async (nftMintPk: PublicKey): Promise<PublicKey> => {
    let tokenAccountPK = await getNftTokenAccount(nftMintPk);
    let tokenAccountInfo = await solConnection.getAccountInfo(tokenAccountPK);
  
    if (tokenAccountInfo && tokenAccountInfo.data ) {
        let ownerPubkey = new PublicKey(tokenAccountInfo.data.slice(32, 64))
        return ownerPubkey;
    }
    return new PublicKey("");
}

export const getAssociatedTokenAccount = async (ownerPubkey: PublicKey, mintPk: PublicKey): Promise<PublicKey> => {
    let associatedTokenAccountPubkey = (await PublicKey.findProgramAddress(
        [
            ownerPubkey.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            mintPk.toBuffer(), // mint address
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
    ))[0];
    return associatedTokenAccountPubkey;
}

export const getATokenAccountsNeedCreate = async (
    connection: anchor.web3.Connection,
    walletAddress: anchor.web3.PublicKey,
    owner: anchor.web3.PublicKey,
    nfts: anchor.web3.PublicKey[],
) => {
    let instructions = [], destinationAccounts = [];
    for (const mint of nfts) {
        const destinationPubkey = await getAssociatedTokenAccount(owner, mint);
        let response = await connection.getAccountInfo(destinationPubkey);
        if (!response) {
            const createATAIx = createAssociatedTokenAccountInstruction(
                destinationPubkey,
                walletAddress,
                owner,
                mint,
            );
            instructions.push(createATAIx);
        }
        destinationAccounts.push(destinationPubkey);
        if (walletAddress != owner) {
            const userAccount = await getAssociatedTokenAccount(walletAddress, mint);
            response = await connection.getAccountInfo(userAccount);
            if (!response) {
                const createATAIx = createAssociatedTokenAccountInstruction(
                    userAccount,
                    walletAddress,
                    walletAddress,
                    mint,
                );
                instructions.push(createATAIx);
            }
        }
    }
    return {
        instructions,
        destinationAccounts,
    };
}

export const createAssociatedTokenAccountInstruction = (
    associatedTokenAddress: anchor.web3.PublicKey,
    payer: anchor.web3.PublicKey,
    walletAddress: anchor.web3.PublicKey,
    splTokenMintAddress: anchor.web3.PublicKey
) => {
    const keys = [
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
        { pubkey: walletAddress, isSigner: false, isWritable: false },
        { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
        {
            pubkey: anchor.web3.SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        {
            pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
    ];
    return new anchor.web3.TransactionInstruction({
        keys,
        programId: ASSOCIATED_TOKEN_PROGRAM_ID,
        data: Buffer.from([]),
    });
}