import { Connection, PublicKey } from "@solana/web3.js";

export interface MetaContextState {
    isLoading: boolean;
    balance: number;
    fetchBalance: (publicKey: PublicKey, connect: Connection) => void;
    startLoading: () => void;
    stopLoading: () => void;
}