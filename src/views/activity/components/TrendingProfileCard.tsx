// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Button, Card, CardContent, CardMedia, Box, Grid, Typography } from '@mui/material';

// project imports
import Avatar from 'components/@extended/Avatar';
import { gridSpacing } from 'store/constant';

// assets
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';

// ==============================|| USER PROFILE CARD ||============================== //

interface UserProfileCardProps {
    avatar?: string;
    name?: string;
    profile?: string;
    role?: string;
    status?: string;
}

const UserProfileCard = ({ avatar, name, profile, role, status }: UserProfileCardProps) => {
    const theme = useTheme();

    return (
        <Card
            sx={{
                border: '1px solid rgba(213, 217, 233, 0.2)',
                textAlign: 'center'
            }}
        >
            <CardMedia component="img" image="https://i.imgur.com/O76a9hz.png" title="Slider5 image" sx={{ height: '80px' }} />
            <CardContent sx={{ p: '8px !important' }}>
                <Grid item xs={12}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Avatar
                                alt="matty"
                                src="https://arweave.net/imVWai0XEMWqZk-e6HWwHvC7AkkWTwZnz4AYnhMXuWI"
                                sx={{ borderRadius: '8px', width: 72, height: 72, m: '-50px auto 0' }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} alignItems="center" sx={{ pt: '8px !important' }}>
                    <Typography variant="h4">matical.sol</Typography>
                </Grid>
                <Box display="flex" flexWrap="wrap" justifyContent="space-between" sx={{ mt: 1 }}>
                    <Typography variant="subtitle2" color="primary" sx={{ display: 'block' }}>
                        NFTs Collected
                    </Typography>
                    <Typography variant="subtitle2" color="inherit" sx={{ display: 'block' }}>
                        28
                    </Typography>
                </Box>
                <Box display="flex" flexWrap="wrap" justifyContent="space-between">
                    <Typography variant="subtitle2" color="primary" sx={{ display: 'block' }}>
                        Approx. Value
                    </Typography>
                    <Typography variant="subtitle2" color="inherit" sx={{ display: 'block' }}>
                        428 SOL
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default UserProfileCard;
