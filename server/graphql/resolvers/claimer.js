import { Claimer, Wallet } from '../../models/models.js';
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
import { getOrCreateAssociatedTokenAccount, transfer } from '@solana/spl-token';
import moment from 'moment';
import { decrypt, encrypt } from '../../utils/encrypt.js';

const addDays = (lastDate, period, day) => {
    const oldDate = new Date(lastDate.valueOf());
    const newDate = oldDate;
    const days = parseInt(day);
    if (period === 'Daily') {
        newDate.setDate(newDate.getDate() + days);
        return newDate;
    } else if (period === 'Weekly') {
        const addDate = (~~(days / 7) + 1) * 7;
        newDate.setDate(newDate.getDate() + addDate);
        return newDate;
    } else if (period === 'BiWeekly') {
        const addDate = (~~(days / 15) + 1) * 15;
        newDate.setDate(newDate.getDate() + addDate);
        return newDate;
    } else if (period === 'Monthly') {
        const addDate = (~~(days / 30) + 1) * 30;
        newDate.setDate(oldDate.getDate() + addDate);
        return newDate;
    } else {
        return newDate;
    }
};

const getDelayedTime = (period, day) => {
    const days = parseInt(day);
    console.log(0);
    if (period === 'Daily') {
        console.log(1);
        return days;
    } else if (period === 'Weekly') {
        console.log(2);
        return ~~(days / 7) + 1;
    } else if (period === 'BiWeekly') {
        console.log(3);
        return ~~(days / 15) + 1;
    } else if (period === 'Monthly') {
        console.log(4);
        return ~~(days / 30) + 1;
    } else {
        return days;
    }
};

export default {
    Query: {
        // TODO: projection, pagination, sanitization
        getClaimers: async (root, args, context, info) => {
            const res = await Claimer.find({});
            return res;
        },
        getClaimer: async (root, args, context, info) => {
            const res = await Claimer.find({ wallet: args.wallet });
            return res;
        },
        getEmployees: async (root, args, context, info) => {
            const res = await Claimer.find({ project: args.project });
            return res;
        }
    },
    Mutation: {
        createClaimer: async (root, args, context, info) => {
            try {
                const claim = args;
                claim.name = claim.name.toString().toLowerCase();
                const claimer = await Claimer.findOne({ project: claim.project, name: claim.name });
                if (claimer) {
                    console.log('FIND : YES');
                    console.log('Already employed on the project');

                    // res.status(400).send("existing");
                    return 'existing';
                } else {
                    console.log('FIND : NO');

                    const res = await Claimer.create({ ...claim, transactionHash: [] });
                    return res;
                }
            } catch (err) {
                console.error(err.message);
            }
        },

        deleteClaimer: async (root, args, context, info) => {
            try {
                const claimer = await Claimer.findOne({ project: args.project, name: args.name, wallet: args.wallet });
                console.log(claimer);
                // return claimer
                if (!claimer) {
                    console.log('Claimer not found');
                    return 'existing';
                } else {
                    await claimer.remove().then(() => {
                        console.log('Claimer removed');
                    });
                    res.send('Claimer removed');
                }
            } catch (err) {
                console.error(err.message);
            }
        },

        clickClaim: async (root, args, context, info) => {
            const connection = new Connection(clusterApiUrl('mainnet-beta'));
            try {
                const { secretKey, owner } = await Wallet.findOne({ project: args.project }).populate('owner');
                const salt = `${args.project}|${owner.wallet}`;
                const res = await Claimer.findOne({ project: args.project, wallet: args.wallet, method: args.method });
                if (res.method == 'SOL') {
                    // SOL case
                    console.log('method : SOL');
                    const houseWallet = Keypair.fromSecretKey(bs58.decode(decrypt(secretKey, salt)));
                    let transaction = new Transaction();
                    const delayedDays = getDelayedTime(res.period, args.delayed);
                    transaction.add(
                        SystemProgram.transfer({
                            fromPubkey: houseWallet.publicKey,
                            toPubkey: new PublicKey(args.wallet),
                            lamports: res.amount * LAMPORTS_PER_SOL * delayedDays
                        })
                    );
                    let hash = await sendAndConfirmTransaction(connection, transaction, [houseWallet]);
                    console.log('txHash :', hash);
                    const newTransaction = { date: args.claimTime, txHash: hash };
                    // Updating Claiming Time
                    const oldDate = new Date(res.time);
                    const newDate = addDays(oldDate, res.period, args.delayed);
                    const dateStr = moment(newDate).format('YYYY-MM-DDTHH:MM:SS');

                    Claimer.findOne({ project: args.project, wallet: args.wallet, method: args.method }, function (err, doc) {
                        doc.transactionHash.push(newTransaction);
                        doc.time = dateStr;
                        doc.save();
                    });
                    const finished = Claimer.findOne({ project: args.project, wallet: args.wallet, method: args.method });
                    console.log('Finished : ', finished.transactionHash);
                    return finished;
                } else if (res.method == 'USDC') {
                    // USDC case
                    console.log('method : USDC');
                    const fromWallet = Keypair.fromSecretKey(bs58.decode(decrypt(secretKey, salt)));
                    const toWallet = new Anchor.web3.PublicKey(args.wallet);
                    const mintPublicKey = new Anchor.web3.PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
                    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
                        connection,
                        fromWallet.payer,
                        mintPublicKey,
                        fromWallet.publicKey
                    );
                    const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromWallet, mintPublicKey, toWallet);
                    const delayedDays = getDelayedTime(res.period, args.delayed);
                    let hash = await transfer(
                        connection,
                        fromWallet,
                        fromTokenAccount.address,
                        toTokenAccount.address,
                        fromWallet.publicKey,
                        res.amount * LAMPORTS_PER_SOL * delayedDays
                    );
                    const newTransaction = { date: args.claimTime, txHash: hash };
                    // Updating Claiming Time
                    const oldDate = new Date(res.time);
                    const newDate = addDays(oldDate, res.period, args.delayed);
                    const dateStr = moment(newDate).format('YYYY-MM-DDTHH:MM:SS');

                    Claimer.findOne({ project: args.project, wallet: args.wallet, method: args.method }, function (err, doc) {
                        doc.transactionHash.push(newTransaction);
                        doc.time = dateStr;
                        doc.save();
                    });
                    const finished = Claimer.findOne({ project: args.project, wallet: args.wallet });
                    console.log('Finished : ', finished);
                    return finished;
                } else {
                    console.log('result : ', res);
                }
            } catch (err) {
                console.error(err.message);
            }
        }
    }
};