import { SyntheticEvent } from 'react';

// material ui
import { useTheme } from '@mui/material/styles';
import { Box, CardContent, Avatar, Typography, Button, Tooltip } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

// project imports
import SkeletonProductPlaceholder from 'components/cards/Skeleton/ProductPlaceholder';
import MainCard from 'components/MainCard';
import { useToasts } from 'hooks/useToasts';
import { useAccess } from 'hooks/useAccess';
import { abbreviateValue } from 'utils/utils';

// web3
import { useWallet } from '@solana/wallet-adapter-react';

// graphql
import { useQuery, useMutation } from '@apollo/client';
import { mutations, queries } from '../../graphql/graphql';

// assets
import StarIcon from '@mui/icons-material/Star';

// types
import { KeyedObject } from 'types';

// constants
const MAX_LENGTH = 17;

interface SpaceCardProps extends KeyedObject {
    space: any;
}

const SpaceCard = ({ space }: SpaceCardProps) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { checkAccess } = useAccess();
    const { showInfoToast, showErrorToast } = useToasts();
    const { publicKey } = useWallet();

    const { id, symbol, avatar, name } = space;

    const { data, loading } = useQuery(queries.GET_SPACE, { variables: { symbol }, fetchPolicy: 'cache-and-network' });
    const [JoinSpace] = useMutation(mutations.JOIN_SPACE);

    // CHECK ACCESS FROM CREATOR WALLET
    const joinSpace = async (event: SyntheticEvent) => {
        event.preventDefault();
        if (publicKey) {
            const hasAccess = await checkAccess(publicKey, data.space.creatorWallet);
            if (hasAccess) {
                const wallet = publicKey.toBase58();
                JoinSpace({
                    variables: { _id: id, member: wallet }
                }).then(
                    (res) => {
                        console.log(res);
                    },
                    (err) => {
                        console.log(err);
                    }
                );
                showInfoToast(`You have joined the ${name} DAO.`);
                navigate(`/spaces/${symbol}`, { replace: true });
            } else {
                showErrorToast('You do not have access to join this DAO Space.');
            }
        }
    };

    const viewSpace = async () => {
        if (publicKey) {
            const hasAccess = await checkAccess(publicKey, data.space.creatorWallet);
            if (hasAccess) {
                navigate(`/spaces/${symbol}`, { replace: true });
            } else {
                showErrorToast('You do not have access to view this space.');
            }
        }
    };

    return (
        <>
            {!data && loading ? (
                <SkeletonProductPlaceholder />
            ) : (
                <MainCard
                    content={false}
                    boxShadow
                    sx={{
                        color: theme.palette.primary.light,
                        '&:hover': {
                            cursor: 'pointer',
                            transform: 'scale3d(1.03, 1.03, 1)',
                            transition: '.15s'
                        }
                    }}
                    onClick={viewSpace}
                >
                    <CardContent sx={{ p: '24px !important', justifyContent: 'center' }}>
                        {/* partnered project star */}
                        {data && data.space.isPartnered && (
                            <Tooltip title="Partnered Project" placement="top" arrow>
                                <StarIcon color="warning" />
                            </Tooltip>
                        )}

                        {/* space avatar */}
                        <Box display="flex" justifyContent="center">
                            <Avatar
                                src={avatar}
                                sx={{
                                    marginBottom: '8px !important',
                                    width: '82px !important',
                                    height: '82px !important'
                                }}
                                color="inherit"
                            />
                        </Box>

                        {/* space name */}
                        <Box display="flex" justifyContent="center">
                            {name.length > MAX_LENGTH ? (
                                <Tooltip title={name} arrow>
                                    <Typography
                                        variant="h4"
                                        fontWeight="600"
                                        color="inherit"
                                        sx={{ display: 'block', marginBottom: '5px !important' }}
                                    >
                                        {`${name.substring(0, MAX_LENGTH)}...`}
                                    </Typography>
                                </Tooltip>
                            ) : (
                                <Typography
                                    variant="h4"
                                    fontWeight="600"
                                    color="inherit"
                                    sx={{ display: 'block', marginBottom: '5px !important' }}
                                >
                                    {name}
                                </Typography>
                            )}
                        </Box>

                        {/* space members */}
                        <Box display="flex" justifyContent="center">
                            {data && data.space.members.length > 0 ? (
                                <Typography
                                    variant="subtitle1"
                                    color="primary"
                                    sx={{ lineHeight: '24px', display: 'block', marginBottom: '12px !important' }}
                                >
                                    {abbreviateValue(data.space.members.length)} MEMBER(S)
                                </Typography>
                            ) : (
                                <Typography
                                    variant="subtitle1"
                                    color="primary"
                                    sx={{ lineHeight: '24px', display: 'block', marginBottom: '12px !important' }}
                                >
                                    NO MEMBERS
                                </Typography>
                            )}
                        </Box>

                        {/* space join */}
                        <Box display="flex" justifyContent="center">
                            {data && data.space.members.includes(publicKey?.toBase58()) ? (
                                <Button color="secondary" variant="outlined" sx={{ borderRadius: '23px' }} disabled>
                                    Joined
                                </Button>
                            ) : (
                                <Button color="secondary" variant="outlined" sx={{ borderRadius: '23px' }} onClick={joinSpace}>
                                    Join
                                </Button>
                            )}
                        </Box>
                    </CardContent>
                </MainCard>
            )}
        </>
    );
};

export default SpaceCard;
