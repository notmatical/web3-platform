import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Typography, TextField, MenuItem, Chip, Stack } from '@mui/material';

// project imports
import { useToasts } from 'hooks/useToasts';
import { useMeta } from 'contexts/meta/meta';
import { gridSpacing } from 'store/constant';
import MainCard from 'components/MainCard';
import PriceCard from './components/PriceCard';
import BiggestSaleCard from './components/BiggestSaleCard';
import HoverSocialCard from 'components/cards/HoverSocialCard';

// gql
import { useQuery } from '@apollo/client';
import { queries } from '../../graphql/graphql';

// assets
import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
import AccountBalanceTwoToneIcon from '@mui/icons-material/AccountBalanceTwoTone';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import EqualizerTwoToneIcon from '@mui/icons-material/EqualizerTwoTone';
import ProjectCard from 'components/cards/ProjectCard';

const status = [
    {
        value: 'all',
        label: 'Combined'
    },
    {
        value: 'yaku_corp',
        label: 'Yaku Corp'
    },
    {
        value: 'yaku_corp_capsulex',
        label: 'Capsule X'
    },
    {
        value: 'yaku_x',
        label: 'Yaku X'
    },
    {
        value: 'cosmic_astronauts',
        label: 'Yaku Astronauts'
    }
];

const Dashboard = () => {
    const theme = useTheme();
    const { startLoading, stopLoading } = useMeta();
    const { showInfoToast } = useToasts();

    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    const { data, refetch } = useQuery(queries.GET_COLLECTION_STATS, {
        variables: { symbol: 'all' },
        fetchPolicy: 'network-only'
    });

    let floorPrice: any = '--';
    let volumeAll: any = '--';
    let avgPrice24hr: any = '--';
    let listedCount: any = '--';
    if (data) {
        floorPrice = (data.getStats.floorPrice / 1000000000).toFixed(2);
        volumeAll = (data.getStats.volumeAll / 1000000000).toFixed(2);
        avgPrice24hr = (data.getStats.avgPrice24hr / 1000000000).toFixed(2);
        listedCount = data.getStats.listedCount;
    }

    // methods
    const [value, setValue] = useState('all');
    const fetchNewData = (newValue: string) => {
        setValue(newValue);
        refetch({ symbol: newValue });
    };

    const BrowseCollection = (symbol: string) => {
        showInfoToast('You will be redirected shortly.');
        startLoading();
        setTimeout(() => {
            stopLoading();
            window.location.href = `https://magiceden.io/marketplace/${symbol}`;
        }, 1500);
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} sx={{ mb: -2.25 }}>
                <Typography variant="h6">Yaku Labs Dashboard</Typography>
            </Grid>

            {/* Top Floor Movers */}
            <Grid item xs={12} md={6} lg={4}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h3">Top Floor Movers</Typography>
                    </Grid>
                </Grid>
                <MainCard boxShadow sx={{ mt: 1.5 }} contentSX={{ p: 2.25 }}>
                    <Grid container rowSpacing={0.75}>
                        {/* <Grid container> */}
                        {/* <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
                            <Typography variant="h2" sx={{ p: 6.5 }}>
                                Coming Soon
                            </Typography>
                        </Grid> */}
                        <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Stack flexDirection="row">
                                    <img
                                        src="https://uploads-ssl.webflow.com/6190adde0207043d887665cd/620a4684d95ef1265dc3ba91_Duck%20Patrol.jpg"
                                        alt="CAS"
                                        height="40px"
                                        style={{ borderRadius: 2 }}
                                    />
                                    <Stack flexDirection="column" sx={{ ml: 1 }}>
                                        <Typography variant="h5">Duck Patrol</Typography>
                                        <Typography variant="caption" color="primary">
                                            24h volume: ◎ 53.83
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Grid>
                            <Grid item justifyContent="flex-end">
                                <Chip label="◎ 0.52" size="small" color="primary" sx={{ ml: 2, borderRadius: 1 }} />
                                <Chip label="+248.67%" size="small" color="success" sx={{ ml: 2, borderRadius: 1 }} />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Stack flexDirection="row">
                                    <img
                                        src="https://uploads-ssl.webflow.com/6190adde0207043d887665cd/6204d3f99e524a3c35cc200d_Xin%20Dragons.jpg"
                                        alt="DeGods"
                                        height="40px"
                                        style={{ borderRadius: 2 }}
                                    />
                                    <Stack flexDirection="column" justifyContent="center" sx={{ ml: 1 }}>
                                        <Typography variant="h5">Xin Dragons</Typography>
                                        <Typography variant="caption" color="primary">
                                            24h volume: ◎ 214.54
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Grid>
                            <Grid item justifyContent="flex-end">
                                <Chip label="◎ 15.99" size="small" color="primary" sx={{ ml: 2, borderRadius: 1 }} />
                                <Chip label="+146.38%" size="small" color="success" sx={{ ml: 2, borderRadius: 1 }} />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Stack flexDirection="row">
                                    <img
                                        src="https://uploads-ssl.webflow.com/6190adde0207043d887665cd/61e92c714a6a06dcb876acb3_Solana%20Monkey%20University.jpg"
                                        alt="DeGods"
                                        height="40px"
                                        style={{ borderRadius: 2 }}
                                    />
                                    <Stack flexDirection="column" sx={{ ml: 1 }}>
                                        <Typography variant="h5">Solana Monkey ...</Typography>
                                        <Typography variant="caption" color="primary">
                                            24h volume: ◎ 24.1
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Grid>
                            <Grid item justifyContent="flex-end">
                                <Chip label="◎ 0.9" size="small" color="primary" sx={{ ml: 2, borderRadius: 1 }} />
                                <Chip label="+125%" size="small" color="success" sx={{ ml: 2, borderRadius: 1 }} />
                            </Grid>
                        </Grid>
                    </Grid>
                </MainCard>
            </Grid>

            {/* Sales of the Day */}
            <Grid item xs={12} md={6} lg={4}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h3">Sales of the Day</Typography>
                    </Grid>
                </Grid>
                <MainCard boxShadow sx={{ mt: 1.5 }} contentSX={{ p: 2.25 }}>
                    <Grid container rowSpacing={0.75}>
                        {/* <Grid container> */}
                        {/* <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
                            <Typography variant="h2" sx={{ p: 6.5 }}>
                                Coming Soon
                            </Typography>
                        </Grid> */}
                        <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Stack flexDirection="row">
                                    <img
                                        src="https://www.arweave.net/Gs7mQdTcuRhTQ9StTZ3mnMtjoUyFfx7kW7fxgNNdxao?ext=png"
                                        alt="DeGods"
                                        height="40px"
                                        style={{ borderRadius: 2 }}
                                    />
                                    <Stack flexDirection="column" justifyContent="center" sx={{ ml: 1 }}>
                                        <Typography variant="h5">Laboratory #31</Typography>
                                        <Typography variant="caption" color="primary">
                                            Communi3 - Labs
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Grid>
                            <Chip label="◎ 2.3k" size="small" color="primary" sx={{ ml: '5px', borderRadius: 1 }} />
                        </Grid>
                        <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Stack flexDirection="row">
                                    <img
                                        src="https://arweave.net/vIvcVniW-m9sdfjlikeze73XZ9_s2t--EJmtYtNiRO8"
                                        alt="CAS"
                                        height="40px"
                                        style={{ borderRadius: 2 }}
                                    />
                                    <Stack flexDirection="column" sx={{ ml: 1 }}>
                                        <Typography variant="h5">Astronaut #1522</Typography>
                                        <Typography variant="caption" color="primary">
                                            Cosmic Astronauts
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Grid>
                            <Chip label="◎ 9" size="small" color="primary" sx={{ ml: '5px', borderRadius: 1 }} />
                        </Grid>
                        <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Stack flexDirection="row">
                                    <img
                                        src="https://arweave.net/mP5_8fMz3W7kJgAn_IVKcVCSU8rhmurai2c35uLOZDo"
                                        alt="DeGods"
                                        height="40px"
                                        style={{ borderRadius: 2 }}
                                    />
                                    <Stack flexDirection="column" sx={{ ml: 1 }}>
                                        <Typography variant="h5">Astronaut #3555</Typography>
                                        <Typography variant="caption" color="primary">
                                            Cosmic Astronauts
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Grid>
                            <Chip label="◎ 4.5" size="small" color="primary" sx={{ ml: '5px', borderRadius: 1 }} />
                        </Grid>
                    </Grid>
                </MainCard>
            </Grid>

            {/* Bottom Floor Movers */}
            <Grid item xs={12} md={6} lg={4}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h3">Bottom Floor Movers</Typography>
                    </Grid>
                </Grid>
                <MainCard boxShadow sx={{ mt: 1.5 }} contentSX={{ p: 2.25 }}>
                    <Grid container rowSpacing={0.75}>
                        {/* <Grid container> */}
                        {/* <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
                            <Typography variant="h2" sx={{ p: 6.5 }}>
                                Coming Soon
                            </Typography>
                        </Grid> */}
                        <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Stack flexDirection="row">
                                    <img
                                        src="https://uploads-ssl.webflow.com/6190adde0207043d887665cd/620e5b81274c4631a8214d88_Solana%20Express.jpg"
                                        alt="CAS"
                                        height="40px"
                                        style={{ borderRadius: 2 }}
                                    />
                                    <Stack flexDirection="column" sx={{ ml: 1 }}>
                                        <Typography variant="h5">Solana Express</Typography>
                                        <Typography variant="caption" color="primary">
                                            24h volume: ◎ 15.28
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Grid>
                            <Grid item justifyContent="flex-end">
                                <Chip label="◎ 4.4" size="small" color="primary" sx={{ ml: '5px', borderRadius: 1 }} />
                                <Chip label="-34.81%" size="small" color="error" sx={{ ml: 2, borderRadius: 1 }} />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Stack flexDirection="row">
                                    <img
                                        src="https://moon.ly/_next/image?url=%2Fuploads%2Fnft%2Fa73618dc-e938-4d9d-a686-5ea42ee87d93.jpg&w=48&q=75"
                                        alt="DeGods"
                                        height="40px"
                                        style={{ borderRadius: 2 }}
                                    />
                                    <Stack flexDirection="column" justifyContent="center" sx={{ ml: 1 }}>
                                        <Typography variant="h5">Cosmic Ape Cru...</Typography>
                                        <Typography variant="caption" color="primary">
                                            24h volume: ◎ 276.96
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Grid>
                            <Grid item justifyContent="flex-end">
                                <Chip label="◎ 3.13" size="small" color="primary" sx={{ ml: '5px', borderRadius: 1 }} />
                                <Chip label="-30.44%" size="small" color="error" sx={{ ml: 2, borderRadius: 1 }} />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Stack flexDirection="row">
                                    <img
                                        src="https://moon.ly/_next/image?url=%2Fuploads%2Fnft%2F832b3f48-dc04-419d-abcc-be21b0c66ca1.jpg&w=48&q=75"
                                        alt="DeGods"
                                        height="40px"
                                        style={{ borderRadius: 2 }}
                                    />
                                    <Stack flexDirection="column" sx={{ ml: 1 }}>
                                        <Typography variant="h5">Trippin&apos; Ape Tribe</Typography>
                                        <Typography variant="caption" color="primary">
                                            24h volume: ◎ 11.8k
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Grid>
                            <Grid item justifyContent="flex-end">
                                <Chip label="◎ 39.5" size="small" color="primary" sx={{ ml: '5px', borderRadius: 1 }} />
                                <Chip label="-23.67%" size="small" color="error" sx={{ ml: 2, borderRadius: 1 }} />
                            </Grid>
                        </Grid>
                    </Grid>
                </MainCard>
            </Grid>

            <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

            {/* collection stats */}
            <Grid item xs={12} sx={{ mb: -2.25 }}>
                <Box display="flex" flexDirection="row" alignItems="center">
                    <Typography variant="h2">Yaku Collection Statistics</Typography>
                    <TextField
                        id="standard-select-type"
                        select
                        value={value}
                        size="medium"
                        sx={{ width: 150, textAlign: 'left', ml: 2 }}
                        onChange={(e) => fetchNewData(e.target.value)}
                    >
                        {status.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </Grid>

            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} sm={6} lg={3}>
                        <HoverSocialCard
                            primary="Floor Price"
                            secondary={`${floorPrice} ◎`}
                            iconPrimary={MonetizationOnTwoToneIcon}
                            color={theme.palette.secondary.dark}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} lg={3}>
                        <HoverSocialCard
                            primary="Volume Traded"
                            secondary={`${volumeAll} ◎`}
                            iconPrimary={EqualizerTwoToneIcon}
                            color={theme.palette.primary.dark}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} lg={3}>
                        <HoverSocialCard
                            primary="24h Average Price"
                            secondary={`${avgPrice24hr} ◎`}
                            iconPrimary={AccountBalanceTwoToneIcon}
                            color={theme.palette.warning.main}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} lg={3}>
                        <HoverSocialCard
                            primary="Listed Count"
                            secondary={listedCount}
                            iconPrimary={FormatListBulletedTwoToneIcon}
                            color={theme.palette.info.dark}
                        />
                    </Grid>
                </Grid>
            </Grid>

            {/* <Grid item xs={6} sx={{ mb: -2.25 }}>
                <Typography variant="h4">Cosmic Astronauts Statistics</Typography>
            </Grid> */}

            {/* chart */}
            {/* <Grid item xs={6}>
                <MainCard border={false} content={false}>
                    <Box sx={{ pt: 1, pr: 2 }}>
                        <ChartStats />
                    </Box>
                </MainCard>
            </Grid> */}

            {/* collection cards: TODO move into a 'slider' once we expand collections */}
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} sm={6} lg={3}>
                        <ProjectCard
                            image="https://bafybeibkjcrnct6ihayjhk5567572a5ai2bhnwb7sk3mh4yhu7pa45al5e.ipfs.dweb.link"
                            name="Yaku Engineering ONI-S01"
                            description="YAKU Engineering ONI-S01 is the first playable customizable motorcycle in the Yakuverse..."
                            onClick={() => BrowseCollection('yaku_corp')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <ProjectCard
                            image="https://bafybeibzxwkiwhebjotva2duekzrnpnd7t3fp3tvz2hu5dbrl2qqaokvmm.ipfs.dweb.link/"
                            name="Yaku | Capsule X"
                            description="Hang out in your Yakuverse capsule apartment with friends, play games, customize your motorcycle..."
                            onClick={() => BrowseCollection('yaku_corp_capsulex')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <ProjectCard
                            image="https://bafybeigaq3x3iz3v24qjnv26ql7c7fstll6reolqbxkpncpbpa23bovgva.ipfs.dweb.link/"
                            name="Yaku X"
                            description="YAKU X is the customizable playable avatar of the Yakuverse - Travel the Yakuverse, buy properties..."
                            onClick={() => BrowseCollection('yaku_x')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <ProjectCard
                            image="https://img-cdn.magiceden.dev/rs:fill:170:170:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/cosmic_astronauts_pfp_1651112127101.gif"
                            name="Yaku Astronauts"
                            description="YAKU X is the customizable playable avatar of the Yakuverse - Travel the Yakuverse, buy properties..."
                            onClick={() => BrowseCollection('cosmic_astronauts')}
                        />
                    </Grid>
                </Grid>
            </Grid>

            {/* TODO: find a new place for this */}
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={4} md={12} sm={12} xs={12}>
                        <PriceCard isLoading={isLoading} />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12} xs={12}>
                        <BiggestSaleCard isLoading={isLoading} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
