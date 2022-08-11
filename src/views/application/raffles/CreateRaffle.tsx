import { Box } from '@mui/material';
import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';
import { useWallet } from '@solana/wallet-adapter-react';
import { adminValidation, solConnection } from 'actions/shared';
import PagedList from 'components/PagedList';
import { useMeta } from 'contexts/meta/meta';
import { chunk, get } from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RaffleCreateCard from './RaffleCreateCard';
import { getNFTDetails } from './fetchData';

export default function CreateRaffle() {
    const PAGE_SIZE = 24;
    const wallet = useWallet();
    const navigate = useNavigate();
    const { startLoading, stopLoading } = useMeta();
    const [masterList, setMasterList] = useState<any>([]);
    const [nftList, setNftList] = useState<any>([]);
    const [isAdmin, setIsAdmin] = useState(false);

    const getNFTs = async () => {
        if (wallet.publicKey === null) {
            return;
        }
        try {
            startLoading();
            const nftsList = await getParsedNftAccountsByOwner({
                publicAddress: wallet.publicKey.toBase58(),
                connection: solConnection
            });
            const chunked = chunk(nftsList, PAGE_SIZE);
            setMasterList(chunked);
            await getPage(1, chunked);
        } catch (error) {
            console.error(error);
        } finally {
            stopLoading();
        }
    };

    const getPage = async (page: number, array: Array<any> = masterList) => {
        try {
            startLoading();
            const pagedNftList = await getNFTDetails(get(array || masterList, page - 1), nftList);
            const newNftList = [...nftList, ...pagedNftList];
            setNftList(newNftList);
        } catch (error) {
            console.error(error);
        } finally {
            stopLoading();
        }
    };

    useEffect(() => {
        if (wallet.publicKey !== null) {
            const admin = adminValidation(wallet.publicKey);
            setIsAdmin(admin);
            if (admin) {
                getNFTs();
            } else {
                navigate('/raffles', { replace: true });
            }
        } else {
            setIsAdmin(false);
            setNftList([]);
        }
        // eslint-disable-next-line
  }, [wallet.connected]);
    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 80px)',
                p: 4,
                backgroundColor: 'background.default',
                color: 'text.primary'
            }}
        >
            <PagedList component={RaffleCreateCard} masterList={masterList} pageList={nftList} getPage={getPage} pageSize={PAGE_SIZE} />
        </Box>
    );
}
