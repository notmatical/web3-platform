import React from 'react';
// @ts-ignore
import * as CoinGecko from 'coingecko-api';

const PRICE_REFRESH = 10000;
const CoinGeckoClient = new CoinGecko();

export enum CoinGeckoStatus {
    Success,
    FetchFailed,
    Loading
}

export interface CoinInfo {
    price: number;
    volume_24: number;
    market_cap: number;
    price_change_percentage_24h: number;
    market_cap_rank: number;
    last_updated: Date;
}

export interface CoinHistoryInfo {
    price: number;
    market_cap: number;
    total_volume: number;
}

export interface CoinInfoResult {
    data: {
        market_data: {
            current_price: {
                usd: number;
            };
            total_volume: {
                usd: number;
            };
            market_cap: {
                usd: number;
            };
            price_change_percentage_24h: number;
            market_cap_rank: number;
        };
        last_updated: string;
    };
}

export interface CoinHistoryInfoResult {
    data: {
        market_data: {
            current_price: { [key: string]: number };
            market_cap: { [key: string]: number };
            total_volume: { [key: string]: number };
        }
    }
}

export type CoinGeckoResult = {
    coinInfo?: CoinInfo;
    status: CoinGeckoStatus;
};

export type CoinGeckoHistoryResult = {
    coinInfo?: CoinHistoryInfo;
    status: CoinGeckoStatus;
};

export type CoinGeckoCoins = {
    address: string;
    price: number;
    price_change_percentage_24h: number;
    value: number;
};

export function useCoinGecko(coinId?: string): CoinGeckoResult | undefined {
    const [coinInfo, setCoinInfo] = React.useState<CoinGeckoResult>();

    React.useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        let fetched = true;

        if (coinId) {
            const getCoinInfo = (refresh = false) => {
                if (!refresh) {
                    setCoinInfo({
                        status: CoinGeckoStatus.Loading
                    });
                }

                if (fetched) {
                    CoinGeckoClient.coins
                        .fetch(coinId)
                        .then((info: CoinInfoResult) => {
                            setCoinInfo({
                                coinInfo: {
                                    price: info.data.market_data.current_price.usd,
                                    volume_24: info.data.market_data.total_volume.usd,
                                    market_cap: info.data.market_data.market_cap.usd,
                                    market_cap_rank: info.data.market_data.market_cap_rank,
                                    price_change_percentage_24h: info.data.market_data.price_change_percentage_24h,
                                    last_updated: new Date(info.data.last_updated),
                                },
                                status: CoinGeckoStatus.Success
                            });
                        })
                        .catch((err: any) => {
                            setCoinInfo({
                                status: CoinGeckoStatus.FetchFailed
                            });
                        });
                }
            };

            getCoinInfo();
            interval = setInterval(() => {
                getCoinInfo(true);
            }, PRICE_REFRESH);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
            fetched = false;
        };
    }, [setCoinInfo, coinId]);

    return coinInfo;
}

export function useCoinGeckoHistory(coinId?: string, date?: number | null) {
    const [coinInfo, setCoinInfo] = React.useState<CoinGeckoHistoryResult>();

    React.useEffect(() => {
        if (coinId && date) {
            const getCoinInfo = (refresh = false) => {
                if (!refresh) {
                    setCoinInfo({
                        status: CoinGeckoStatus.Loading
                    });
                }

                const requestedDate = new Date(date * 1000);
                const geckoDate = `${requestedDate.getUTCDate()}-${requestedDate.getUTCMonth() + 1}-${requestedDate.getUTCFullYear()}`;

                CoinGeckoClient.coins
                    .fetchHistory(coinId, { date: geckoDate })
                    .fetch((info: CoinHistoryInfoResult) => {
                        setCoinInfo({
                            coinInfo: {
                                market_cap: info.data.market_data.market_cap.usd,
                                price: info.data.market_data.current_price.usd,
                                total_volume: info.data.market_data.total_volume.usd
                            },
                            status: CoinGeckoStatus.Success
                        });
                    })
                    .catch((err: any) => {
                        setCoinInfo({
                            status: CoinGeckoStatus.FetchFailed
                        });
                    });
            };

            getCoinInfo();
        }
    }, [setCoinInfo, coinId, date]);

    return coinInfo;
}

export async function netWorth({ tokens, registries }: { tokens: any[]; registries: any[]; }) {
    let coins = registries.map((registry, index) => {
        const quantity = Number(tokens[index].info.tokenAmount.uiAmountString);
        const coinGeckoId = registry?.extensions?.coingeckoId;
        if (!coinGeckoId) return null

        return {
            coinGeckoId,
            quantity
        }
    }).filter(names => { return names !== null });

    const coinNames = coins.map(coin => coin?.coinGeckoId);
    const uniqueCoinNames = [...new Set(coinNames)];

    const prices = uniqueCoinNames.length > 0 && await CoinGeckoClient.simple.price({
        ids: uniqueCoinNames,
        vs_currencies: ['usd']
    }).then((info: any)=> {
        const coinList = coins.map(coin => {
            let amount;
    
            if(info.data.hasOwnProperty(coin?.coinGeckoId)) {
                amount = Number(coin?.quantity ?? 0) * Number(info.data[coin?.coinGeckoId].usd ?? 0);
            }
            return amount ?? 0;
        })
        return coinList.reduce<number>((total, token) => total + token ?? 0, 0);
    }).catch(() => {
        return 0
    });

    const solPrice = await CoinGeckoClient.simple.price({
        ids: ['solana'],
        vs_currencies: ['usd']
    })
    .then((info: any) => {
        return info.data.solana.usd;
    })
    .catch(() => 0);

    const usd: number = prices;
    const sol: number = prices / Number(solPrice);

    return {
        usd,
        sol,
        solPrice
    };
}

export async function getCoinData(tokens: any[], registries: any[]): Promise<CoinGeckoCoins[]> {
    let coins = registries.map((registry, index) => {
        const quantity = Number(tokens[index].info.tokenAmount.uiAmountString);
        const coinGeckoId = registry?.extensions?.coingeckoId;
        if (!coinGeckoId) return null
  
        return {
            coinGeckoId,
            quantity,
            address: registry.address
        }
    }).filter(registry => registry !== null);
  
    const coinNames = coins.map(coin => coin?.coinGeckoId);
    const uniqueCoinNames = [...new Set(coinNames)];
  
    const prices = coins.length > 0 && await CoinGeckoClient.simple.price({
        ids: uniqueCoinNames,
        vs_currencies: ['usd'],
        include_24hr_change: true,
    }).then((info: any) => {
        let data = coins.map(coin => {
            if(!coin) return 
            const address = coin.address

            let coinData = {
                address,
                price: 0,
                price_change_percentage_24h: 0,
                value: 0
            }

            if(info.data.hasOwnProperty(coin?.coinGeckoId)) {
                coinData.price = Number(info.data[coin?.coinGeckoId].usd ?? 0);
                coinData.price_change_percentage_24h = Number(info.data[coin?.coinGeckoId].usd_24h_change ?? 0);
                coinData.value = Number(info.data[coin?.coinGeckoId].usd ?? 0) * coin.quantity;
            }

            return coinData;
      }).filter(e => e !== undefined)
        return data
    });

    return prices ? prices : [];
}