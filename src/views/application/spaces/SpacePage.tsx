import { useState, ReactElement } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { Box, Typography, Avatar, TextField, MenuItem, Button, Grid, Dialog, Tooltip, Link } from '@mui/material';
import { AddCircle } from '@mui/icons-material';

// assets
import VerifiedIcon from '@mui/icons-material/Verified';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import TwitterIcon from '@mui/icons-material/Twitter';
import LanguageIcon from '@mui/icons-material/Language';
import { IconBrandDiscord } from '@tabler/icons';

// project imports
import { useToasts } from 'hooks/useToasts';
import { abbreviateValue, shortenAddress } from 'utils/utils';
import SkeletonProductPlaceholder from 'components/cards/Skeleton/ProductPlaceholder';
import MainCard from 'components/cards/MainCard';
import ProposalCard from './proposals/ProposalCard';
import AddProposalForm from './AddProposalForm';

// graphql
import { useQuery, useMutation } from '@apollo/client';
import { mutations, queries } from '../../graphql/graphql';
import { useWallet } from '@solana/wallet-adapter-react';

// third party
import { FormikValues } from 'formik';
import moment from 'moment';

// constants
const MAX_LENGTH = 310;

const status = [
    {
        value: 'all',
        label: 'All'
    },
    {
        value: 'active',
        label: 'Active'
    },
    {
        value: 'pending',
        label: 'Pending'
    },
    {
        value: 'closed',
        label: 'Closed'
    },
    {
        value: 'core',
        label: 'Core'
    }
];

