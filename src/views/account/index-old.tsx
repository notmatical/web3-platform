/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, CardMedia, Grid, Tab, Tabs, Typography, Tooltip, Dialog, Button, AvatarGroup } from '@mui/material';

// web3 imports
import { useConnection } from '@solana/wallet-adapter-react';
import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';

// third-party
import { HyperspaceClient } from 'hyperspace-client-js';
import axios from 'axios';

// assets
import { IconBook, IconStar, IconBolt, IconActivity } from '@tabler/icons';
import { CrownFilled, BugFilled, HeartFilled, CopyOutlined } from '@ant-design/icons';
import PersonAddTwoToneIcon from '@mui/icons-material/PersonAddTwoTone';
import CoverPhoto from 'assets/images/landing/bg2.jpg';
import DefaultUser from 'assets/images/users/user-image.jpg';

// project imports
import useAuth from 'hooks/useAuth';
import { HS_API_KEY } from 'config';
import { gridSpacing } from 'store/constant';
import { TabsProps } from 'types';
import { shortenAddress } from 'utils/utils';
import VerifiedTokens from 'utils/solana';
import useConfig from 'hooks/useConfig';
import MainCard from 'components/cards/MainCard';
import Avatar from 'components/@extended/Avatar';
import UpdateAvatarModal from './modals/UpdateAvatarModal';
import Portfolio from './Portfolio';
import NFTs from './NFTs';
import Badges from './components/BadgesTab';
import Activity from './components/ActivityTab';

// graphql
import { useQuery } from '@apollo/client';
import * as db from 'database/graphql/graphql';

function TabPanel({ children, value, index, ...other }: TabsProps) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

const tabOptions = [
    {
        to: '/portfolio',
        icon: <IconBook stroke={1.5} size="1.1rem" />,
        label: 'Portfolio'
    },
    {
        to: '/nfts',
        icon: <IconStar stroke={1.5} size="1.1rem" />,
        label: 'NFTs'
    },
    {
        to: '/activity',
        icon: <IconActivity stroke={1.5} size="1.1rem" />,
        label: 'Activity'
    },
    {
        to: '/badges',
        icon: <IconBolt stroke={1.5} size="1.1rem" />,
        label: 'Badges'
    },
];

