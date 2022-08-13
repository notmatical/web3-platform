import { ReactElement, useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/styles';
import {
    Button,
    Avatar,
    Stack,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    Box,
    Typography,
    IconButton,
    CircularProgress,
    CardMedia
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// project imports
import { useToasts } from 'hooks/useToasts';

// assets
import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

// graphql
import { useMutation } from '@apollo/client';
import * as db from 'database/graphql/graphql';
import MainCard from 'components/MainCard';

// types
interface UpdateAvatarModalProps {
    user: any;
    nfts: any;
    onCancel: () => void;
    onFinish: () => void;
}

const UpdateAvatarModal = ({ user, nfts, onCancel, onFinish }: UpdateAvatarModalProps) => {
    const theme = useTheme();
    const { showInfoToast, showErrorToast } = useToasts();

    const [isLoading, setIsLoading] = useState(true);
    const [isSelected, setIsSelected] = useState(false);
    const [avatar, setAvatar] = useState<string>('');

    const [update] = useMutation(db.mutations.UPDATE_AVATAR);

    const chooseAvatar = (image: string) => {
        setIsSelected(true);
        setAvatar(image);
    };

    const updateAvatar = async () => {
        if (!user) return;
        if (!isSelected && avatar === '') {
            setIsSelected(false);
            return;
        }

        update({ variables: { wallet: user.wallet, avatar } }).then(
            (res) => {
                showInfoToast('You have updated your profile avatar.');
                onFinish();
            },
            (err) => {
                showErrorToast('There was an error while updating your avatar, please try again.');
            }
        );
    };

    console.log(nfts);

    let nftResult: ReactElement | ReactElement[] = <></>;
    if (nfts && nfts.length !== 0) {
        nftResult = nfts.map((nft: any, index: number) => (
            <Grid key={index} item xs={4}>
                <MainCard content={false} border={false} boxShadow onClick={() => setAvatar(nft.image)}>
                    {avatar === nft.image && (
                        <CheckCircleIcon sx={{ color: theme.palette.secondary.main, position: 'absolute', right: '8px', top: '8px' }} />
                    )}
                    <CardMedia
                        image={nft.image}
                        sx={{
                            borderRadius: '8px',
                            border: avatar === nft.image ? '1px solid' : 'none',
                            borderWidth: 4,
                            borderColor: theme.palette.secondary.dark,
                            display: 'block',
                            cursor: 'pointer',
                            width: 'auto',
                            height: { xs: 72, sm: 72, md: 120 }
                        }}
                    />
                </MainCard>
            </Grid>
        ));
    } else {
        nftResult = (
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
                        No NFTs found.
                    </Typography>
                </Stack>
            </Box>
        );
    }

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2500);
    }, []);

    return (
        <>
            <DialogTitle sx={{ m: 0, p: 2 }}>
                Update Avatar
                <IconButton
                    aria-label="cloe"
                    onClick={onCancel}
                    sx={{
                        position: 'absolute',
                        right: 12,
                        top: 12,
                        color: theme.palette.grey[500]
                    }}
                >
                    <CloseCircleOutlined />
                </IconButton>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 3 }}>
                {isLoading ? (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        sx={{ borderRadius: 3, padding: 4, border: '1px solid rgba(213, 217, 233, 0.2)' }}
                    >
                        <Stack alignItems="center">
                            <CircularProgress color="secondary" />
                        </Stack>
                    </Box>
                ) : (
                    <Grid container spacing={1}>
                        {nftResult}
                    </Grid>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Button
                        sx={{ borderRadius: 3 }}
                        variant="contained"
                        color="secondary"
                        fullWidth
                        disabled={!avatar}
                        onClick={updateAvatar}
                    >
                        Save
                    </Button>
                </Grid>
            </DialogActions>
        </>
    );
};

export default UpdateAvatarModal;
