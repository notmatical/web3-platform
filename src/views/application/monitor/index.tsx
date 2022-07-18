import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Grid,
    Box,
    Stack,
    Button,
    TextField,
    MenuItem,
    Avatar,
    Chip,
    Typography,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    CircularProgress,
    Tooltip
} from '@mui/material';

// redux
import { useDispatch } from 'store';

// project imports
import { HS_API_KEY } from 'config';
import { useToasts } from 'hooks/useToasts';
import { gridSpacing } from 'store/constant';
import { formatPriceNumber, formatNumber, formatPercent, formatPrice } from 'utils/utils';
import MainCard from 'components/MainCard';

// third-party
import { HyperspaceClient } from 'hyperspace-client-js';

// assets
import { IconChevronDown, IconChevronUp } from '@tabler/icons';
import { CloseCircleOutlined, StarFilled } from '@ant-design/icons';

// data
const filter = [
    {
        value: 'default',
        label: 'Filter By'
    },
    {
        value: 'recommended',
        label: 'Recommended'
    },
    {
        value: 'doxxed',
        label: 'Doxxed'
    },
    {
        value: 'verified',
        label: 'Verified'
    }
];

const Monitor = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { showInfoToast } = useToasts();

    const [projects, setProjects] = useState<any>([]);

    const hsClient = new HyperspaceClient(HS_API_KEY);

    const fetchProjects = async () => {
        hsClient
            .getProjects({
                orderBy: {
                    field_name: 'volume_1day',
                    sort_order: 'DESC'
                },
                paginationInfo: {
                    page_number: 1,
                    page_size: 50
                }
            })
            .then((res) => {
                setProjects(res.getProjectStats);
            });
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // new
    const [tag, setTag] = useState('all');
    const [filterValue, setFilterValue] = useState('default');

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} sx={{ py: 6, mt: 4 }}>
                <Box display="flex" alignItems="flex-start">
                    <Stack sx={{ maxWidth: '36rem' }}>
                        <Typography variant="h1" sx={{ fontWeight: 600 }}>
                            Monitor NFT Market Data
                        </Typography>
                        <Typography variant="h4" color="primary" sx={{ mt: 1, fontWeight: 500 }}>
                            Track NFT data changes for top collections. By default sorted by 24h Volume and it is updated every few minutes.
                        </Typography>
                    </Stack>
                </Box>
            </Grid>

            <Grid item xs={12} sx={{ mb: 4 }}>
                <Grid container spacing={gridSpacing}>
                    {/* Top Floor Movers */}
                    <Grid item xs={12} md={6} lg={4}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Typography variant="h3">Top Floor Movers</Typography>
                            </Grid>
                        </Grid>
                        <MainCard border={false} sx={{ mt: 1.5 }} contentSX={{ p: 2.25 }}>
                            <Grid container rowSpacing={0.75}>
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
                        <MainCard border={false} sx={{ mt: 1.5 }} contentSX={{ p: 2.25 }}>
                            <Grid container rowSpacing={0.75}>
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
                        <MainCard border={false} sx={{ mt: 1.5 }} contentSX={{ p: 2.25 }}>
                            <Grid container rowSpacing={0.75}>
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
                                        <Chip label="-34.81%" size="small" color="secondary" sx={{ ml: 2, borderRadius: 1 }} />
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
                                        <Chip label="-30.44%" size="small" color="secondary" sx={{ ml: 2, borderRadius: 1 }} />
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
                                        <Chip label="-23.67%" size="small" color="secondary" sx={{ ml: 2, borderRadius: 1 }} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </MainCard>
                    </Grid>
                </Grid>
            </Grid>

            {/* toolbar */}
            <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box sx={{ pr: 2, mr: 2, borderRightWidth: '1px' }}>
                        <Button color="primary" size="small" variant="contained" startIcon={<StarFilled />}>
                            Watchlist
                        </Button>
                        {/* <Button sx={{ ml: 1 }} color="primary" size="small" variant="contained" startIcon={<StarFilled />}>
                            Portfolio
                        </Button> */}
                    </Box>

                    {/* tags */}
                    <Box sx={{ gap: 2 }}>
                        <Button
                            variant={tag === 'all' ? 'contained' : 'text'}
                            color={tag === 'all' ? 'secondary' : 'primary'}
                            size="small"
                            sx={{ fontWeight: 800 }}
                            onClick={() => setTag('all')}
                        >
                            All
                        </Button>
                        <Button
                            variant={tag === 'PFP' ? 'contained' : 'text'}
                            color={tag === 'PFP' ? 'secondary' : 'primary'}
                            size="small"
                            sx={{ fontWeight: 800 }}
                            onClick={() => setTag('PFP')}
                        >
                            PFP
                        </Button>
                        <Button
                            variant={tag === 'Gaming' ? 'contained' : 'text'}
                            color={tag === 'Gaming' ? 'secondary' : 'primary'}
                            size="small"
                            sx={{ fontWeight: 800 }}
                            onClick={() => setTag('Gaming')}
                        >
                            Gaming
                        </Button>
                        <Button
                            variant={tag === 'Utility' ? 'contained' : 'text'}
                            color={tag === 'Utility' ? 'secondary' : 'primary'}
                            size="small"
                            sx={{ fontWeight: 800 }}
                            onClick={() => setTag('Utility')}
                        >
                            Utility
                        </Button>
                        <Button
                            variant={tag === 'Collectibles' ? 'contained' : 'text'}
                            color={tag === 'Collectibles' ? 'secondary' : 'primary'}
                            size="small"
                            sx={{ fontWeight: 800 }}
                            onClick={() => setTag('Collectibles')}
                        >
                            Collectibles
                        </Button>
                        <Button
                            variant={tag === 'Generative Art' ? 'contained' : 'text'}
                            color={tag === 'Generative Art' ? 'secondary' : 'primary'}
                            size="small"
                            sx={{ fontWeight: 800 }}
                            onClick={() => setTag('Generative Art')}
                        >
                            Generative Art
                        </Button>
                        <Button
                            variant={tag === 'Virtual World' ? 'contained' : 'text'}
                            color={tag === 'Virtual World' ? 'secondary' : 'primary'}
                            size="small"
                            sx={{ fontWeight: 800 }}
                            onClick={() => setTag('Virtual World')}
                        >
                            Virtual World
                        </Button>
                        <Button
                            variant={tag === 'NEW' ? 'contained' : 'text'}
                            color={tag === 'NEW' ? 'secondary' : 'primary'}
                            size="small"
                            sx={{ fontWeight: 800 }}
                            onClick={() => setTag('NEW')}
                        >
                            New Listings
                        </Button>
                    </Box>

                    {/* filter */}
                    <TextField
                        select
                        value={filterValue}
                        size="small"
                        sx={{ width: 150, textAlign: 'left', ml: 2 }}
                        onChange={(e) => setFilterValue(e.target.value)}
                    >
                        {filter.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </Grid>

            {/* project info */}
            {projects.project_stats && projects.project_stats.length > 0 ? (
                <Grid item xs={12} sx={{ pt: '3 !important' }}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="project monitor table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Collection</TableCell>
                                    <TableCell>Volume (1D)</TableCell>
                                    <TableCell>1d %</TableCell>
                                    <TableCell>Floor Price</TableCell>
                                    <TableCell>Market Cap</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {projects.project_stats.map((project: any, index: number) => (
                                    <TableRow
                                        key={index}
                                        onClick={() => navigate(`/nft/${project.project_id}/explore`, { state: { projectData: project } })}
                                        sx={{
                                            '&:last-child td, &:last-child th': {
                                                border: 0
                                            },
                                            '&:hover': {
                                                cursor: 'pointer',
                                                transition: 'all .1s ease-in-out',
                                                background: '#202a30'
                                            }
                                        }}
                                    >
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell component="th" scope="row">
                                            <Box display="flex" flexDirection="row" alignItems="center">
                                                <Avatar
                                                    src={project.project.img_url}
                                                    sx={{
                                                        ...theme.typography.mediumAvatar,
                                                        backgroundColor: 'transparent'
                                                    }}
                                                    color="inherit"
                                                />
                                                <Stack>
                                                    <Typography variant="h5" fontWeight="700" sx={{ ml: 1 }}>
                                                        {project.project.display_name}
                                                    </Typography>
                                                    <Typography variant="body1" color="primary" fontWeight="600" sx={{ ml: 1 }}>
                                                        {formatNumber.format(project.project.supply)}
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="h4">{formatPrice.format(project.volume_1day)}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            {Math.sign(project.floor_price_1day_change) === 1 ? (
                                                <Chip
                                                    label={formatPercent.format(project.floor_price_1day_change)}
                                                    size="small"
                                                    color="success"
                                                    icon={<IconChevronUp size="1.1rem" stroke={1.5} />}
                                                    sx={{ borderRadius: '24px' }}
                                                />
                                            ) : (
                                                <Chip
                                                    label={formatPercent.format(project.floor_price_1day_change)}
                                                    size="small"
                                                    color="error"
                                                    icon={<IconChevronDown size="1.1rem" stroke={1.5} />}
                                                    sx={{ borderRadius: '24px' }}
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="h4">{formatPriceNumber.format(project.floor_price)} ◎</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="h4">{formatPrice.format(project.market_cap)}</Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            ) : (
                <Grid item xs={12}>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <CircularProgress color="secondary" />
                    </Box>
                </Grid>
            )}

            {projects.project_stats && projects.project_stats.length === 0 && (
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
                                No Pending Collabs Found
                            </Typography>
                            <Typography variant="subtitle2" color="inherit">
                                There are no collaborations to display.
                            </Typography>
                        </Stack>
                    </Box>
                </Grid>
            )}
        </Grid>
    );
};

export default Monitor;
