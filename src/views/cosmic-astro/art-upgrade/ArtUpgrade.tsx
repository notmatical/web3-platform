/* eslint-disable */
import { useEffect, useState, ReactElement } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Box, Stack, Typography, Avatar } from '@mui/material';

// web3 imports
import { useWallet } from '@solana/wallet-adapter-react';
import { NFT_CREATOR } from 'config/config';
import { solConnection } from 'actions/shared';

// project imports
import SkeletonProductPlaceholder from 'components/cards/Skeleton/ProductPlaceholder';
import { gridSpacing } from 'store/constant';
import NftCard from './ArtSwitcherNftCard';
import { useMeta } from 'contexts/meta/meta';

// third party
import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';
import axios from 'axios';

// assets
import { CloseCircleOutlined } from '@ant-design/icons';

const ArtUpgrade = () => {
    const theme = useTheme();

    const { startLoading, stopLoading } = useMeta();
	const wallet = useWallet();
	const [isLoading, setIsLoading] = useState(true);
	const [nftList, setNftList] = useState<any>();

    const getNfts = async () => {
		if(wallet.publicKey !== null) {
			const nftsList = await getParsedNftAccountsByOwner({ publicAddress: wallet.publicKey.toBase58(), connection: solConnection });
            const list: any = [];
            for (const item of nftsList) {
                if (item.data.creators === undefined) continue;
                if (item.data.creators[0].address === NFT_CREATOR) {
                    try {
                        await axios.get(item.data.uri)
                        .then((res) => {
                            list.push({
                                mintAddress: item.mint,
                                name: res.data.name,
                                image: res.data.image,
                                item: item.data,
                                role: res.data.attributes.find((o: any) => o.trait_type === 'Role').value
                            });
                        }).catch((err) => {
                            console.log(err);
                        });
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
            setNftList(list);
            setIsLoading(false)
		}
	};

	useEffect(() => {
		getNfts();
	}, [wallet.connected]);

	let nftResult: ReactElement | ReactElement[] = <></>;
    if (nftList && nftList.length !== 0) {
        nftResult = nftList.map((nft: any, index: number) => (
            <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                <NftCard
                    mint={nft.mintAddress}
                    role={nft.role}
                    name={nft.name}
                    image={nft.image}
                    item={nft.item}
                    startLoading={() => startLoading()}
                    stopLoading={() => stopLoading()}
                    updatePage={() => getNfts()}
                    loading={isLoading}
                />
            </Grid>
        ));
    } else {
        nftResult = (
            <Grid item xs={12}>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ borderRadius: 3, padding: 4, border: '1px solid rgba(213, 217, 233, 0.2)' }}
                >
                    <Stack alignItems="center">
                        <Avatar
                            variant="rounded"
                            sx={{
                                borderRadius: '9999px',
                                width: '80px !important',
                                height: '80px !important',
                                backgroundColor: theme.palette.dark.main,
                                color: theme.palette.secondary.dark,
                                mb: 2
                            }}
                        >
                            <CloseCircleOutlined style={{ fontSize: 32 }} />
                        </Avatar>
                        <Typography variant="h3" color="inherit">
                            No Unstaked NFTs Found
                        </Typography>
                        <Typography variant="subtitle2" color="inherit">
                            There are no NFTs that you have unstaked to upgrade.
                        </Typography>
                    </Stack>
                </Box>
            </Grid>
        );
    }

    return (
        <Grid container spacing={gridSpacing}>
            {isLoading
                ? [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                        <Grid key={item} item xs={12} sm={6} md={4} lg={3}>
                            <SkeletonProductPlaceholder />
                        </Grid>
                    ))
                : nftResult}
        </Grid>
    );
};

export default ArtUpgrade;
