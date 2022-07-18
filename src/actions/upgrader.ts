/* eslint-disable */
import { PublicKey, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL, TransactionInstruction } from '@solana/web3.js';
import { serialize } from 'borsh'
import { WalletContextState } from '@solana/wallet-adapter-react';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';

// project imports
import { createAssociatedTokenAccountInstruction, solConnection } from './shared';
import { artUA, REWARD_TOKEN_MINT, REWARD_TOKEN_DECIMAL } from 'config/config'
import bs58 from 'bs58';

export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
)

export function createUpdateMetadataInstruction(metadataAccount: PublicKey, payer: PublicKey, txnData: Buffer) {
    const keys = [
        {
            pubkey: metadataAccount,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: payer,
            isSigner: true,
            isWritable: false,
        }
    ]

    return new TransactionInstruction({
        keys,
        programId: TOKEN_METADATA_PROGRAM_ID,
        data: txnData,
    });
}

export class Creator {
    address: string;
    verified: number;
    share: number;

    constructor(args: {
        address: string;
        verified: number;
        share: number;
    }) {
        this.address = args.address;
        this.verified = args.verified;
        this.share = args.share;
    }
}

export class Data {
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints: number;
    creators: Creator[] | null;
    constructor(args: {
        name: string;
        symbol: string;
        uri: string;
        sellerFeeBasisPoints: number;
        creators: Creator[] | null;
    }) {
        this.name = args.name;
        this.symbol = args.symbol;
        this.uri = args.uri;
        this.sellerFeeBasisPoints = args.sellerFeeBasisPoints;
        this.creators = args.creators;
    }
}

export class UpdateMetadataArgs {
    instruction: number = 1;
    data: Data | null;
    // Not used by this app, just required for instruction
    updateAuthority: string | null;
    primarySaleHappened: boolean | null;
    constructor(args: {
        data?: Data;
        updateAuthority?: string;
        primarySaleHappened: boolean | null;
    }) {
        this.data = args.data ? args.data : null;
        this.updateAuthority = args.updateAuthority ? args.updateAuthority : null;
        this.primarySaleHappened = args.primarySaleHappened;
    }
}

export const METADATA_SCHEMA = new Map<any, any>([
    [
        UpdateMetadataArgs,
        {
            kind: 'struct',
            fields: [
                ['instruction', 'u8'],
                ['data', { kind: 'option', type: Data }],
                ['updateAuthority', { kind: 'option', type: 'pubkeyAsString' }],
                ['primarySaleHappened', { kind: 'option', type: 'u8' }],
            ],
        },
    ],
    [
        Data,
        {
            kind: 'struct',
            fields: [
                ['name', 'string'],
                ['symbol', 'string'],
                ['uri', 'string'],
                ['sellerFeeBasisPoints', 'u16'],
                ['creators', { kind: 'option', type: [Creator] }],
            ],
        },
    ],
    [
        Creator,
        {
            kind: 'struct',
            fields: [
                ['address', 'pubkeyAsString'],
                ['verified', 'u8'],
                ['share', 'u8'],
            ],
        },
    ],
]);

export const sendTransaction = async(wallet: any, conn: any, transaction : Transaction, signers : Keypair[]) => {
    try {
        transaction.feePayer = wallet.publicKey
        transaction.recentBlockhash = (await conn.getRecentBlockhash('max')).blockhash;
        transaction.setSigners(wallet.publicKey,...signers.map(s => s.publicKey));

        if(signers.length != 0)
            transaction.partialSign(...signers)
    
        const signedTransaction = await wallet.signTransaction(transaction);
        let hash = await conn.sendRawTransaction(await signedTransaction.serialize());
        await conn.confirmTransaction(hash);
    } catch(err) {
        console.log(err)
    }
}

const getTokenWallet = async (wallet: PublicKey, mint: PublicKey) => {
	return (
	    await PublicKey.findProgramAddress(
		    [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
		    ASSOCIATED_TOKEN_PROGRAM_ID
	    )
	)[0];
};

export const updateMetadata = async(
    wallet: WalletContextState,
	mint: string,
    item: {
		name: string,
		symbol: string,
		sellerFeeBasisPoints: number,
		creators: Creator[] | null,
	},
    newUri: string,
    startLoading: Function,
    stopLoading: Function,
    updatePage: Function
) => {
  	startLoading();
	const newData = new Data({
		name: item.name,
		symbol: item.symbol,
		uri: newUri,
		sellerFeeBasisPoints: item.sellerFeeBasisPoints,
		creators: item.creators!.map(
		(c : any) => new Creator({
			...c, address: new PublicKey(c.address).toBase58()
		}),)
	})

	const updateKey = Keypair.fromSecretKey(bs58.decode(artUA!))
	const value = new UpdateMetadataArgs({
		data: newData,
		updateAuthority: updateKey.publicKey!.toBase58(),
		primarySaleHappened: null,
	})
	const txnData = Buffer.from(serialize(METADATA_SCHEMA, value))
	let transaction = new Transaction()

	// Solana Payment
	transaction.add(
		SystemProgram.transfer({
			fromPubkey: wallet.publicKey!,
			toPubkey: updateKey.publicKey,
			lamports: 0.1 * LAMPORTS_PER_SOL,
		})
	)

	// Token Payment
	const mintKey = REWARD_TOKEN_MINT;
	const srcTokenAccount = await getTokenWallet(wallet.publicKey!, mintKey);
	const destTokenAccount = await getTokenWallet(updateKey.publicKey, mintKey);

	if(await solConnection.getAccountInfo(destTokenAccount) === null)
		transaction.add(
			createAssociatedTokenAccountInstruction(
				destTokenAccount,
				wallet.publicKey!,
				updateKey.publicKey,
				mintKey,
			)
		)

	transaction.add(
		Token.createTransferInstruction(
			TOKEN_PROGRAM_ID,
			srcTokenAccount,
			destTokenAccount,
			wallet.publicKey!,
			[],
			280 * REWARD_TOKEN_DECIMAL
		)
	)

	// Update Metadata
	let [pda, _] = await PublicKey.findProgramAddress(
		[
			Buffer.from("metadata"),
			TOKEN_METADATA_PROGRAM_ID.toBuffer(),
			new PublicKey(mint).toBuffer()
		],
		TOKEN_METADATA_PROGRAM_ID,
	)
	transaction.add(
		createUpdateMetadataInstruction(
			pda,
			updateKey.publicKey,
			txnData,
		)
	)

	await sendTransaction(wallet, solConnection, transaction, [updateKey])
	stopLoading()
	updatePage()
}