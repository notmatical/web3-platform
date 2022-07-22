import { Link } from 'react-router-dom';

// material ui
import { useTheme } from '@mui/material/styles';
import { Box, CardContent, Chip, Typography, Stack, Avatar, Tooltip } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

// project imports
import SkeletonProductPlaceholder from 'components/cards/Skeleton/ProductPlaceholder';
import MainCard from 'components/cards/MainCard';
import UserLink from 'components/UserLink';
import { shortenAddress, abbreviateValue } from 'utils/utils';

// third party
import moment from 'moment';

// types
import { KeyedObject } from 'types';

// constants
const MAX_LENGTH = 310;

interface ProposalCardProps extends KeyedObject {
    space: any;
    proposal: any;
    image: string | null;
}

const ProposalCard = ({ space, proposal, image, loading }: ProposalCardProps) => {
    const theme = useTheme();

    return (
        <>
            {loading ? (
                <SkeletonProductPlaceholder />
            ) : (
                <Link
                    to={{
                        pathname: `/spaces/${space.symbol}/proposal/${proposal.id}`
                    }}
                    style={{ textDecoration: 'none' }}
                >
                    <MainCard
                        content={false}
                        sx={{
                            background: 'none !important',
                            color: theme.palette.primary.light,
                            borderColor: 'rgba(213, 217, 233, 0.2)',
                            mb: 2,
                            '&:hover': {
                                transform: 'scale3d(1.02, 1.02, 1)',
                                transition: 'all .4s ease-in-out'
                            }
                        }}
                    >
                        <CardContent sx={{ p: '16px !important' }}>
                            <Box display="flex" alignItems="center">
                                <Stack direction="row" justifyContent="space-around" alignItems="center" sx={{ mr: 'auto' }}>
                                    <Avatar
                                        src={space.avatar}
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
                                        {space.name} by
                                        <UserLink user={proposal.author} />
                                    </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="flex-end" spacing={1}>
                                    {/* {proposal.type ? ( */}
                                    <Tooltip title="Proposed by the Core Team" arrow>
                                        <Chip
                                            color="info"
                                            size="small"
                                            label={<span>Core</span>}
                                            icon={<CheckCircle fontSize="small" />}
                                            sx={{ borderRadius: '40px !important' }}
                                        />
                                    </Tooltip>
                                    {/* ) : (
                                    //     <Chip
                                    //         color="secondary"
                                    //         size="small"
                                    //         label={<span>Community</span>}
                                    //         sx={{ borderRadius: '40px !important' }}
                                    //     />
                                    // )} */}
                                    <Chip
                                        size="small"
                                        color={proposal.state ? 'success' : 'primary'}
                                        label={<span>{proposal.state ? 'Active' : 'Closed'}</span>}
                                        sx={{ borderRadius: '40px !important' }}
                                    />
                                </Stack>
                            </Box>

                            {/* name */}
                            <Box display="flex" alignItems="center" sx={{ my: 1 }}>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        display: 'block',
                                        textDecoration: 'none',
                                        color: theme.palette.mode === 'dark' ? '#FFF' : '#000'
                                    }}
                                >
                                    {proposal.title}
                                </Typography>
                            </Box>

                            {/* creation date */}
                            {/* <Box display="flex" alignItems="center">
                                <Typography color="inherit" sx={{ display: 'block', textDecoration: 'none', mr: 'auto' }}>
                                    {moment(proposal.createdAt).format('MMMM DD, yyyy')}
                                </Typography>
                            </Box> */}

                            {/* Description */}
                            <Box display="flex" alignItems="center">
                                {proposal.body.length > MAX_LENGTH ? (
                                    <Typography
                                        variant="subtitle1"
                                        color="primary"
                                        sx={{ display: 'block', textDecoration: 'none', mr: 'auto' }}
                                    >
                                        {`${proposal.body.substring(0, MAX_LENGTH)}...`}
                                    </Typography>
                                ) : (
                                    <Typography
                                        variant="subtitle1"
                                        color="primary"
                                        sx={{ display: 'block', textDecoration: 'none', mr: 'auto' }}
                                    >
                                        {proposal.body}
                                    </Typography>
                                )}
                            </Box>

                            {/* Space Footer */}
                            <Stack direction="row" justifyContent="flex-start" alignItems="center" sx={{ mr: 'auto', mt: 2 }}>
                                {/* <Typography variant="subtitle1" color="primary" sx={{ ml: 1, display: 'block', textDecoration: 'none' }}>
                                    Ends {moment(proposal.endsAt).fromNow()} &bull; {moment(proposal.endsAt).format('MMM DD, yyyy, h:mm A')}
                                </Typography> */}
                                <CheckCircle fontSize="small" sx={{ color: theme.palette.success.main }} />
                                <Typography variant="subtitle1" color="primary" sx={{ ml: 1, display: 'block', textDecoration: 'none' }}>
                                    Accept Changes - {abbreviateValue(proposal.forVotes.length)} {space.symbol}
                                </Typography>
                            </Stack>
                        </CardContent>
                    </MainCard>
                </Link>
            )}
        </>
    );
};

export default ProposalCard;
