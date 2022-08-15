import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Grid,
    Box,
    Stack,
    ButtonGroup,
    Button,
    TextField,
    MenuItem,
    Avatar,
    Skeleton,
    Chip,
    Typography,
    TableContainer,
    TablePagination,
    Divider,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    CircularProgress,
    IconButton
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
import { HyperspaceClient, SortOrderEnum } from 'hyperspace-client-js';

// assets
import LargeUser from 'assets/images/placeholder.png';
import { IconChevronDown, IconChevronUp, IconArrowLeft, IconArrowRight } from '@tabler/icons';
import { CloseCircleOutlined, StarFilled } from '@ant-design/icons';

// data
const filter = [
    {
        value: 'last_hour',
        label: 'Last Hour'
    },
    {
        value: 'last_day',
        label: 'Last Day'
    },
    {
        value: 'last_week',
        label: 'Last Week'
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
                    sort_order: 'DESC' as SortOrderEnum
                },
                paginationInfo: {
                    page_number: 1,
                    page_size: 50
                }
            })
            .then((res) => {
                console.log(res.getProjectStats);
                setProjects(res.getProjectStats);
            });
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // table pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - projects.project_stats.length) : 0;

    const [filterValue, setFilterValue] = useState('last_day');

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Stack sx={{ maxWidth: '36rem' }}>
                        <Typography variant="h4" sx={{ fontWeight: 600 }}>
                            Top Collections
                        </Typography>
                    </Stack>
                    <Box display="flex" alignItems="center" sx={{ gap: 1 }}>
                        <IconButton
                            sx={{
                                background: '#202a30',
                                width: '33px',
                                height: '33px',
                                opacity: '0.25',
                                '&:hover': {
                                    cursor: 'not-allowed'
                                }
                            }}
                        >
                            <IconArrowLeft color="#FFF" />
                        </IconButton>
                        <IconButton
                            sx={{
                                background: '#202a30',
                                width: '33px',
                                height: '33px'
                            }}
                        >
                            <IconArrowRight color="#FFF" />
                        </IconButton>
                    </Box>
                </Box>
            </Grid>

            {/* top projects images */}
            {projects.project_stats && projects.project_stats.length > 0 ? (
                <Grid item xs={12}>
                    <Box
                        sx={{
                            maxWidth: 'calc(100vw - 240px - 24px)',
                            padding: '16px 16px 24px',
                            gridAutoFlow: 'unset',
                            gridTemplateColumns: 'repeat(6,minmax(0,1fr))'
                        }}
                    >
                        <Box
                            display="grid"
                            alignItems="center"
                            sx={{
                                gridGap: 2,
                                gap: 2,
                                gridTemplateColumns: 'repeat(18,117px)'
                            }}
                        >
                            <a
                                href="#"
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    position: 'relative',
                                    width: 250,
                                    height: 250,
                                    gridRowStart: 1,
                                    gridRowEnd: 3,
                                    gridColumnStart: 1,
                                    gridColumnEnd: 3
                                }}
                            >
                                <Avatar
                                    alt="Collection Image"
                                    src={projects.project_stats[0].project.img_url}
                                    sx={{
                                        borderRadius: '8px',
                                        width: 250,
                                        height: 250,
                                        '&:hover': {
                                            cursor: 'pointer'
                                        }
                                    }}
                                />
                                {/* <Chip
                                    label="test"
                                    size="small"
                                    color="warning"
                                    icon={<StarFilled style={{ fontSize: 14 }} />}
                                    sx={{
                                        right: 0,
                                        bottom: 0,
                                        maxWidth: '90px',
                                        borderRadius: 3,
                                        zIndex: 500,
                                        backgroundColor: theme.palette.warning.dark,
                                        '& .MuiChip-label': {
                                            pl: '6px !important',
                                            fontWeight: 700
                                        }
                                    }}
                                /> */}
                            </a>
                            {projects.project_stats.slice(1, 33).map((project: any) => (
                                <Avatar
                                    alt="Collection Image"
                                    src={project.project.img_url}
                                    sx={{
                                        borderRadius: '8px',
                                        width: 120,
                                        height: 120,
                                        '&:hover': {
                                            cursor: 'pointer'
                                        }
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Grid>
            ) : (
                <Grid item xs={12}>
                    <Box
                        sx={{
                            maxWidth: 'calc(100vw - 240px - 24px)',
                            padding: '16px 16px 24px',
                            gridAutoFlow: 'unset',
                            gridTemplateColumns: 'repeat(6,minmax(0,1fr))'
                        }}
                    >
                        <Box
                            display="grid"
                            alignItems="center"
                            sx={{
                                gridGap: 2,
                                gap: 2,
                                gridTemplateColumns: 'repeat(18,117px)'
                            }}
                        >
                            <Skeleton
                                variant="rectangular"
                                animation="wave"
                                height={250}
                                width={250}
                                sx={{
                                    borderRadius: '8px',
                                    gridRowStart: 1,
                                    gridRowEnd: 3,
                                    gridColumnStart: 1,
                                    gridColumnEnd: 3
                                }}
                            />
                            {[...Array(32)].map((item) => (
                                <Skeleton
                                    variant="rectangular"
                                    animation="wave"
                                    height={120}
                                    width={120}
                                    sx={{
                                        borderRadius: '8px'
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Grid>
            )}

            {/* toolbar */}
            <Grid item xs={12}>
                <Box display="flex" alignItems="center" sx={{ flexGrow: 1, gap: 1 }}>
                    <ButtonGroup variant="outlined" color="primary" aria-label="outlined primary button group">
                        <Button variant="contained">All</Button>
                        <Button variant="outlined">Portfolio</Button>
                    </ButtonGroup>

                    <Box sx={{ flexGrow: 1 }} />

                    {/* date queries */}
                    <TextField
                        select
                        value={filterValue}
                        size="small"
                        sx={{ width: 'fit-content', textAlign: 'left' }}
                        onChange={(e) => setFilterValue(e.target.value)}
                    >
                        {filter.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* filter */}
                    <TextField
                        select
                        value={filterValue}
                        size="small"
                        sx={{ width: 150, textAlign: 'left' }}
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
                    <MainCard border={false} sx={{ width: '100%' }} contentSX={{ p: '0 !important' }}>
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} aria-label="explore nfts table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Collections</TableCell>
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
                                            onClick={() => navigate(`/nft/${project.project_id}`, { state: { projectData: project } })}
                                            sx={{
                                                '&:last-child td, &:last-child th': {
                                                    border: 0
                                                },
                                                '&:hover': {
                                                    cursor: 'pointer',
                                                    transition: 'all .1s ease-in-out',
                                                    background: 'rgba(255, 255, 255, 0.04)'
                                                }
                                            }}
                                        >
                                            <TableCell component="th" scope="row">
                                                <Box display="flex" flexDirection="row" alignItems="center" sx={{ gap: 1 }}>
                                                    <Typography variant="h5" fontWeight="700" sx={{ minWidth: '32px' }}>
                                                        {index + 1}
                                                    </Typography>
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
                        <Divider />
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={projects.project_stats.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </MainCard>
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
                                No Projects Found
                            </Typography>
                            <Typography variant="subtitle2" color="inherit">
                                There are no projects to display.
                            </Typography>
                        </Stack>
                    </Box>
                </Grid>
            )}
        </Grid>
    );
};

export default Monitor;
