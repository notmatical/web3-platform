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

const TopSaleCard = ({ avatar, name, profile, role, status }: UserProfileCardProps) => {
    const theme = useTheme();

    return (
        <Card
            sx={{
                border: '1px solid rgba(213, 217, 233, 0.2)',
                textAlign: 'center'
            }}
        >
            <CardMedia
                component="img"
                image="https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://bafybeiaoqy6v4wmoytgngamfmbmp72uio6ddokifrko2umjps4yrixl6ye.ipfs.dweb.link/5474.jpg?ext=jpg"
                title="Slider5 image"
                sx={{ height: '175px' }}
            />
        </Card>
    );
};

export default TopSaleCard;