function UserAccount() {
    const theme = useTheme();
    const { user } = useAuth();
    const { connection } = useConnection();
    const { borderRadius } = useConfig();
    const { publicKey, tab } = useParams();

    const hsClient = new HyperspaceClient(HS_API_KEY);

    const { data, loading, error, refetch } = useQuery(db.queries.GET_USER, { variables: { wallet: publicKey }, fetchPolicy: 'network-only' });

    let selectedTab = 0;
    switch (tab) {
        case 'nfts':
            selectedTab = 1;
            break;
        case 'badges':
            selectedTab = 2;
            break;
        default:
            selectedTab = 0;
    }

    const [value, setValue] = useState<number>(selectedTab);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    // Modal
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const onFinish = () => {
        setOpen(false);
        refetch();
    };

    const [showTooltip, setShowTooltip] = useState(false);

    const redirectUrl = `/profile/${publicKey}`;

    const [nfts, setNfts] = useState<any>(null);
    const getUserNFTs = async () => {
        const nftsList = await getParsedNftAccountsByOwner({ publicAddress: publicKey!, connection });
        const list: any = [];
        for (const item of nftsList) {
            try {
                await axios.get(item.data.uri).then((res) => {
                    list.push({
                        name: res.data.name,
                        image: res.data.image
                    })
                }).catch((err) => {
                    console.log(err);
                });
            } catch (error) {
                console.log(error);
            }
        }
        
        setNfts(list);
    };

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [tokenList, setTokenList] = useState<any>([]);
    const getUserTokens = async () => {
        const verifiedTokens = Object.values(VerifiedTokens);
        const tokens: any = [];
        try {
            await axios.get(`https://public-api.solscan.io/account/tokens?account=${publicKey}`).then((res) => {
                res.data.forEach((token: any) => {
                    if (!verifiedTokens.includes(token.tokenAddress)) return;
                    tokens.push({
                        tokenAddress: token.tokenAddress,
                        tokenIcon: token.tokenIcon,
                        tokenName: token.tokenName,
                        tokenSymbol: token.tokenSymbol,
                        tokenAmount: token.tokenAmount
                    });
                });
                setIsLoading(false);
                setTokenList(tokens);
            }).catch((err) => {
                console.log(err);
            })
        } catch (error) {
            console.log(error);
        }
    }

    const getUserStats = async () => {
        hsClient
            .getWalletStatsHist({
                condition: {
                    searchAddress: publicKey!
                }
            }).then((res) => console.log(res));
    };
    
    useEffect(() => {
        getUserNFTs();
        getUserTokens();
        getUserStats();
    }, []);

    return (
        <>
            {!loading && data.user && (
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <MainCard
                            contentSX={{
                                p: 1.5,
                                paddingBottom: '0px !important',
                                [theme.breakpoints.down('lg')]: {
                                    textAlign: 'center'
                                }
                            }}
                        >
                            <CardMedia
                                image={CoverPhoto}
                                sx={{
                                    borderRadius: `${borderRadius}px`,
                                    overflow: 'hidden',
                                    height: 270,
                                    mb: 3
                                }}
                            />
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={12} md={3}>
                                    <Avatar
                                        alt="User Image"
                                        src={data.user.avatarURI ? data.user.avatarURI : DefaultUser}
                                        onClick={handleOpen}
                                        sx={{
                                            margin: '-70px 0 0 auto',
                                            '&:hover': {
                                                cursor: 'pointer',
                                                transition: 'all .15s ease-in-out',
                                                filter: 'brightness(0.4)'
                                            },
                                            width: { xs: 72, sm: 100, md: 140 },
                                            height: { xs: 72, sm: 100, md: 140 }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={9}>
                                    <Grid container spacing={gridSpacing}>
                                        <Grid item xs={12} md={4}>
                                            <Box display="flex" flexDirection="row" alignItems="center" sx={{ gap: 1 }}>
                                                <Typography variant="h2">
                                                    {!loading && data.user && data.user.vanity
                                                        ? data.user.vanity
                                                        : shortenAddress(publicKey ?? '', 10)}
                                                </Typography>
                                            </Box>
                                            {/* badges */}
                                            <Box display="flex" sx={{ gap: 0.5 }}>
                                                <Tooltip title="Staff" placement="bottom" arrow>
                                                    <CrownFilled style={{ fontSize: '18px', color: theme.palette.secondary.dark }} />
                                                </Tooltip>
                                                <Tooltip title="Bug Hunter" placement="bottom" arrow>
                                                    <BugFilled style={{ fontSize: '18px', color: theme.palette.warning.dark }} />
                                                </Tooltip>
                                                <Tooltip title="test" placement="bottom" arrow>
                                                    <HeartFilled style={{ fontSize: '18px', color: theme.palette.info.dark }} />
                                                </Tooltip>
                                            </Box>
                                            {/* address */}
                                            <Typography
                                                variant="h4"
                                                color="primary"
                                                sx={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    navigator.clipboard.writeText(publicKey!);
                                                    setShowTooltip(true);
                                                }}
                                            >
                                                {shortenAddress(publicKey ?? '', 5)}
                                                <Tooltip
                                                    open={showTooltip}
                                                    onClose={() => setShowTooltip(false)}
                                                    leaveDelay={1000}
                                                    title="Copied to Clipboard"
                                                    placement="bottom"
                                                    arrow
                                                >
                                                    <CopyOutlined style={{ marginLeft: '6px' }} />
                                                </Tooltip>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Grid
                                                container
                                                spacing={1}
                                                sx={{
                                                    justifyContent: 'flex-end',
                                                    [theme.breakpoints.down('lg')]: {
                                                        justifyContent: 'center'
                                                    }
                                                }}
                                            >
                                                <Grid item>
                                                    <Button variant="contained" startIcon={<PersonAddTwoToneIcon />}>
                                                        Follow
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid container justifyContent="flex-end">
                                        <Tabs
                                            value={value}
                                            variant="scrollable"
                                            onChange={handleChange}
                                            sx={{
                                                marginTop: 2.5,
                                                '& .MuiTabs-flexContainer': {
                                                    border: 'none'
                                                },
                                                '& a': {
                                                    minHeight: 'auto',
                                                    minWidth: 10,
                                                    py: 1.5,
                                                    px: 1,
                                                    mr: 2.25,
                                                    color: 'grey.700',
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                },
                                                '& a.Mui-selected': {
                                                    color: 'primary.main'
                                                },
                                                '& a > svg': {
                                                    mr: 1.25
                                                }
                                            }}
                                        >
                                            {tabOptions.map((option, index) => (
                                                <Tab
                                                    key={index}
                                                    component={Link}
                                                    to={redirectUrl + option.to}
                                                    icon={option.icon}
                                                    label={option.label}
                                                    sx={{ mb: 0 }}
                                                    {...a11yProps(index)}
                                                />
                                            ))}
                                        </Tabs>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </MainCard>
                    </Grid>

                    <Grid item xs={12}>
                        <TabPanel value={value} index={0}>
                            <Portfolio user={data.user} tokenList={tokenList} isLoading={isLoading} />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <NFTs />
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <Activity user={data.user} />
                        </TabPanel>
                        <TabPanel value={value} index={3}>
                            <Badges />
                        </TabPanel>
                    </Grid>

                    {/* Dialog renders its body even if not open */}
                    <Dialog maxWidth="sm" fullWidth onClose={handleClose} open={open} scroll="paper" sx={{ '& .MuiDialog-paper': { p: 0 } }}>
                        {open && <UpdateAvatarModal user={data.user} nfts={nfts} onCancel={handleClose} onFinish={onFinish} />}
                    </Dialog>
                </Grid>
            )}
        </>
    );
}

export default UserAccount;
