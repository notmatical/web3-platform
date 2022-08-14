import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, CardContent, Typography, TextField, MenuItem, Chip, Stack, Button } from '@mui/material';

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
import * as db from 'database/graphql/graphql';

// assets
import BannerIllustration from 'assets/images/banner-illustration.png';
import { useWallet } from '@solana/wallet-adapter-react';

const Dashboard = () => {
    const theme = useTheme();
    const wallet = useWallet();
    const { startLoading, stopLoading } = useMeta();
    const { showInfoToast } = useToasts();

    const [isDismissed, setIsDismissed] = useState<any>(false);

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            {!isDismissed && (
                <Grid item xs={12}>
                    <MainCard border={false} sx={{ background: '#7582eb' }}>
                        <CardContent sx={{ p: '0 !important', display: 'flex', color: 'rgb(17, 24, 39)' }}>
                            <Box sx={{ mr: 4, height: 200, width: 200 }}>
                                <img src={BannerIllustration} height="200" />
                            </Box>
                            <Box sx={{ color: 'rgb(17, 24, 39)' }}>
                                <Chip label="NEW" size="small" color="success" sx={{ borderRadius: 1 }} />
                                <Typography color="inherit" variant="h4" sx={{ fontSize: '1.8182rem', mt: 2 }}>
                                    Welcome to the new and improved Vaporize Platform
                                </Typography>
                                <Typography color="inherit" variant="h6" sx={{ fontSize: '0.875rem', mt: 1 }}>
                                    Your dashboard has been improved! Explore new features like Profile, Quests, Explore NFTs, DeFi and
                                    more.
                                </Typography>
                                <Button
                                    color="secondary"
                                    onClick={() => setIsDismissed(true)}
                                    size="small"
                                    variant="contained"
                                    sx={{ mt: 1 }}
                                >
                                    Dismiss Banner
                                </Button>
                            </Box>
                        </CardContent>
                    </MainCard>
                </Grid>
            )}

            <Grid item xs={12} sx={{ mb: -2.25 }}>
                <Typography variant="h6">Yaku Labs Dashboard</Typography>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
