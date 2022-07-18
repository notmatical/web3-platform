// material-ui
import { styled } from '@mui/material/styles';
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, Stack, Avatar, Typography } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import SupplyStat from './SupplyStat';
import PriceStat from './PriceStat';

// assets
import DeleteIcon from '@mui/icons-material/Delete';
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

// ==============================|| CALENDAR EVENT ADD / EDIT / DELETE ||============================== //

interface AddDropFormProps {
    drop: any;
    onCancel: () => void;
}

const ViewDropModal = ({ drop, onCancel }: AddDropFormProps) => (
    <>
        {drop.time ? (
            <DialogTitle>
                {drop.name} ({drop.time})
            </DialogTitle>
        ) : (
            <DialogTitle>{drop.name}</DialogTitle>
        )}
        <Divider />
        <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={gridSpacing}>
                {/* Collection Image */}
                <Grid item xs={4}>
                    <Avatar
                        alt={drop.name}
                        src={drop.image}
                        sx={{
                            borderRadius: '16px',
                            width: { xs: 72, sm: 100, md: 172 },
                            height: { xs: 72, sm: 100, md: 172 }
                        }}
                    />
                </Grid>

                {/* Stats */}
                <Grid item xs={8}>
                    <SupplyStat value={drop.nft_count} />
                    <PriceStat value={drop.price} />
                </Grid>
                {/* <Grid item xs={4}>
                    <PriceStat value={drop.price} />
                </Grid> */}
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="body2">{drop.extra}</Typography>
            </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
            <Grid container justifyContent="center" alignItems="center">
                <Grid item>
                    <Stack direction="row" spacing={2} alignItems="center">
                        {drop.twitter && (
                            <a href={drop.twitter} target="_blank" rel="noreferrer">
                                <TwitterWrapper fullWidth>
                                    <TwitterIcon />
                                </TwitterWrapper>
                            </a>
                        )}
                        {drop.website && (
                            <a href={drop.website} target="_blank" rel="noreferrer">
                                <WebsiteWrapper fullWidth>
                                    <LanguageIcon />
                                </WebsiteWrapper>
                            </a>
                        )}
                        {drop.discord && (
                            <a href={drop.discord} target="_blank" rel="noreferrer">
                                <DiscordWrapper fullWidth>
                                    <IconBrandDiscord />
                                </DiscordWrapper>
                            </a>
                        )}
                    </Stack>
                </Grid>
            </Grid>
        </DialogActions>
    </>
);

export default ViewDropModal;
