import { useEffect, useState, ReactElement } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import {
    Grid,
    Box,
    Stack,
    Divider,
    Button,
    CircularProgress,
    IconButton,
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
    Tooltip
} from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import { displayGuildIcon } from 'utils/discord';
import { shortenAddress } from 'utils/utils';
import { useToasts } from 'hooks/useToasts';
import MainCard from 'components/MainCard';

// web3 imports
import { useWallet } from '@solana/wallet-adapter-react';

// assets
import DefaultUser from 'assets/images/users/user-image.jpg';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import { CloseCircleOutlined } from '@ant-design/icons';

// test
import { useQuery, useMutation } from '@apollo/client';
import { mutations, queries } from '../../../graphql/graphql';

const ProjectView = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { publicKey, signMessage } = useWallet();
    const { showInfoToast, showErrorToast } = useToasts();
    const { guildId } = useParams();

    const { data: project } = useQuery(queries.GET_PROJECT, { variables: { guildId }, fetchPolicy: 'network-only' });
    const { data, loading, refetch } = useQuery(queries.GET_COLLABS, {
        variables: { guildId },
        fetchPolicy: 'network-only',
        pollInterval: 10000
    });

    const [ApproveCollab] = useMutation(mutations.APPROVE_COLLAB);
    const [RejectCollab] = useMutation(mutations.REJECT_COLLAB);

    const approveCollab = async (id: any, spots: any) => {
        console.log('approved');
        try {
            const messageStr = `You're attempting to approve collab ${id}\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nWallet address:\n${publicKey}`;
            const message = new TextEncoder().encode(messageStr);

            await signMessage!(message)
                .then(async () => {
                    ApproveCollab({ variables: { id, spots } })
                        .then((res) => {
                            console.log(res);
                            showInfoToast(`You have approved this collab, it will begin shortly.`);
                            refetch();
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch((err) => {
                    showErrorToast('An error occured while approving this collab, please try again.');
                });
        } catch (error) {
            console.error(error);
        }
    };

    const rejectCollab = async (id: any) => {
        console.log('rejected');
        try {
            const messageStr = `You're attempting to reject collab ${id}\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nWallet address:\n${publicKey}`;
            const message = new TextEncoder().encode(messageStr);

            await signMessage!(message)
                .then(async () => {
                    RejectCollab({ variables: { id } })
                        .then((res) => {
                            console.log(res);
                            showInfoToast(`You have rejected this collab, it will be deleted shortly.`);
                            refetch();
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch((err) => {
                    showErrorToast('An error occured while rejecting this collab, please try again.');
                });
        } catch (error) {
            console.error(error);
        }
    };

    console.log(project, data, loading);

    return (
        <Grid container spacing={gridSpacing}>
            {loading && !project && !data ? (
                <Grid item xs={12}>
                    <Box sx={{ mt: 8, padding: 4 }}>
                        <Stack alignItems="center">
                            <CircularProgress color="secondary" />
                        </Stack>
                    </Box>
                </Grid>
            ) : (
                <>
                    <Grid item xs={12} sx={{ mb: -2.25 }}>
                        <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            onClick={() => navigate(-1)}
                            sx={{
                                mb: '8px',
                                '&:hover': {
                                    cursor: 'pointer',
                                    color: theme.palette.primary.main,
                                    transition: 'all .1s ease-in-out'
                                }
                            }}
                        >
                            <IconButton size="small" color="primary">
                                <NavigateBeforeRoundedIcon />
                            </IconButton>
                            <Typography variant="h4" color="primary">
                                Go Back
                            </Typography>
                        </Box>

                        <Divider />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <MainCard
                            content={false}
                            boxShadow
                            sx={{
                                color: theme.palette.primary.light,
                                padding: 1,
                                mt: 2,
                                textOverflow: 'ellipsis',
                                '&:hover': {
                                    transform: 'scale3d(1.03, 1.03, 1)',
                                    transition: '.15s'
                                }
                            }}
                        >
                            <Box display="flex" flexDirection="row" justifyContent="flex-start" sx={{ textOverflow: 'ellipsis' }}>
                                <Avatar
                                    src={displayGuildIcon(project.project.guildId, project.project.iconHash)}
                                    sx={{
                                        borderRadius: 2,
                                        mr: 2,
                                        width: '80px !important',
                                        height: '80px !important'
                                    }}
                                />
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="flex-start"
                                    sx={{ gap: 1.5, textOverflow: 'ellipsis' }}
                                >
                                    <Typography variant="h4" fontWeight="600" color="inherit" sx={{ mt: 1 }}>
                                        {project.project.name}
                                    </Typography>
                                    <Box display="flex" flexDirection="row" sx={{ gap: 2 }}>
                                        <Button disableElevation color="secondary" size="small" variant="contained">
                                            Edit Details
                                        </Button>
                                        <Button disableElevation color="secondary" size="small" variant="contained">
                                            Disable Collabs
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </MainCard>
                    </Grid>

                    {/* <Grid item xs={8}>
                        <Button disableElevation color="secondary" size="small" variant="contained">
                            placeholder
                        </Button>
                    </Grid> */}

                    {/* collab info */}
                    {data && data.collabs.length > 0 ? (
                        <Grid item xs={12}>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="h3" sx={{ mb: 2 }}>
                                Available Requests
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="collab table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Project</TableCell>
                                            <TableCell>Type</TableCell>
                                            <TableCell>Format</TableCell>
                                            <TableCell>Spots</TableCell>
                                            <TableCell>Spots Filled</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Requested By</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.collabs.map((collab: any) => (
                                            <TableRow key={collab.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell component="th" scope="row">
                                                    <Box display="flex" flexDirection="row" alignItems="center">
                                                        <Avatar
                                                            src={displayGuildIcon(collab.project.guildId, collab.project.iconHash)}
                                                            sx={{
                                                                ...theme.typography.mediumAvatar,
                                                                backgroundColor: 'transparent'
                                                            }}
                                                            color="inherit"
                                                        />
                                                        <Typography variant="h4" sx={{ ml: 1 }}>
                                                            {collab.project.name}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    {collab.offerType ? (
                                                        <Tooltip
                                                            title="The WL Offering type means the specified project wishes to give you spots to their project."
                                                            placement="top"
                                                            arrow
                                                        >
                                                            <Chip
                                                                label="WL Offering"
                                                                size="small"
                                                                color="primary"
                                                                sx={{ mr: '5px', borderRadius: '4px' }}
                                                            />
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip
                                                            title="The WL Request type means the specified project wishes to recieve spots from your project."
                                                            placement="top"
                                                            arrow
                                                        >
                                                            <Chip
                                                                label="WL Request"
                                                                size="small"
                                                                color="warning"
                                                                sx={{ mr: '5px', borderRadius: '4px' }}
                                                            />
                                                        </Tooltip>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={collab.type ? 'FCFS' : 'Raffle'}
                                                        size="small"
                                                        color="info"
                                                        sx={{ mr: '5px', borderRadius: '4px' }}
                                                    />
                                                </TableCell>
                                                <TableCell>{collab.spots}</TableCell>
                                                <TableCell>
                                                    {collab.status !== null ? (
                                                        <Typography variant="body1" sx={{ ml: 1 }}>
                                                            {collab.spotsFilled ? collab.spotsFilled : `0`} / {collab.spots}
                                                        </Typography>
                                                    ) : (
                                                        <Chip
                                                            label="Not Started"
                                                            size="small"
                                                            color="secondary"
                                                            sx={{ mr: '5px', borderRadius: '4px' }}
                                                        />
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {collab.status === null && (
                                                        <Chip
                                                            label="Pending"
                                                            size="small"
                                                            color="primary"
                                                            sx={{ mr: '5px', borderRadius: '4px' }}
                                                        />
                                                    )}
                                                    {collab.status === 'pending' && (
                                                        <Chip
                                                            label="Pending"
                                                            size="small"
                                                            color="primary"
                                                            sx={{ mr: '5px', borderRadius: '4px' }}
                                                        />
                                                    )}
                                                    {collab.status === 'in-progress' && (
                                                        <Chip
                                                            label="In Progress"
                                                            size="small"
                                                            color="warning"
                                                            sx={{ mr: '5px', borderRadius: '4px' }}
                                                        />
                                                    )}
                                                    {collab.status === 'completed' && (
                                                        <Chip
                                                            label="Completed"
                                                            size="small"
                                                            color="success"
                                                            sx={{ mr: '5px', borderRadius: '4px' }}
                                                        />
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Box display="flex" flexDirection="row" alignItems="center">
                                                        <Avatar
                                                            src={collab.requester.avatarURI ? collab.requester.avatarURI : DefaultUser}
                                                            sx={{
                                                                ...theme.typography.mediumAvatar,
                                                                backgroundColor: 'transparent',
                                                                cursor: 'pointer'
                                                            }}
                                                            color="inherit"
                                                        />
                                                        <Typography variant="h5" sx={{ ml: 1 }}>
                                                            {collab.requester.vanity
                                                                ? collab.requester.vanity
                                                                : shortenAddress(collab.requester.wallet, 5)}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box display="flex" flexDirection="row" sx={{ gap: 1 }}>
                                                        {collab.isAccepted ? (
                                                            <>
                                                                <Button
                                                                    disableElevation
                                                                    color="secondary"
                                                                    size="small"
                                                                    variant="contained"
                                                                    disabled
                                                                >
                                                                    Approve
                                                                </Button>
                                                                <Button
                                                                    disableElevation
                                                                    color="secondary"
                                                                    size="small"
                                                                    variant="contained"
                                                                    disabled
                                                                >
                                                                    Reject
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Button
                                                                    disableElevation
                                                                    color="secondary"
                                                                    size="small"
                                                                    variant="contained"
                                                                    onClick={() => approveCollab(collab.id, collab.spots)}
                                                                >
                                                                    Approve
                                                                </Button>
                                                                <Button
                                                                    disableElevation
                                                                    color="secondary"
                                                                    size="small"
                                                                    variant="contained"
                                                                    onClick={() => rejectCollab(collab.id)}
                                                                >
                                                                    Reject
                                                                </Button>
                                                            </>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
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
                </>
            )}
        </Grid>
    );
};

export default ProjectView;
