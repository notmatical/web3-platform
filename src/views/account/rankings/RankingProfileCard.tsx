import { useEffect, useState, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Stack, Box, Avatar, Typography, Button } from '@mui/material';

// web3 import
import { useWallet } from '@solana/wallet-adapter-react';
import { useToasts } from 'hooks/useToasts';

// assets
import DefaultUser from 'assets/images/users/user-image.jpg';
import { IconUserPlus, IconCircleCheck } from '@tabler/icons';

// graphql
import { useMutation } from '@apollo/client';
import * as db from 'database/graphql/graphql';
import { shortenAddress } from 'utils/utils';

interface RankingProfileProps {
    position: number;
    user: any;
}

const RankingProfileCard = ({ position, user }: RankingProfileProps) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { showInfoToast } = useToasts();
    const { publicKey } = useWallet();

    const [follow] = useMutation(db.mutations.FOLLOW_USER);
    const [unfollow] = useMutation(db.mutations.UNFOLLOW_USER);

    const handleFollow = async () => {
        follow({
            variables: { userAddress: publicKey?.toBase58(), userAddressToFollow: user.user.wallet }
        }).then(
            (res) => {
                if (res.data.follow === null) return;
                showInfoToast(`You have followed ${user.user.vanity ? user.user.vanity : shortenAddress(user.user.wallet)}`);
            },
            (err) => {
                console.log(err);
            }
        );
    };

    const handleUnfollow = async () => {
        unfollow({
            variables: { userAddress: publicKey?.toBase58(), userAddressToUnfollow: user.user.wallet }
        }).then(
            (res) => {
                if (res.data.unfollow === null) return;
                showInfoToast(`You have unfollowed ${user.user.vanity ? user.user.vanity : shortenAddress(user.user.wallet)}`);
            },
            (err) => {
                console.log(err);
            }
        );
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ width: '100%' }}>
            <Box display="flex" sx={{ mr: 2 }}>
                <Typography noWrap variant="h5" fontWeight="800">
                    {position + 1}
                </Typography>
            </Box>
            <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
                <Avatar
                    src={user.user.avatarURI ? user.user.avatarURI : DefaultUser}
                    color="inherit"
                    onClick={() => navigate(`/profile/${user.user.wallet}`, { replace: true })}
                    sx={{
                        ...theme.typography.mediumAvatar,
                        '&:hover': {
                            cursor: 'pointer'
                        }
                    }}
                />
                <Stack>
                    <Typography
                        variant="h6"
                        fontWeight="800"
                        onClick={() => navigate(`/profile/${user.user.wallet}`, { replace: true })}
                        sx={{
                            ml: 1,
                            '&:hover': {
                                cursor: 'pointer'
                            }
                        }}
                    >
                        {user.user.vanity ? user.user.vanity : shortenAddress(user.user.wallet, 5)}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ ml: 1 }}>
                        {user.followersCount} followers
                    </Typography>
                </Stack>
            </Box>
            <Button
                variant="outlined"
                size="small"
                color="inherit"
                endIcon={<IconCircleCheck size="0.975rem" />}
                sx={{ fontWeight: 800, borderRadius: 8, borderColor: theme.palette.primary.main }}
            >
                Following
            </Button>
            <Button
                variant="outlined"
                size="small"
                color="inherit"
                endIcon={<IconUserPlus size="0.975rem" />}
                sx={{ fontWeight: 800, borderRadius: 8, borderColor: theme.palette.primary.main }}
            >
                Follow
            </Button>
        </Box>
    );
};

export default RankingProfileCard;
