import React, { useContext, useState } from 'react';

// web3 imports
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

// project imports
import { MetaContextState } from 'contexts/meta/types';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

const MetaContext = React.createContext<MetaContextState>({
    isLoading: false,
    balance: 0,
    fetchBalance: () => {},
    startLoading: () => {},
    stopLoading: () => {}
});

export function MetaProvider({ children = null }: { children: any }) {
    const connection = useConnection();
    const wallet = useWallet();

    // Loading Meta
    const [isLoading, setIsLoading] = useState(false);
    const startLoading = () => {
        if (connection && wallet) {
            setIsLoading(true);
        }
    };

    const stopLoading = () => {
        if (connection && wallet) {
            setIsLoading(false);
        }
    };

    // Balance Meta
    const [balance, setBalance] = useState(0);
    // eslint-disable-next-line consistent-return
    const fetchBalance = async (publicKey: PublicKey, connect: Connection) => {
        try {
            const amount = await connect.getBalance(publicKey, 'confirmed');
            setBalance(amount / LAMPORTS_PER_SOL);
            return amount / LAMPORTS_PER_SOL;
        } catch (e) {
            console.log(`Error fetching solana balance: ${e}`);
        }
    };

    return (
        <MetaContext.Provider
            value={{
                startLoading,
                stopLoading,
                fetchBalance,
                isLoading,
                balance
            }}
        >
            {children}
        </MetaContext.Provider>
    );
}

export const useMeta = () => {
    const context = useContext(MetaContext);
    return context;
};
