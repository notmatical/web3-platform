import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Box, Fade, Stack, Tooltip, Tab, Tabs, Divider, Avatar, IconButton, Typography, CardMedia } from '@mui/material';

// project imports
import { useSolPrice } from 'contexts/CoinGecko';
import { TabsProps } from 'types';
import { formatUSD } from 'utils/utils';
import ExploreTab from './components/ExploreTab';
import OwnersTab from './components/OwnersTab';
import ActivityTab from './components/ActivityTab';
import AnalyticsTab from './components/AnalyticsTab';

// assets
import { IconBook, IconUsers, IconActivity, IconChartBar, IconDots } from '@tabler/icons';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import PlaceholderImage from 'assets/images/placeholder.png';

// data
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
        to: '/explore',
        icon: <IconBook stroke={1.5} size="1.1rem" />,
        label: 'Explore'
    },
    {
        to: '/owners',
        icon: <IconUsers stroke={1.5} size="1.1rem" />,
        label: 'Owners'
    },
    {
        to: '/activity',
        icon: <IconActivity stroke={1.5} size="1.1rem" />,
        label: 'Activity'
    },
    {
        to: '/analytics',
        icon: <IconChartBar stroke={1.5} size="1.1rem" />,
        label: 'Analytics'
    }
];

const CollectionView = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { projectSlug, tab } = useParams();

    const solPrice = useSolPrice();

    const [project, setProject] = useState<any>(location.state);

    // Tabs
    let selectedTab = 0;
    switch (tab) {
        case 'owners':
            selectedTab = 1;
            break;
        case 'activity':
            selectedTab = 2;
            break;
        case 'analytics':
            selectedTab = 3;
            break;
        default:
            selectedTab = 0;
    }

    const redirectUrl = `/nft/${projectSlug}`;

    const [value, setValue] = useState<number>(selectedTab);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    // https://storage.googleapis.com/zapper-fi-assets/nft/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/1500x500.jpeg
    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12}>
                <CardMedia
                    image="https://storage.googleapis.com/zapper-fi-assets/nft/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/1500x500.jpeg"
                    sx={{
                        overflow: 'hidden',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center center',
                        height: 200,
                        ml: '-20px',
                        mr: '-20px',
                        mt: '-20px'
                    }}
                >
                    <Box
                        sx={{
                            zIndex: 0,
                            width: '100%',
                            height: '200px',
                            background: 'linear-gradient(360deg, #0b0f19 20%, rgba(20, 26, 30, 0) 100%)'
                        }}
                    />
                </CardMedia>

                <Box display="flex" flexDirection="row" alignItems="flex-end" sx={{ mt: '-10%' }}>
                    <Fade in timeout={500} unmountOnExit>
                        <Avatar
                            src={project.projectData.project.img_url === null ? PlaceholderImage : project.projectData.project.img_url}
                            sx={{
                                height: '120px',
                                width: '120px',
                                backgroundColor: 'transparent',
                                mr: 2
                            }}
                            color="inherit"
                        />
                    </Fade>

                    {/* project info */}
                    <Box display="flex" flexDirection="row" alignItems="center" flexGrow={1}>
                        <Box display="flex" sx={{ borderRadius: 2, p: 2, gap: 4, background: '#0b0f19' }}>
                            <Stack>
                                <Typography variant="h4" color="primary">
                                    # Holders
                                </Typography>
                                <Typography variant="h3" color="inherit">
                                    {project.projectData.num_of_token_holders}
                                </Typography>
                            </Stack>
                            <Stack>
                                <Typography variant="h4" color="primary">
                                    Listed
                                </Typography>
                                <Typography variant="h3" color="inherit">
                                    {project.projectData.num_of_token_listed} / {project.projectData.project.supply}
                                </Typography>
                            </Stack>
                            <Stack>
                                <Typography variant="h4" color="primary">
                                    Floor Price
                                </Typography>
                                <Tooltip title={formatUSD.format(project.projectData.floor_price * solPrice)} placement="bottom" arrow>
                                    <Typography variant="h3" color="inherit">
                                        {project.projectData.floor_price} ◎
                                    </Typography>
                                </Tooltip>
                            </Stack>
                            <Stack>
                                <Typography variant="h4" color="primary">
                                    24 Volume
                                </Typography>
                                <Tooltip title={formatUSD.format(project.projectData.volume_1day)} placement="bottom" arrow>
                                    <Typography variant="h3" color="inherit">
                                        {(project.projectData.volume_1day / solPrice).toFixed(3)} ◎
                                    </Typography>
                                </Tooltip>
                            </Stack>
                        </Box>

                        {/* external links */}
                        <Box display="flex" flexDirection="row" justifyContent="flex-end" sx={{ flexGrow: 1 }}>
                            <IconButton sx={{ width: '33px', height: '33px', border: `1px solid ${theme.palette.primary.dark}` }}>
                                <IconDots color={theme.palette.primary.dark} />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </Grid>

            <Grid item xs={12}>
                <Box display="flex" flexDirection="column" sx={{ gap: 2 }}>
                    {/* project name / description */}
                    <Box display="flex" flexDirection="column" sx={{ px: 2, width: { md: '100%', lg: '66.6%' } }}>
                        <Typography variant="h2" color="inherit">
                            {project.projectData.project.display_name}
                        </Typography>
                        <Typography variant="body2" color="inherit" sx={{ mt: 1 }}>
                            It&apos;s just a bunch of crecked cets, who&apos;re upto a whole of rat shit that are livin&apos;, and
                            chillin&apos; and vibin&apos; together. They&apos;re picking bullshit catfights, posting their own mugshots, cat
                            calling the cops and stirring whatever they can to keep the high going.
                        </Typography>
                    </Box>
                </Box>

                <Tabs
                    value={value}
                    variant="scrollable"
                    onChange={handleChange}
                    sx={{
                        marginTop: 2,
                        px: 2,
                        '& .MuiTabs-flexContainer': {
                            border: 'none'
                        },
                        '& a': {
                            minHeight: 'auto',
                            minWidth: 10,
                            py: 1.5,
                            px: 1,
                            mr: 2.25,
                            color: 'primary.main',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        },
                        '& a.Mui-selected': {
                            color: 'white'
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: 'secondary.main'
                        },
                        '& a > svg': {
                            mr: 1.25,
                            mb: '0px !important'
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

                <Divider sx={{ mx: 2, mb: 2 }} />

                <TabPanel value={value} index={0}>
                    <ExploreTab project={project} projectSlug={projectSlug} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <OwnersTab project={project} projectSlug={projectSlug} />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <ActivityTab project={project} projectSlug={projectSlug} />
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <AnalyticsTab project={project} projectSlug={projectSlug} />
                </TabPanel>
            </Grid>
        </Grid>
    );
};

export default CollectionView;
