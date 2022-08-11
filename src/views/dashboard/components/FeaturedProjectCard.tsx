import { useCallback } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Grid, Card, CardContent, Box, Typography, Button, Divider, CardMedia } from '@mui/material';

// web3 imports
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';

// project imports
import { explorerLinkFor } from 'utils/transactions';
import { useDispatch } from 'store';
import Chip from 'components/@extended/Chip';
import SkeletonFloorPriceCard from 'components/cards/Skeleton/TotalAmountCard';

// assets
import Avatar1 from 'assets/images/icons/cosmic-token.png';
import TwitterIcon from '@mui/icons-material/Twitter';
import LanguageIcon from '@mui/icons-material/Language';
import { IconBrandDiscord } from '@tabler/icons';

// styles
const TwitterWrapper = styled(Button)({
    padding: 8,
    background: 'rgba(29, 161, 242, 0.2)',
    '& svg': {
        color: '#1DA1F2'
    },
    '&:hover': {
        background: '#1DA1F2',
        '& svg': {
            color: '#fff'
        }
    }
});

const WebsiteWrapper = styled(Button)({
    padding: 8,
    background: 'rgba(179, 64, 72, 0.2)',
    '& svg': {
        color: '#b34048'
    },
    '&:hover': {
        background: '#b34048',
        '& svg': {
            color: '#fff'
        }
    }
});

const DiscordWrapper = styled(Button)({
    padding: 8,
    background: 'rgba(88, 101, 242, 0.12)',
    '& svg': {
        color: '#5865F2'
    },
    '&:hover': {
        background: '#5865F2',
        '& svg': {
            color: '#fff'
        }
    }
});

// types
interface FeaturedProjectCardProps {
    isLoading: boolean;
}

const FeaturedProjectCard = ({ isLoading }: FeaturedProjectCardProps) => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const onClick = useCallback(async () => {
        if (!publicKey) throw new WalletNotConnectedError();

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: Keypair.generate().publicKey,
                lamports: 10000000
            })
        );

        const signature = await sendTransaction(transaction, connection);
        await connection.confirmTransaction(signature, 'processed');

        console.log(explorerLinkFor(signature, connection));
    }, [publicKey, dispatch, sendTransaction, connection]);

    return (
        <>
            {isLoading ? (
                <SkeletonFloorPriceCard />
            ) : (
                <Card sx={{ p: 0, width: '100%' }}>
                    <CardMedia sx={{ height: 275 }} image={Avatar1} title="Featured" />
                    <CardContent sx={{ p: '12px !important' }}>
                        <Box alignItems="center">
                            <Typography
                                fontWeight="800"
                                color="secondary"
                                sx={{
                                    fontSize: '1.175rem',
                                    display: 'block',
                                    textDecoration: 'none',
                                    mb: '8px'
                                }}
                            >
                                Featured Project Here
                            </Typography>
                        </Box>

                        {/* Project Information */}
                        <Grid item xs={12} sx={{ mb: '10px' }}>
                            <Chip label="DOXXED" size="small" chipcolor="primary" sx={{ mr: '5px' }} />
                            <Chip label="SUPPLY: 3,333" size="small" chipcolor="primary" sx={{ mr: '5px' }} />
                            <Chip label="PRICE: 1.5 ◎" size="small" chipcolor="primary" sx={{ mr: '5px' }} />
                        </Grid>

                        <Divider sx={{ mb: '10px' }} />

                        {/* Description */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ mb: '10px', color: theme.palette.grey[700] }}>
                                Blank is a 3,333 deflationary collection built on Solana, with major toolings being built to aide investors.
                                Earn $COSMIC from staking to obtain WL opportunities and exclusive giveaways.
                            </Typography>
                        </Grid>

                        {/* Project Buttons */}
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <TwitterWrapper fullWidth>
                                        <TwitterIcon />
                                    </TwitterWrapper>
                                </Grid>
                                <Grid item xs={4}>
                                    <WebsiteWrapper fullWidth>
                                        <LanguageIcon />
                                    </WebsiteWrapper>
                                </Grid>
                                <Grid item xs={4}>
                                    <DiscordWrapper fullWidth>
                                        <IconBrandDiscord />
                                    </DiscordWrapper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}
        </>
    );
};

export default FeaturedProjectCard;
