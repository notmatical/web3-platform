import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Grid,
    Box,
    Stack,
    Divider,
    Button,
    TextField,
    MenuItem,
    IconButton,
    Avatar,
    Typography,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    Tooltip
} from '@mui/material';

// project imports
import { HS_API_KEY } from 'config';
import { gridSpacing } from 'store/constant';
import { formatPriceNumber, formatPrice, formatPercent, abbreviateValue } from 'utils/utils';
import TopSaleCard from './components/TopSaleCard';
import TrendingProfileCard from './components/TrendingProfileCard';

// third-party
import { HyperspaceClient, MarketplaceActionEnums, SortOrderEnum } from 'hyperspace-client-js';

// assets
import { IconChevronDown, IconInfoCircle } from '@tabler/icons';
import { CloseCircleOutlined, InfoCircleFilled } from '@ant-design/icons';
import LargeUser from 'assets/images/placeholder.png';
import DefaultUser from 'assets/images/users/user-image.jpg';

const Activity = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const hsClient = new HyperspaceClient(HS_API_KEY);

    const [value, setValue] = useState('all');
    const [search, setSearch] = useState('test');

    const [projects, setProjects] = useState<any>([]);
    const fetchTopCollections = async () => {
        hsClient
            .getProjects({
                orderBy: {
                    field_name: 'volume_7day',
                    sort_order: 'DESC' as SortOrderEnum
                },
                paginationInfo: {
                    page_size: 5
                }
            })
            .then((res) => {
                console.log(res);
                setProjects(res.getProjectStats);
            });
    };

    useEffect(() => {
        fetchTopCollections();
    }, []);

    console.log(projects);

    return (
        <Grid container spacing={gridSpacing}>
            {/* recent purchases */}
            <Grid item xs={12}>
                <Box display="flex" flexDirection="row" alignItems="center" sx={{ gap: 2 }}>
                    <Avatar
                        alt="User Image"
                        src={LargeUser}
                        sx={{
                            borderRadius: '8px',
                            width: 250,
                            height: 250
                        }}
                    />
                    <Stack sx={{ gap: 1.25 }}>
                        <Avatar
                            alt="User Image"
                            src="https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://bafybeib7a7tbordgtmtnqhctbrf6fvwooawnjwsz64eldym7rhps5e5qqa.ipfs.dweb.link/629.png?ext=png"
                            sx={{
                                borderRadius: '8px',
                                width: 120,
                                height: 120
                            }}
                        />
                        <Avatar
                            alt="User Image"
                            src="https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://bafybeidqks6plv3ophnuwiricawtbt5p4xkcsjmx4vet4sen4b6viaknxa.ipfs.dweb.link/5154.png?ext=png"
                            sx={{
                                borderRadius: '8px',
                                width: 120,
                                height: 120
                            }}
                        />
                    </Stack>
                    <Stack sx={{ gap: 1.25 }}>
                        <Avatar
                            alt="User Image"
                            src="https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://metadata.degods.com/g/6614.png"
                            sx={{
                                borderRadius: '8px',
                                width: 120,
                                height: 120
                            }}
                        />
                        <Avatar
                            alt="User Image"
                            src="https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://bafybeihd4djtc3n23uazvzhigfv4berqfvaz4rwdmff3li23v2ckwnhqkq.ipfs.dweb.link/2826.png?ext=png"
                            sx={{
                                borderRadius: '8px',
                                width: 120,
                                height: 120
                            }}
                        />
                    </Stack>
                    <Stack sx={{ gap: 1.25 }}>
                        <Avatar
                            alt="User Image"
                            src="https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://bafybeiebjzguhtcdnybp2way4l6f5aynmrvqz4tbgvwjumbltefulwdszq.ipfs.dweb.link/6763.png?ext=png"
                            sx={{
                                borderRadius: '8px',
                                width: 120,
                                height: 120
                            }}
                        />
                        <Avatar
                            alt="User Image"
                            src="https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://bafybeigxpevx4ylqh36lyhisqn4ukbawuybqupq4p66kohzxu2zdcjbsca.ipfs.dweb.link/6695.png?ext=png"
                            sx={{
                                borderRadius: '8px',
                                width: 120,
                                height: 120
                            }}
                        />
                    </Stack>
                    <Stack sx={{ gap: 1.25 }}>
                        <Avatar
                            alt="User Image"
                            src="https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://bafybeigua6fb3xi6npkklws46jpecwyyg3nvgliv6xbs77ji4aepj3lyuy.ipfs.dweb.link/4083.png?ext=png"
                            sx={{
                                borderRadius: '8px',
                                width: 120,
                                height: 120
                            }}
                        />
                        <Avatar
                            alt="User Image"
                            src="https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://ipfs.io/ipfs/QmPJENLDyXnuy4V8PLvDu8yU3gpC5cYwvh9zszMKZNW5fm"
                            sx={{
                                borderRadius: '8px',
                                width: 120,
                                height: 120
                            }}
                        />
                    </Stack>
                    <Stack sx={{ gap: 1.25 }}>
                        <Avatar
                            alt="User Image"
                            src="https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://taiyorobotics.s3-us-west-1.amazonaws.com/images/d17a29a5e3fcaafada4eb9aacbf5fdb7.png"
                            sx={{
                                borderRadius: '8px',
                                width: 120,
                                height: 120
                            }}
                        />
                        <Avatar
                            alt="User Image"
                            src="https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://www.arweave.net/_r9GBWrsGa8UCqGC5HK_6F8NYT-cpTjAFE_HqMB3sSA?ext=png"
                            sx={{
                                borderRadius: '8px',
                                width: 120,
                                height: 120
                            }}
                        />
                    </Stack>
                </Box>
            </Grid>

            {/* top collections */}
            <Grid item xs={12}>
                <Box display="flex" flexDirection="row" alignItems="center" sx={{ mb: 3 }}>
                    <Typography variant="h3" sx={{ mr: 0.875 }}>
                        Top Collections
                    </Typography>
                    <Box
                        display="flex"
                        flexDirection="row"
                        sx={{
                            '&:hover': {
                                cursor: 'pointer'
                            }
                        }}
                    >
                        <Typography
                            variant="h3"
                            color="secondary"
                            sx={{
                                mr: 0.375,
                                '&:hover': {
                                    transition: 'all .15s ease-in-out',
                                    color: theme.palette.secondary.dark
                                }
                            }}
                        >
                            today
                        </Typography>
                        <IconChevronDown size="1.5rem" color={theme.palette.secondary.main} />
                    </Box>
                </Box>
                {projects.project_stats && projects.project_stats.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="collab table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Project</TableCell>
                                    <TableCell>Volume</TableCell>
                                    <TableCell>Floor Price</TableCell>
                                    <TableCell>Items</TableCell>
                                    <TableCell>Last 24h</TableCell>
                                    <TableCell>Last week</TableCell>
                                    <TableCell>Last month</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {projects.project_stats.map((project: any, index: number) => (
                                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                            <Box display="flex" flexDirection="row" alignItems="center">
                                                <Avatar
                                                    src={project.project.img_url}
                                                    sx={{
                                                        ...theme.typography.largeAvatar,
                                                        backgroundColor: 'transparent'
                                                    }}
                                                    color="inherit"
                                                />
                                                <Typography variant="h5" fontWeight="700" sx={{ ml: 1 }}>
                                                    {project.project.display_name}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="h4">{formatPrice.format(project.volume_7day)}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="h4">{formatPriceNumber.format(project.floor_price)} ◎</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="h4">{abbreviateValue(project.project.supply)}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            {Math.sign(project.volume_1day_change) === 1 ? (
                                                <Typography variant="h5" color="success.main">
                                                    +{formatPercent.format(project.volume_1day_change / 100)}
                                                </Typography>
                                            ) : (
                                                <Typography variant="h5" color="error.main">
                                                    {formatPercent.format(project.volume_1day_change / 100)}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {Math.sign(project.volume_1day_change) === 1 ? (
                                                <Typography variant="h5" color="success.main">
                                                    +{formatPercent.format((project.volume_1day_change * 7) / 100)}
                                                </Typography>
                                            ) : (
                                                <Typography variant="h5" color="error.main">
                                                    {formatPercent.format((project.volume_1day_change * 7) / 100)}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {Math.sign(project.volume_1day_change) === 1 ? (
                                                <Typography variant="h5" color="success.main">
                                                    +{formatPercent.format((project.volume_1day_change * 30) / 100)}
                                                </Typography>
                                            ) : (
                                                <Typography variant="h5" color="error.main">
                                                    {formatPercent.format((project.volume_1day_change * 30) / 100)}
                                                </Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
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

            {/* trending collectors */}
            <Grid item xs={12}>
                <Typography variant="h3">Trending Collectors</Typography>
                <Box display="flex" flexDirection="row" sx={{ mt: 3, gap: 2 }}>
                    <TrendingProfileCard />
                    <TrendingProfileCard />
                    <TrendingProfileCard />
                    <TrendingProfileCard />
                    <TrendingProfileCard />
                </Box>
            </Grid>

            {/* top sales */}
            <Grid item xs={12}>
                <Box display="flex" flexDirection="row" alignItems="center">
                    <Typography variant="h3" sx={{ mr: 0.875 }}>
                        Top Sales
                    </Typography>
                    <Box
                        display="flex"
                        flexDirection="row"
                        sx={{
                            '&:hover': {
                                cursor: 'pointer'
                            }
                        }}
                    >
                        <Typography
                            variant="h3"
                            color="secondary"
                            sx={{
                                mr: 0.375,
                                '&:hover': {
                                    transition: 'all .15s ease-in-out',
                                    color: theme.palette.secondary.dark
                                }
                            }}
                        >
                            this week
                        </Typography>
                        <IconChevronDown size="1.5rem" color={theme.palette.secondary.main} />
                    </Box>
                </Box>
                <Box display="flex" flexDirection="row" sx={{ mt: 3, gap: 2 }}>
                    <TopSaleCard />
                    <TopSaleCard />
                    <TopSaleCard />
                    <TopSaleCard />
                    <TopSaleCard />
                </Box>
            </Grid>

            {/* following activity */}
            <Grid item xs={12}>
                <Typography variant="h3">Follower Activity</Typography>
                <Box display="flex" sx={{ flexGrow: 1, mt: 3 }}>
                    <Avatar
                        alt="User Image"
                        src="https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://bafybeib7a7tbordgtmtnqhctbrf6fvwooawnjwsz64eldym7rhps5e5qqa.ipfs.dweb.link/629.png?ext=png"
                        sx={{
                            mr: 1.5,
                            borderRadius: '8px',
                            width: 120,
                            height: 120
                        }}
                    />
                    <Stack sx={{ flexGrow: 1 }}>
                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                            <Typography variant="body1">Purchased</Typography>
                            <Box display="flex" flexDirection="row" alignItems="center">
                                <Typography variant="body1" color="primary" sx={{ mr: 1 }}>
                                    Less than a minute ago
                                </Typography>
                                <InfoCircleFilled style={{ color: theme.palette.primary.main }} />
                            </Box>
                        </Box>
                        <Typography variant="h4">Okay Bear #630</Typography>

                        <Box display="flex" flexDirection="row" sx={{ mt: 2.5, gap: 4 }}>
                            <Stack sx={{ flexGrow: 0 }}>
                                <Typography variant="body1">Owner</Typography>
                                <Stack flexDirection="row" alignItems="center">
                                    <Avatar
                                        alt="User Image"
                                        src="https://arweave.net/imVWai0XEMWqZk-e6HWwHvC7AkkWTwZnz4AYnhMXuWI"
                                        sx={{
                                            mr: 1.5,
                                            borderRadius: '8px',
                                            width: 35,
                                            height: 35
                                        }}
                                    />
                                    <Typography variant="h5">matical.sol</Typography>
                                </Stack>
                            </Stack>
                            <Stack>
                                <Typography variant="body1">Collection</Typography>
                                <Stack flexDirection="row" alignItems="center">
                                    <Avatar
                                        alt="User Image"
                                        src="https://bafkreidgfsdjx4nt4vctch73hcchb3pkiwic2onfw5yr4756adchogk5de.ipfs.dweb.link/"
                                        sx={{
                                            mr: 1.5,
                                            borderRadius: '8px',
                                            width: 35,
                                            height: 35
                                        }}
                                    />
                                    <Typography variant="h5">Okay Bears</Typography>
                                </Stack>
                            </Stack>
                        </Box>
                    </Stack>
                </Box>
                <Box display="flex" sx={{ flexGrow: 1, mt: 3 }}>
                    <Avatar
                        alt="User Image"
                        src="https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://bafybeigr7fg25ejuk5i47fim5kzustvrrwwq5qt36nazr44h4vn67zljau.ipfs.dweb.link/2928.jpg?ext=jpg"
                        sx={{
                            mr: 1.5,
                            borderRadius: '8px',
                            width: 120,
                            height: 120
                        }}
                    />
                    <Stack sx={{ flexGrow: 1 }}>
                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                            <Typography variant="body1">Purchased</Typography>
                            <Box display="flex" flexDirection="row" alignItems="center">
                                <Typography variant="body1" color="primary" sx={{ mr: 1 }}>
                                    About an hour ago
                                </Typography>
                                <InfoCircleFilled style={{ color: theme.palette.primary.main }} />
                            </Box>
                        </Box>
                        <Typography variant="h4">Yaku X #2928</Typography>

                        <Box display="flex" flexDirection="row" sx={{ mt: 2.5, gap: 4 }}>
                            <Stack sx={{ flexGrow: 0 }}>
                                <Typography variant="body1">Owner</Typography>
                                <Stack flexDirection="row" alignItems="center">
                                    <Avatar
                                        alt="User Image"
                                        src={DefaultUser}
                                        sx={{
                                            mr: 1.5,
                                            borderRadius: '8px',
                                            width: 35,
                                            height: 35
                                        }}
                                    />
                                    <Typography variant="h5">death.eth</Typography>
                                </Stack>
                            </Stack>
                            <Stack>
                                <Typography variant="body1">Collection</Typography>
                                <Stack flexDirection="row" alignItems="center">
                                    <Avatar
                                        alt="User Image"
                                        src="https://bafybeigaq3x3iz3v24qjnv26ql7c7fstll6reolqbxkpncpbpa23bovgva.ipfs.dweb.link/"
                                        sx={{
                                            mr: 1.5,
                                            borderRadius: '8px',
                                            width: 35,
                                            height: 35
                                        }}
                                    />
                                    <Typography variant="h5">Yaku X</Typography>
                                </Stack>
                            </Stack>
                        </Box>
                    </Stack>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Activity;
