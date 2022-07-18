import API from 'utils/api';
import bs58 from 'bs58';

import { Connection, SystemProgram, Transaction } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';

const ERROR_MAP = {
    MISSING_WALLET: 'You do not have a wallet of this type.',
    TX_FAILED: 'Transaction failed. Make sure your ledger is connected to the Solana application.',
    TX_TIMEOUT: 'Transaction timed out. This may be an issue with the Solana Network.',
    SIG_FAILED: 'Signing message failed. Make sure you are not connected to a hardware wallet.',
    REQUEST_REJECTED: 'User rejected the request.'
};

/* eslint-disable */
export default class Wallet {
    id: string = '';
    wallet: any = null;
    name: string = '';
    publicKey: any = null;
    connection: any = null;

    constructor(wallet: any, connection: any) {
        this.wallet = wallet;
        this.publicKey = wallet?.publicKey;
        this.id = wallet?.publicKey?.toBase58();
        this.name = wallet?.wallet?.adapter?.name;
        this.connection = connection;
    }

    get errors() {
        return ERROR_MAP;
    }

    async connect() {
        this.wallet.connect();
    }

    async disconnect() {
        this.wallet.disconnect();
    }

    async signTransaction() {
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: this.publicKey,
                toPubkey: this.publicKey,
                lamports: 1000
            })
        );

        transaction.feePayer = this.publicKey;
        const blockhashObj = await this.connection.getRecentBlockhash();
        transaction.recentBlockhash = blockhashObj.blockhash;

        const signature = await this.wallet.sendTransaction(
            transaction,
            this.connection
        );

        return signature;
    }

    async signMessage(nonce: string = '') {
        const message = `Welcome to the Yaku Labs Dashboard!\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nYour authentication status will reset after 24 hours.\n\nWallet address:\n${this.id}`;
        const encodedMessage = new TextEncoder().encode(message);
        let signature = await this.wallet.signMessage!(encodedMessage);
        if (!signature) throw new Error('Signature Failed');
        // signature = bs58.encode(signature);
        return signature;
    }
}