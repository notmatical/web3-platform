import {
    Connection,
    Keypair,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL,
    PublicKey,
    clusterApiUrl,
    sendAndConfirmTransaction
} from '@solana/web3.js';
import * as splToken from '@solana/spl-token';
import * as Anchor from '@project-serum/anchor';
import bs58 from 'bs58';

// project imports
import { User, Wallet } from '../../models/models';
import { decrypt, encrypt } from '../../utils/encrypt';

export default {
    Query: {
        // TODO: projection, pagination, sanitization
        // need to return only publicKey
        getWallets: async (root, args, context, info) => {
            const owner = await User.findOne({ wallet: args.wallet });
            return await Wallet.find({ owner }, '-secretKey');
        },
        getWalletPubkey: async (root, args, context, info) => {
            const owner = await User.findOne({ wallet: args.wallet });
            const res = await Wallet.findOne({ project: args.project, owner });
            const secretKey = decrypt(res.secretKey, `${args.project}|${args.wallet}`);
            const houseWallet = Keypair.fromSecretKey(bs58.decode(secretKey)).publicKey.toBase58();
            return { pubkey: houseWallet };
        }
    },
    Mutation: {
        createWallet: async (root, args, context, info) => {
            const keypair = Keypair.generate();
            const owner = await User.findOne({ wallet: args.wallet });
            const secretKey = encrypt(bs58.encode(keypair.secretKey), `${args.project}|${args.wallet}`);
            const res = await Wallet.create({ project: args.project, secretKey, owner });
            return res;
        },
        clickWithdraw: async (root, args, context, info) => {
            const connection = new Connection(clusterApiUrl('mainnet-beta'));
            const { secretKey, owner } = await Wallet.findOne({
                project: args.project
            }).populate('owner');
            const salt = `${args.project}|${owner.wallet}`;
            if (args.method == 'SOL') {
                // SOL case
                console.log('method : SOL');
                console.log('amount : ', args.amount);
                const houseWallet = Keypair.fromSecretKey(bs58.decode(decrypt(secretKey, salt)));
                let transaction = new Transaction();
                transaction.add(
                    SystemProgram.transfer({
                        fromPubkey: houseWallet.publicKey,
                        toPubkey: new PublicKey(owner.wallet),
                        lamports: args.amount * LAMPORTS_PER_SOL
                    })
                );
                let hash = await sendAndConfirmTransaction(connection, transaction, [houseWallet]);
                console.log('txHash :', hash);
                return hash;
            } else if (args.method == 'USDC') {
                // USDC case
                console.log('method : USDC');
                console.log('amount : ', args.amount);
                const fromWallet = Keypair.fromSecretKey(bs58.decode(decrypt(secretKey, salt)));
                const toWallet = new Anchor.web3.PublicKey(owner.wallet);
                const mintPublicKey = new Anchor.web3.PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
                const USDC_Token = new splToken.Token(connection, mintPublicKey, TOKEN_PROGRAM_ID, fromWallet);
                const fromTokenAccount = await USDC_Token.getOrCreateAssociatedTokenAccount(
                    connection,
                    fromWallet.payer,
                    mintPublicKey,
                    fromWallet.publicKey
                );
                const toTokenAccount = await USDC_Token.getOrCreateAssociatedTokenAccount(connection, fromWallet, mintPublicKey, toWallet);
                let hash = await USDC_Token.transfer(
                    connection,
                    fromWallet,
                    fromTokenAccount.address,
                    toTokenAccount.address,
                    fromWallet.publicKey,
                    args.amount
                );
                return hash;
            }
        }
    }
};