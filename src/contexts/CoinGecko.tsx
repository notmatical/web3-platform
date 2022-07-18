import React, { useContext, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export const COINGECKO_POOL_INTERVAL = 1000 * 60; // 60 sec
export const COINGECKO_API = 'https://api.coingecko.com/api/v3/';
export const COINGECKO_COIN_PRICE_API = `${COINGECKO_API}simple/price`;

export interface CoinGeckoContextState {
    solPrice: number;
    ethPrice: number;
}

export const solToUsd = async (): Promise<number> => {
    const url = `${COINGECKO_COIN_PRICE_API}?ids=solana&vs_currencies=usd`;
    const resp = await window.fetch(url).then((response) => response.json());
    return resp.solana.usd;
};

export const ethToUsd = async (): Promise<number> => {
    const url = `${COINGECKO_COIN_PRICE_API}?ids=ethereum&vs_currencies=usd`;
    const resp = await window.fetch(url).then((response) => response.json());
    return resp.ethereum.usd;
};

const CoinGeckoContext = React.createContext<CoinGeckoContextState | null>(null);

export function CoinGeckoProvider({ children = null }: { children: any }) {
    const { publicKey, connected } = useWallet();

    const [solPrice, setSolPrice] = useState<number>(0);
    const [ethPrice, setEthPrice] = useState<number>(0);

    useEffect(() => {
        let timerId = 0;
        const queryPrice = async () => {
            const solprice = await solToUsd();
            setSolPrice(solprice);
            const ethprice = await ethToUsd();
            setEthPrice(ethprice);

            if (publicKey && connected) {
                startTimer();
            }
        };

        const startTimer = () => {
            timerId = window.setTimeout(async () => {
                queryPrice();
            }, COINGECKO_POOL_INTERVAL);
        };

        queryPrice();
        return () => {
            clearTimeout(timerId);
        };
    }, [setSolPrice, setEthPrice]);

    // prettier-ignore
    return (
        <CoinGeckoContext.Provider value={{ solPrice, ethPrice }}>
            {children}
        </CoinGeckoContext.Provider>
    );
}

export const useCoinGecko = () => {
    const context = useContext(CoinGeckoContext);
    return context as CoinGeckoContextState;
};

export const useSolPrice = () => {
    const { solPrice } = useCoinGecko();
    return solPrice;
};

export const useEthPrice = () => {
    const { ethPrice } = useCoinGecko();
    return ethPrice;
};
