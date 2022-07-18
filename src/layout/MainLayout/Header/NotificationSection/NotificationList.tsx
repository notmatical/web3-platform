// material-ui
import { useTheme, styled } from '@mui/material/styles';
import {
    Avatar,
    Button,
    Chip,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Typography
} from '@mui/material';

// assets
import { IconGlobe, IconPlanet, IconTrendingUp } from '@tabler/icons';

// styles
const ListItemWrapper = styled('div')(({ theme }) => ({
    cursor: 'pointer',
    padding: 16,
    '&:hover': {
        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light
    },
    '& .MuiListItem-root': {
        padding: 0
    }
}));

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

const NotificationList = () => {
    const theme = useTheme();

    const chipSX = {
        height: 24,
        padding: '0 6px'
    };

    const chipErrorSX = {
        ...chipSX,
        color: theme.palette.orange.dark,
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.orange.light,
        marginRight: '5px'
    };

    return (
        <List
            sx={{
                width: '100%',
                maxWidth: 330,
                py: 0,
                borderRadius: '10px',
                [theme.breakpoints.down('md')]: {
                    maxWidth: 300
                },
                '& .MuiListItemSecondaryAction-root': {
                    top: 22
                },
                '& .MuiDivider-root': {
                    my: 0
                },
                '& .list-container': {
                    pl: 7
                }
            }}
        >
            <ListItemWrapper>
                <ListItem alignItems="center">
                    <ListItemAvatar>
                        <Avatar
                            sx={{
                                color: theme.palette.secondary.dark,
                                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
                                border: theme.palette.mode === 'dark' ? '1px solid' : 'none',
                                borderColor: theme.palette.secondary.dark
                            }}
                        >
                            <IconPlanet stroke={1.5} size="1.3rem" />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={<Typography variant="subtitle1">Astronaut #1924</Typography>} />
                    <ListItemSecondaryAction>
                        <Grid container justifyContent="flex-end">
                            <Grid item xs={12}>
                                <Typography variant="caption" display="block" gutterBottom>
                                    6 min ago
                                </Typography>
                            </Grid>
                        </Grid>
                    </ListItemSecondaryAction>
                </ListItem>
                <Grid container direction="column" className="list-container">
                    <Grid item xs={12} sx={{ pb: 2 }}>
                        <Typography variant="subtitle2">
                            Your staking lockup period is now finished, you can now withdraw your NFT.
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item>
                                <Chip label="Unread" sx={chipErrorSX} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </ListItemWrapper>

            <Divider />

            <ListItemWrapper>
                <ListItem alignItems="center">
                    <ListItemAvatar>
                        <Avatar
                            sx={{
                                color: theme.palette.success.dark,
                                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
                                border: theme.palette.mode === 'dark' ? '1px solid' : 'none',
                                borderColor: theme.palette.success.main
                            }}
                        >
                            <IconTrendingUp stroke={1.5} size="1.3rem" />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={<Typography variant="subtitle1">Volume Change</Typography>} />
                    <ListItemSecondaryAction>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Typography variant="caption" display="block" gutterBottom>
                                    12 mins ago
                                </Typography>
                            </Grid>
                        </Grid>
                    </ListItemSecondaryAction>
                </ListItem>
                <Grid container direction="column" className="list-container">
                    <Grid item xs={12} sx={{ pb: 2 }}>
                        <Typography variant="subtitle2">Cosmic Astronauts volume has been increased by 22%</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item>
                                <Button
                                    color="secondary"
                                    variant="contained"
                                    disableElevation
                                    startIcon={<IconGlobe stroke={1.5} size="1.3rem" />}
                                >
                                    View Collection
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </ListItemWrapper>
        </List>
    );
};

export default NotificationList;
