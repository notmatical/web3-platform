import { filter, find } from 'lodash';
import Promise from 'bluebird';
import { NFTDetail, NFTType } from '../../../types/raffles';
import { getNftMetaData } from 'actions/shared';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { getRaffleState } from 'actions/raffle';
import { DEBUG, DEFAULT_PAY_TYPE, RAFFLE_REWARD_TYPES, TOKEN_PAY_TYPE } from 'config/config';
import { YAKU_DECIMALS } from 'config';
import { testData } from './dummy/test-data';

export const getNFTDetails = async (nftsList: Array<NFTType>, pagedList: Array<any>) => {
    // eslint-disable-next-line consistent-return
    const nftItemList = await Promise.map(nftsList, async (item) => {
        const { mint } = item;
        const existed = find(pagedList, (itm) => !!itm && itm.mint === mint);
        if (!existed) {
            try {
                const uri = await getNftMetaData(new PublicKey(mint));
                const json = await getNFTJsonData(uri);
                const { image, name } = json;
                return { mint, image, name };
            } catch (error) {
                console.error(error);
                return { mint, image: '', name: mint };
            }
        }
    });
    return filter(nftItemList, (item: any) => !!item);
};

export const getNFTJsonData = async (uri: string) => {
    if (!uri) return undefined;
    try {
        const resp = await fetch(uri);
        const json = await resp.json();
        return json;
    } catch (error) {
        console.error(error);
    }
    return undefined;
};

export const getNFTDetail = async ({
    wallet,
    mint,
    raffleKey
}: {
    wallet: any;
    mint: string;
    raffleKey?: string | string[];
}): Promise<NFTDetail> => {
    const result: any = {};
    if (!wallet || !mint) {
        return result;
    }
    const uri = await getNftMetaData(new PublicKey(mint));
    const json: any = await getNFTJsonData(uri);
    result.image = json.image;
    result.name = json.name;
    result.description = json.description;
    result.family = json.collection?.name ?? json.symbol;
    if (raffleKey === undefined) {
        return result;
    }
    const raffleData =
        DEBUG && raffleKey?.includes('dummy')
            ? find(testData, (data: any) => data.raffleKey === raffleKey)
            : await getRaffleState(new PublicKey(mint));

    if (raffleData === null || raffleData === undefined) return result;
    console.log(raffleData, 'raffleData');
    const tickets = raffleData.count?.toNumber();
    const winnerCnt = raffleData.winnerCount.toNumber();
    const mine: any = [];
    const entrants: any = [];
    for (let i = 0; i < tickets; i += 1) {
        if (raffleData.entrants[i]) {
            entrants.push({
                address: raffleData.entrants[i]?.toBase58(),
                index: i + 1
            });
        }
        if (raffleData.entrants[i]?.toBase58() === wallet.publicKey?.toBase58()) {
            mine.push({
                index: i + 1
            });
        }
    }

    const winners = [];
    const resWinners = raffleData.winner;
    const claimedWinner = raffleData.claimedWinner;
    let claimed = 0;
    let isClaimed = false;
    let isWinner = false;
    for (let i = 0; i < winnerCnt; i += 1) {
        winners.push({
            address: resWinners[i].toBase58(),
            index: raffleData.indexes[i].toNumber(),
            claimed: claimedWinner[i].toNumber()
        });

        if (resWinners[i].toBase58() === wallet.publicKey?.toBase58() && claimedWinner[i].toNumber() === 1) {
            claimed += 1;
            isClaimed = true;
        }

        if (wallet.publicKey !== null && resWinners[i].toBase58() === wallet.publicKey?.toBase58()) {
            isWinner = true;
        }
    }
    const allClaimed = winners.map((e: any) => e.claimed).reduce((a: number, b: number) => a + b) === winnerCnt;

    result.raffleData = {
        tickets,
        end: raffleData.endTimestamp.toNumber() * 1000,
        wl: raffleData.whitelisted.toNumber(),
        price:
            (raffleData.ticketPriceSol.toNumber() || raffleData.ticketPricePrey.toNumber()) /
            (raffleData.ticketPricePrey.toNumber() === 0 ? LAMPORTS_PER_SOL : YAKU_DECIMALS),
        payType: raffleData.ticketPricePrey.toNumber() === 0 ? DEFAULT_PAY_TYPE : TOKEN_PAY_TYPE,
        myTickets: mine,
        maxTickets: raffleData.maxEntrants.toNumber(),
        winnerCnt,
        isRevealed: !(raffleData.winner[0].toBase58() === '11111111111111111111111111111111'),
        winners,
        isClaimed,
        isWinner,
        allClaimed,
        participants: entrants,
        featured: raffleData.whitelisted.toNumber() === RAFFLE_REWARD_TYPES.nft,
        creator: raffleData.creator.toBase58()
    };
    return result;
};

const fetchData = {
    getNFTDetail,
    getNFTDetails,
    getNFTJsonData
};

export default fetchData;
