import { sleep } from 'utils/utils';
import { Blockhash, FeeCalculator, TransactionSignature, Connection, Commitment, SignatureStatus } from '@solana/web3.js';

interface BlockhashAndFeeCalculator {
    blockhash: Blockhash;
    feeCalculator: FeeCalculator;
}

export const DEFAULT_TIMEOUT = 15000;

export const getUnixTs = () => new Date().getTime() / 1000;

export const envFor = (connection: Connection): string => {
    const endpoint = (connection as any).rpcEndpoint;
    console.log(connection);
    const regex = /https:\/\/api.([^.]*).solana.com/;
    const match = endpoint.match(regex);

    if (match?.length > 0) {
        return match[1];
    }
    return 'mainnet-beta';
};

export const explorerLinkFor = (txid: TransactionSignature, connection: Connection): string =>
    `https://explorer.solana.com/tx/${txid}?cluster=${envFor(connection)}`;

// export async function handleTransaction(
//     tx: string,
//     opts: {
//         showLogs: boolean
//         commitment: Commitment
//     } = {
//         showLogs: false,
//         commitment: 'confirmed',
//     }
//     ) {
//     await reattempt.run({ times: 2, delay: 1000 }, async () => {
//         await connection.confirmTransaction(tx)
//     })

//     const trans = await connection.getTransaction(tx)
//     if (!trans) {
//         console.log('transaction not found', tx)

//         return tx
//     }

//     if (opts?.showLogs) {
//         console.log('trans logs', trans?.meta?.logMessages)
//     }

//     return tx
// }

// export function awaitTransactionSignatureConfirmation(
//     txid: TransactionSignature,
//     timeout: number,
//     connection: Connection,
//     commitment: Commitment = 'recent',
//     queryStatus = false
// ): Promise<SignatureStatus | null | void> {
//     let done = false;
//     let subId = 0;
//     let status: SignatureStatus | null | void = {
//         slot: 0,
//         confirmations: 0,
//         err: null
//     };

//     status = new Promise((resolve, reject) => {
//         setTimeout(() => {
//             if (done) return;
//             done = true;
//             console.log('Rejecting for timeout..');
//         }, timeout);

//         try {
//             subId = connection.onSignature(
//                 txid,
//                 (result, context) => {
//                     done = true;
//                     status = {
//                         err: result.err,
//                         slot: context.slot,
//                         confirmations: 0
//                     };

//                     if (result.err) {
//                         console.log('Rejected via websock', result.arr);
//                         reject(status);
//                     } else {
//                         console.log('Resolved via websocket', result);
//                         resolve(status);
//                     }
//                 },
//                 commitment,
//             );
//         } catch (error) {
//             done = true;
//             console.error('WS error in setup', txid, e);
//         }

//         while (!done && queryStatus) {
//             // eslint-disable-next-line no-loop-func
//             (async () => {
//                 try {
//                     const SignatureStatuses = await connection.getSignatureStatuses([
//                         txid,
//                     ]);
//                     status = SignatureStatuses && SignatureStatuses.value[0];
//                     console.log(explorerLinkFor(txid, connection));
//                     if (!done) {
//                         if (!status) {
//                             console.log('REST null result for', txid, status);
//                         } else if (status.err) {
//                             console.error('REST error for', txid, status);
//                             done = true;
//                             reject(status.err);
//                         } else if (!status.confirmations) {
//                             console.error('REST no confirmations for', txid, status);
//                         } else {
//                             console.debug('REST confirmation for', txid, status);
//                             done = true;
//                             resolve(status);
//                         }
//                     }
//                 } catch (error) {
//                     if (!done) {
//                         console.error('REST connection error: txid', txid, e);
//                     }
//                 }
//             })();
//             sleep(2000);
//         }
//     });

//     //@ts-ignore
//     if (connection._signatureSubscriptions[subId])
//     connection.removeSignatureListener(subId);
//     done = true;
//     console.debug('Returning status', status);
//     return status;
// }