const SpacePage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { symbol } = useParams();
    const { publicKey } = useWallet();
    const { showInfoToast, showErrorToast } = useToasts();

    const [hover, setHover] = useState(false);
    const [value, setValue] = useState('all');

    // GRAPHQL QUERIES
    // eslint-disable-next-line object-shorthand
    const { data, loading } = useQuery(queries.GET_SPACE, { variables: { symbol: symbol }, fetchPolicy: 'cache-and-network' });
    const { data: proposals } = useQuery(queries.GET_PROPOSALS_FOR_SPACE, {
        variables: { id: data.space.id },
        fetchPolicy: 'cache-and-network'
    });

    // GRAPHQL MUTATIONS
    const [CreateProposal] = useMutation(mutations.CREATE_PROPOSAL);

    // modal/dialog related shit
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleProposalCreate = async (projectData: FormikValues) => {
        const { title, body, discussion } = projectData;
        const author = publicKey?.toBase58();
        const postedIn = data.space.id;
        const endsAt = moment().add('days', 5);

        CreateProposal({
            variables: { author, title, body, discussion, postedIn, endsAt }
        }).then(
            (res) => {
                navigate(`/spaces/${symbol}/proposal/${res.data.createProposal.id}`, { replace: true });
            },
            (err) => {
                showErrorToast('An error has occured while submitting your proposal, please try again.');
            }
        );

        showInfoToast(`You have added a new proposal: ${projectData.title}`);
        handleModalClose();
    };

    const handleAddProposal = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    // Space Card Redirections
    const CreateProposalLink = () => {
        navigate(`/spaces/${symbol}/create`, { replace: true });
    };

    // notifs: TODO;
    const handleNotification = () => {
        if (!('Notification' in window)) {
            console.log('no support');
        } else {
            console.log('permissions');
            Notification.requestPermission();
        }
    };

    const testNotification = () => {
        console.log('new notif');
        const options: NotificationOptions = {
            silent: true,
            body: 'This is the body of the Notification',
            icon: 'https://i.imgur.com/G01ukQv.png',
            dir: 'auto'
        };
        const notif = new Notification('Yaku Labs Dashboard', options);
    };

    let spaceProposals: ReactElement | ReactElement[] = <></>;
    if (proposals && proposals.proposalsIn && proposals.proposalsIn.length > 0) {
        spaceProposals = proposals.proposalsIn.map((proposal: any, index: any) => (
            <Grid key={index} item xs={12}>
                <ProposalCard space={data.space} proposal={proposal} image={null} />
            </Grid>
        ));
    } else {
        spaceProposals = (
            <MainCard
                sx={{
                    background: 'none !important',
                    color: theme.palette.primary.light,
                    borderColor: 'rgba(213, 217, 233, 0.2)',
                    mb: 2
                }}
            >
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                    <Typography variant="h5" color="primary" fontWeight="600" sx={{ mb: 2 }}>
                        Oops, we cannot find any results
                    </Typography>
                    <Button color="secondary" variant="contained" sx={{ borderRadius: '4px' }} onClick={handleAddProposal}>
                        <AddCircle fontSize="small" sx={{ mr: 0.75 }} />
                        New Proposal
                    </Button>
                </Box>
            </MainCard>
        );
    }

    return (
        <>
            {loading ? (
                <SkeletonProductPlaceholder />
            ) : (
                <>
                    <Grid container>
                        <MainCard
                            content={false}
                            sx={{
                                background: 'none !important',
                                color: theme.palette.primary.light,
                                borderColor: 'rgba(213, 217, 233, 0.2)',
                                position: 'fixed',
                                width: '240px',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                display: { xs: 'none', md: 'none', lg: 'block' }
                            }}
                        >
                            {/* avatar */}
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                sx={{ pl: '0px !important', pt: '0px !important' }}
                            >
                                <Avatar
                                    src={data.space.avatar}
                                    sx={{
                                        borderRadius: '9999px',
                                        width: '80px !important',
                                        height: '80px !important',
                                        minWidth: '80px',
                                        mb: 1,
                                        mt: 2,
                                        '&:hover': {
                                            cursor: 'pointer'
                                        }
                                    }}
                                    color="inherit"
                                />

                                {/* space name/members */}
                                <Box display="flex" flexDirection="row">
                                    <Typography
                                        variant="h3"
                                        fontWeight="600"
                                        sx={{
                                            margin: '8px 16px 2px 16px !important',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                            color: theme.palette.mode === 'dark' ? '#fff !important' : '#000 !important'
                                        }}
                                    >
                                        {data.space.name}
                                        {/* <Tooltip title="Verified Space" placement="right" arrow>
                                            <VerifiedIcon fontSize="inherit" />
                                        </Tooltip> */}
                                    </Typography>
                                </Box>

                                {data.space.members.length > 0 ? (
                                    <Typography
                                        variant="h4"
                                        fontSize="14px"
                                        fontWeight="500"
                                        color="primary"
                                        sx={{ marginBottom: '12px !important' }}
                                    >
                                        {abbreviateValue(data.space.members.length)} MEMBER(S)
                                    </Typography>
                                ) : (
                                    <Typography
                                        variant="h4"
                                        fontSize="14px"
                                        fontWeight="500"
                                        color="primary"
                                        sx={{ marginBottom: '12px !important' }}
                                    >
                                        NO MEMBERS
                                    </Typography>
                                )}

                                {/* space join */}
                                {data && data.space.members.includes(publicKey?.toBase58()) ? (
                                    <Box display="flex" flexDirection="row" alignItems="center" sx={{ gap: '8px', mb: 2 }}>
                                        <Button
                                            color="primary"
                                            variant="outlined"
                                            onClick={testNotification}
                                            onMouseOver={(e) => setHover(true)}
                                            onMouseOut={(e) => setHover(false)}
                                            sx={{
                                                backgroundColor: 'none !important',
                                                borderRadius: '23px',
                                                '&:hover': {
                                                    transition: 'all .1s ease-in-out',
                                                    border: '1px solid rgba(215, 0, 39, 0.5)',
                                                    color: theme.palette.secondary.main
                                                }
                                            }}
                                        >
                                            {hover ? 'Leave' : 'Joined'}
                                        </Button>
                                        <IconButton
                                            color="primary"
                                            size="small"
                                            onClick={handleNotification}
                                            sx={{
                                                border: '1px solid rgba(96, 109, 136, 0.5)',
                                                backgroundColor: 'none !important',
                                                borderRadius: '9999px'
                                            }}
                                        >
                                            <NotificationsIcon />
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <Button color="secondary" variant="outlined" sx={{ borderRadius: '23px' }}>
                                        Join
                                    </Button>
                                )}

                                {/* proposal creation / hrefs */}
                                <Box display="flex" flexDirection="column" justifyContent="flex-start" sx={{ width: '100%' }}>
                                    <Link href="#" sx={{ textDecoration: 'none' }}>
                                        <Typography variant="h5" fontWeight="500" color="primary" sx={{ pl: 2, pr: 2, pt: 1, pb: 1 }}>
                                            Proposals
                                        </Typography>
                                    </Link>
                                    <Link href="#" sx={{ textDecoration: 'none' }} onClick={CreateProposalLink}>
                                        <Typography variant="h5" fontWeight="500" color="primary" sx={{ pl: 2, pr: 2, pt: 1, pb: 1 }}>
                                            Create Proposal
                                        </Typography>
                                    </Link>
                                    <Link href="#" sx={{ textDecoration: 'none' }}>
                                        <Typography variant="h5" fontWeight="500" color="primary" sx={{ pl: 2, pr: 2, pt: 1, pb: 1 }}>
                                            About
                                        </Typography>
                                    </Link>
                                </Box>

                                {/* socials */}
                                <Box
                                    display="flex"
                                    flexDirection="row"
                                    justifyContent="center"
                                    sx={{
                                        margin: '16px 8px 16px 8px !important'
                                    }}
                                >
                                    <IconButton
                                        color="primary"
                                        size="small"
                                        sx={{
                                            backgroundColor: 'none !important',
                                            borderRadius: '9999px'
                                        }}
                                    >
                                        <TwitterIcon />
                                    </IconButton>
                                    <IconButton
                                        color="primary"
                                        size="small"
                                        disabled
                                        sx={{
                                            backgroundColor: 'none !important',
                                            borderRadius: '9999px'
                                        }}
                                    >
                                        <LanguageIcon />
                                    </IconButton>
                                    <IconButton
                                        color="primary"
                                        size="small"
                                        sx={{
                                            backgroundColor: 'none !important',
                                            borderRadius: '9999px'
                                        }}
                                    >
                                        <IconBrandDiscord />
                                    </IconButton>
                                </Box>
                            </Box>

                            {/* Dialog renders its body even if not open */}
                            <Dialog
                                maxWidth="sm"
                                fullWidth
                                onClose={handleModalClose}
                                open={isModalOpen}
                                sx={{ '& .MuiDialog-paper': { p: 0 } }}
                            >
                                {isModalOpen && (
                                    <AddProposalForm space={data.space} onCancel={handleModalClose} handleCreate={handleProposalCreate} />
                                )}
                            </Dialog>
                        </MainCard>
                    </Grid>
                    <Grid item sx={{ mb: 3 }}>
                        <Box
                            sx={{
                                float: 'right',
                                width: { xs: '100%', md: '100%', lg: '75%' },
                                paddingLeft: { xs: '0', md: '0', lg: '32px' }
                            }}
                        >
                            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ position: 'relative', mb: 2 }}>
                                <Typography variant="h2" fontWeight="600" color="primary">
                                    Proposals
                                </Typography>

                                <TextField
                                    id="standard-select-type"
                                    select
                                    value={value}
                                    size="medium"
                                    sx={{ width: 120, textAlign: 'left', ml: 2 }}
                                    onChange={(e) => setValue(e.target.value)}
                                >
                                    {status.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>

                            {loading
                                ? [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                                      <Grid key={item} item xs={12} sm={6} md={4} lg={3}>
                                          <SkeletonProductPlaceholder />
                                      </Grid>
                                  ))
                                : spaceProposals}
                        </Box>
                    </Grid>
                </>
            )}
        </>
    );
};

export default SpacePage;
