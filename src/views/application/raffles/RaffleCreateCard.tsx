import Image from 'mui-image';
import { Button, CardActions, CardContent, CardMedia, Grid, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Loading from 'components/Loading';
import { FormattedMessage } from 'react-intl';
import MainCard from 'components/MainCard';

export default function RaffleCreateCard(props: { image: string; name: string; mint: string }) {
    const navigate = useNavigate();
    const theme = useTheme();
    const { image, name, mint } = props;

    return (
        <Grid item xs={6} md={4} lg={3} xl={2}>
            <MainCard
                content={false}
                boxShadow
                sx={{
                    background: theme.palette.mode === 'dark' ? '#09080d' : theme.palette.primary.light,
                    '&:hover': {
                        transform: 'scale3d(1.03, 1.03, 1)',
                        transition: '.15s'
                    }
                }}
            >
                <CardMedia sx={{ minHeight: 220, alignItems: 'center', display: 'flex' }}>
                    <Image src={image} alt={name} showLoading={<Loading />} />
                </CardMedia>
                <CardContent sx={{ p: 1 }}>
                    <Typography noWrap component="p">
                        {name}
                    </Typography>
                </CardContent>
                <CardActions sx={{ p: 1 }}>
                    <Button
                        color="secondary"
                        variant="contained"
                        sx={{ width: '100%' }}
                        onClick={() => navigate(`/raffles/new/${mint}`, { replace: true })}
                    >
                        <FormattedMessage id="create-raffle" />
                    </Button>
                </CardActions>
            </MainCard>
        </Grid>
    );
}
