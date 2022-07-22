import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Stack, Typography, Chip, CardContent, Grid, Divider, Avatar, Tooltip, Button, Badge } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { CheckCircle } from '@mui/icons-material';

// web3 imports
import { useWallet } from '@solana/wallet-adapter-react';

// project imports
import { useToasts } from 'hooks/useToasts';
import { abbreviateValue } from 'utils/utils';
import SkeletonProductPlaceholder from 'components/cards/Skeleton/ProductPlaceholder';
import UserLink from 'components/UserLink';
import MainCard from 'components/cards/MainCard';

// graphql
import { useQuery, useMutation } from '@apollo/client';
import { mutations, queries } from '../../../graphql/graphql';

// third party
import moment from 'moment';

// assets
import { IconExternalLink } from '@tabler/icons';

// styles
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800]
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'
    }
}));

// constants
enum VoteType {
    FOR = 'for',
    AGAINST = 'against',
    ABSTAIN = 'abstain'
}

const MAX_LENGTH = 58;

const ProposalPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { symbol, id } = useParams();
    const { showInfoToast, showErrorToast } = useToasts();
    const { publicKey, signMessage } = useWallet();

    const [forVotes, setForVotes] = useState(0);
    const [againstVotes, setAgainstVotes] = useState(0);
    const [abstainVotes, setAbstainVotes] = useState(0);

    // GRAPHQL QUERIES
    // eslint-disable-next-line object-shorthand
    const { data: space } = useQuery(queries.GET_SPACE, { variables: { symbol }, fetchPolicy: 'cache-and-network' });
    const { data, loading } = useQuery(queries.GET_PROPOSAL, { variables: { id }, fetchPolicy: 'cache-and-network' });

    const [DeleteProposal] = useMutation(mutations.DELETE_PROPOSAL);
    const [CloseProposal] = useMutation(mutations.CLOSE_PROPOSAL);
    const [VoteProposal] = useMutation(mutations.VOTE_PROPOSAL);

    useEffect(() => {
        if (data && data.proposal) {
            setForVotes(data.proposal.forVotes.length);
            setAgainstVotes(data.proposal.againstVotes.length);
            setAbstainVotes(data.proposal.abstainVotes.length);
        }
    }, [setForVotes, setAgainstVotes, setAbstainVotes]);

    useEffect(() => {
        if (data && data.proposal.status && moment(data.proposal.endsAt).valueOf() < moment().valueOf()) {
            CloseProposal({
                variables: { id: data.proposal.id }
            }).then(
                (res) => {},
                (err) => {
                    console.log(err);
                }
            );
        }
    }, []);

    // Voting Functions
    const forVote = async () => {
        try {
            const messageStr = `You're voting to accept proposal ${data.proposal.id}\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nWallet address:\n${publicKey}`;
            const message = new TextEncoder().encode(messageStr);
            const address = publicKey?.toBase58();

            if (data) {
                if (
                    data.proposal.forVotes.includes(address) ||
                    data.proposal.againstVotes.includes(address) ||
                    data.proposal.abstainVotes.includes(address)
                ) {
                    showErrorToast('You have already voted for this proposal and cannot vote again.');
                    return;
                }
            }

            await signMessage!(message)
                .then(async () => {
                    VoteProposal({
                        variables: { id, type: VoteType.FOR, wallet: address }
                    }).then(
                        (res) => {},
                        (err) => {
                            console.error(err);
                        }
                    );
                    showInfoToast(`Success! You have voted to accept proposal: ${data.proposal.id}`);
                })
                .catch((err) => {
                    showErrorToast('Your vote has not been counted, you must sign the message to submit a vote.');
                });
        } catch (error) {
            console.error(error);
        }
    };

    const againstVote = async () => {
        try {
            const messageStr = `You're voting against proposal ${data.proposal.id}\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nWallet address:\n${publicKey}`;
            const message = new TextEncoder().encode(messageStr);
            const address = publicKey?.toBase58();

            if (data) {
                if (
                    data.proposal.forVotes.includes(address) ||
                    data.proposal.againstVotes.includes(address) ||
                    data.proposal.abstainVotes.includes(address)
                ) {
                    showErrorToast('You have already voted for this proposal and cannot vote again.');
                    return;
                }
            }

            await signMessage!(message)
                .then(async () => {
                    VoteProposal({
                        variables: { id, type: VoteType.AGAINST, wallet: address }
                    }).then(
                        (res) => {},
                        (err) => {
                            console.error(err);
                        }
                    );
                    showInfoToast(`Success! You have voted against proposal: ${data.proposal.id}`);
                })
                .catch((err) => {
                    showErrorToast('Your vote has not been counted, you must sign the message to submit a vote.');
                });
        } catch (error) {
            console.error(error);
        }
    };

    const abstainVote = async () => {
        try {
            const messageStr = `You're voting to abstain proposal ${data.proposal.id}\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nWallet address:\n${publicKey}`;
            const message = new TextEncoder().encode(messageStr);
            const address = publicKey?.toBase58();

            if (data) {
                if (
                    data.proposal.forVotes.includes(address) ||
                    data.proposal.againstVotes.includes(address) ||
                    data.proposal.abstainVotes.includes(address)
                ) {
                    showErrorToast('You have already voted for this proposal and cannot vote again.');
                    return;
                }
            }

            await signMessage!(message)
                .then(async () => {
                    VoteProposal({
                        variables: { id, type: VoteType.ABSTAIN, wallet: address }
                    }).then(
                        (res) => {},
                        (err) => {
                            console.error(err);
                        }
                    );
                    showInfoToast(`Success! You have voted to abstain proposal: ${data.proposal.id}`);
                })
                .catch((err) => {
                    showErrorToast('Your vote has not been counted, you must sign the message to submit a vote.');
                });
        } catch (error) {
            console.error(error);
        }
    };

    const getVotePercentage = (votes: number) => {
        if (votes === 0 || null) {
            return `N/A`;
        }

        const total = Math.floor(forVotes + againstVotes + abstainVotes);
        return `${((votes / total) * 100).toFixed(2)}%`;
    };

    // Manage Functions
    const deleteProposal = async () => {
        if (publicKey) {
            if (publicKey.toBase58() === data.proposal.author.wallet) {
                DeleteProposal({
                    variables: { id: data.proposal.id }
                }).then(
                    (res) => {},
                    (err) => {
                        console.error(err);
                    }
                );
                showInfoToast(`You have deleted ${data.proposal.title}`);
                navigate(-1);
            }
        }
    };

    return (
        <>
            {loading ? (
                <SkeletonProductPlaceholder />
            ) : (
                <>
                    <Grid item xs={12} display="flex" justifyContent="flex-start" alignItems="center">
                        <Typography
                            variant="h4"
                            color="primary"
                            onClick={() => navigate(-1)}
                            sx={{
                                ml: 1,
                                mb: '16px',
                                '&:hover': {
                                    cursor: 'pointer',
                                    color: theme.palette.primary.light,
                                    transition: 'all .1s ease-in-out'
                                }
                            }}
                        >
                            Go Back
                        </Typography>
                    </Grid>

                    <Stack direction="row" justifyContent="space-around" alignItems="flex-start" sx={{ mr: 'auto', gap: 2 }}>
                        <Grid item xs={9}>
                            <MainCard
                                sx={{
                                    color: theme.palette.primary.light
                                }}
                            >
                                <CardContent sx={{ p: '0 !important', justifyContent: 'center' }}>
                                    <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
                                        {/* Proposal Title */}
                                        <Typography
                                            variant="h2"
                                            fontWeight="600"
                                            sx={{
                                                display: 'block',
                                                color:
                                                    theme.palette.mode === 'dark'
                                                        ? theme.palette.primary.light
                                                        : theme.palette.secondary.dark
                                            }}
                                        >
                                            {data.proposal.title}
                                        </Typography>
                                    </Box>

                                    {/* Status/Author/Misc */}
                                    <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center" sx={{ mb: 3 }}>
                                        {data.proposal.type ? (
                                            <Tooltip title="Proposed by the Core Team" arrow>
                                                <Chip
                                                    color="info"
                                                    size="small"
                                                    label={<span>Core</span>}
                                                    icon={<CheckCircle fontSize="small" />}
                                                    sx={{ borderRadius: '40px !important', mr: 1 }}
                                                />
                                            </Tooltip>
                                        ) : (
                                            <Chip
                                                color="secondary"
                                                size="small"
                                                label={<span>Community</span>}
                                                sx={{ borderRadius: '40px !important', mr: 1 }}
                                            />
                                        )}
                                        <Chip
                                            size="small"
                                            color={data.proposal.status ? 'success' : 'success'}
                                            label={<span>{data.proposal.status ? 'Active' : 'Active'}</span>}
                                            sx={{ borderRadius: '40px !important', mr: 1 }}
                                        />

                                        <Avatar
                                            src={space.space.avatar}
                                            sx={{
                                                width: '28px !important',
                                                height: '28px !important'
                                            }}
                                            color="inherit"
                                        />
                                        <Typography
                                            variant="subtitle1"
                                            color="primary"
                                            sx={{ ml: 1, display: 'block', textDecoration: 'none' }}
                                        >
                                            {space.space.name} by
                                            <UserLink user={data.proposal.author} />
                                        </Typography>
                                    </Box>

                                    <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center" sx={{ mb: 7 }}>
                                        <Typography variant="h3" color="primary" sx={{ ml: 1, display: 'block', textDecoration: 'none' }}>
                                            {data.proposal.body}
                                        </Typography>
                                    </Box>

                                    {data.proposal.status && (
                                        <Box sx={{ mb: 4 }}>
                                            <MainCard
                                                title="Cast your vote"
                                                sx={{
                                                    color: theme.palette.primary.light,
                                                    borderColor: 'rgba(213, 217, 233, 0.2)',
                                                    mb: 2
                                                }}
                                            >
                                                <CardContent sx={{ p: '0px !important', justifyContent: 'center' }}>
                                                    <Grid container spacing={1} flexDirection="column">
                                                        <Grid item>
                                                            <Button
                                                                variant="outlined"
                                                                color="primary"
                                                                fullWidth
                                                                disableElevation
                                                                disableRipple
                                                                onClick={forVote}
                                                                sx={{
                                                                    borderRadius: '24px'
                                                                }}
                                                            >
                                                                For
                                                            </Button>
                                                        </Grid>
                                                        <Grid item>
                                                            <Button
                                                                variant="outlined"
                                                                color="primary"
                                                                fullWidth
                                                                disableElevation
                                                                disableRipple
                                                                onClick={againstVote}
                                                                sx={{
                                                                    borderRadius: '24px'
                                                                }}
                                                            >
                                                                Against
                                                            </Button>
                                                        </Grid>
                                                        <Grid item>
                                                            <Button
                                                                variant="outlined"
                                                                color="primary"
                                                                fullWidth
                                                                disableElevation
                                                                disableRipple
                                                                onClick={abstainVote}
                                                                sx={{
                                                                    borderRadius: '24px'
                                                                }}
                                                            >
                                                                Abstain
                                                            </Button>
                                                        </Grid>
                                                        <Grid item>
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                fullWidth
                                                                disableElevation
                                                                disableRipple
                                                                sx={{
                                                                    mt: 2,
                                                                    borderRadius: '24px'
                                                                }}
                                                            >
                                                                Vote
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </MainCard>
                                        </Box>
                                    )}

                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            fullWidth
                                            disableElevation
                                            disableRipple
                                            sx={{
                                                fontSize: '1.25rem',
                                                fontWeight: '600',
                                                borderRadius: '12px',
                                                borderColor: 'rgba(213, 217, 233, 0.2)',
                                                padding: '12px !important',
                                                justifyContent: 'space-between !important'
                                            }}
                                            endIcon={<IconExternalLink stroke={1.5} style={{ fontSize: '0.98rem' }} />}
                                        >
                                            Discussion
                                        </Button>
                                    </Box>

                                    {/* <Box display="flex" alignItems="center" sx={{ mt: 2, width: '100%' }}>
                                        <MainCard
                                            sx={{
                                                border: '1px solid rgba(96, 109, 136, 0.5) !important',
                                                width: '100%',
                                                borderRadius: '0px !important',
                                                borderTopLeftRadius: '12px !important',
                                                borderTopRightRadius: '12px !important',
                                                color: theme.palette.primary.light
                                            }}
                                        >
                                            <CardContent sx={{ p: '0px !important', justifyContent: 'center' }}>
                                                <Typography variant="h3" fontWeight="600" color="primary" sx={{ display: 'block' }}>
                                                    Votes
                                                    <Badge badgeContent={100} max={999} color="primary" sx={{ ml: 3 }} />
                                                </Typography>
                                            </CardContent>
                                        </MainCard>
                                        <MainCard
                                            sx={{
                                                borderLeft: '1px solid rgba(96, 109, 136, 0.5) !important',
                                                borderRight: '1px solid rgba(96, 109, 136, 0.5) !important',
                                                borderBottom: '1px solid rgba(96, 109, 136, 0.5) !important',
                                                width: '100%',
                                                borderTop: '0px',
                                                borderRadius: '0px !important',
                                                borderBottomLeftRadius: '12px !important',
                                                borderBottomRightRadius: '12px !important',
                                                color: theme.palette.primary.light
                                            }}
                                        >
                                            <CardContent sx={{ p: '0px !important', justifyContent: 'center' }}>
                                                <Typography variant="body1" fontWeight="400" color="primary" sx={{ display: 'block' }}>
                                                    matical.sol
                                                </Typography>
                                            </CardContent>
                                        </MainCard>
                                    </Box> */}
                                </CardContent>
                            </MainCard>
                        </Grid>

                        <Grid item xs={3}>
                            <MainCard
                                sx={{
                                    color: theme.palette.primary.light,
                                    mb: 2
                                }}
                            >
                                <CardContent sx={{ p: '0px !important', justifyContent: 'center' }}>
                                    {/* avatar */}
                                    <Box display="flex" flexDirection="column" justifyContent="center">
                                        <Typography
                                            variant="h3"
                                            fontWeight="600"
                                            color="inherit"
                                            sx={{ display: 'block', marginBottom: '5px !important' }}
                                        >
                                            Information
                                        </Typography>

                                        <Divider sx={{ mt: 1, mb: 0.5 }} />

                                        <Box display="flex" flexWrap="wrap" justifyContent="space-between" sx={{ mt: 1 }}>
                                            <Typography variant="h5" color="primary" sx={{ display: 'block' }}>
                                                Voting System
                                            </Typography>
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    display: 'block',
                                                    paddingLeft: 1,
                                                    color:
                                                        theme.palette.mode === 'dark'
                                                            ? theme.palette.primary.light
                                                            : theme.palette.secondary.dark
                                                }}
                                            >
                                                Basic Voting
                                            </Typography>
                                        </Box>

                                        <Box display="flex" flexWrap="wrap" justifyContent="space-between" sx={{ mt: 0.5 }}>
                                            <Typography variant="h5" color="primary" sx={{ display: 'block' }}>
                                                Start Date
                                            </Typography>
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    display: 'block',
                                                    paddingLeft: 1,
                                                    color:
                                                        theme.palette.mode === 'dark'
                                                            ? theme.palette.primary.light
                                                            : theme.palette.secondary.dark
                                                }}
                                            >
                                                {/* eslint-disable-next-line radix */}
                                                {moment(parseInt(data.proposal.createdAt)).format('MMM DD, yyyy, h:mm A')}
                                            </Typography>
                                        </Box>

                                        <Box display="flex" flexWrap="wrap" justifyContent="space-between" sx={{ mt: 0.5 }}>
                                            <Typography variant="h5" color="primary" sx={{ display: 'block' }}>
                                                End Date
                                            </Typography>
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    display: 'block',
                                                    paddingLeft: 1,
                                                    color:
                                                        theme.palette.mode === 'dark'
                                                            ? theme.palette.primary.light
                                                            : theme.palette.secondary.dark
                                                }}
                                            >
                                                {/* eslint-disable-next-line radix */}
                                                {moment(data.proposal.endsAt).format('MMM DD, yyyy, h:mm A')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </MainCard>

                            <MainCard
                                sx={{
                                    color: theme.palette.primary.light
                                }}
                            >
                                <CardContent sx={{ p: '0px !important', justifyContent: 'center' }}>
                                    {/* avatar */}
                                    <Box display="flex" flexDirection="column" justifyContent="center">
                                        <Typography
                                            variant="h3"
                                            fontWeight="600"
                                            color="inherit"
                                            sx={{ display: 'block', marginBottom: '5px !important' }}
                                        >
                                            {data.proposal.status ? 'Current Results' : 'Results'}
                                        </Typography>

                                        <Divider sx={{ mt: 1, mb: 0.5 }} />

                                        <Box display="flex" flexWrap="wrap" justifyContent="space-between" sx={{ mt: 1 }}>
                                            <Typography variant="h5" color="primary" sx={{ display: 'block' }}>
                                                For
                                            </Typography>
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    display: 'block',
                                                    paddingLeft: 1,
                                                    color:
                                                        theme.palette.mode === 'dark'
                                                            ? theme.palette.primary.light
                                                            : theme.palette.secondary.dark
                                                }}
                                            >
                                                {abbreviateValue(forVotes)} {space.space.symbol} {getVotePercentage(forVotes)}
                                            </Typography>
                                        </Box>

                                        <Box display="flex" width="100%">
                                            <BorderLinearProgress variant="determinate" value={80} />
                                        </Box>

                                        <Box display="flex" flexWrap="wrap" justifyContent="space-between" sx={{ mt: 0.5 }}>
                                            <Typography variant="h5" color="primary" sx={{ display: 'block' }}>
                                                Against
                                            </Typography>
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    display: 'block',
                                                    paddingLeft: 1,
                                                    color:
                                                        theme.palette.mode === 'dark'
                                                            ? theme.palette.primary.light
                                                            : theme.palette.secondary.dark
                                                }}
                                            >
                                                {abbreviateValue(againstVotes)} {space.space.symbol} {getVotePercentage(againstVotes)}
                                            </Typography>
                                        </Box>

                                        <Box display="flex">
                                            <BorderLinearProgress variant="determinate" value={80} />
                                        </Box>

                                        <Box display="flex" flexWrap="wrap" justifyContent="space-between" sx={{ mt: 0.5 }}>
                                            <Typography variant="h5" color="primary" sx={{ display: 'block' }}>
                                                Abstain
                                            </Typography>
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    display: 'block',
                                                    paddingLeft: 1,
                                                    color:
                                                        theme.palette.mode === 'dark'
                                                            ? theme.palette.primary.light
                                                            : theme.palette.secondary.dark
                                                }}
                                            >
                                                {abbreviateValue(abstainVotes)} {space.space.symbol} {getVotePercentage(abstainVotes)}
                                            </Typography>
                                        </Box>

                                        <Box display="flex">
                                            <BorderLinearProgress variant="determinate" value={80} />
                                        </Box>
                                    </Box>
                                </CardContent>
                            </MainCard>
                        </Grid>
                    </Stack>
                </>
            )}
        </>
    );
};

export default ProposalPage;
