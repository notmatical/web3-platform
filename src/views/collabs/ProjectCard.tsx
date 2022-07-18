// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Grid, CardContent, CardMedia, Typography, Button, Divider, Link } from '@mui/material';

// project imports
import { KeyedObject } from 'types';
import SkeletonProductPlaceholder from 'components/cards/Skeleton/ProductPlaceholder';
import MainCard from 'components/MainCard';
import Disabled from 'components/Disabled';
import Enabled from 'components/Enabled';

// assets
import TwitterIcon from '@mui/icons-material/Twitter';
import { IconBrandDiscord } from '@tabler/icons';
import { displayGuildIcon } from 'utils/discord';

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
interface CollabCardProps extends KeyedObject {
    project: any;
    submitRequest: Function;
}

const ProjectCard = ({ project, loading, submitRequest }: CollabCardProps) => {
    const theme = useTheme();

    return (
        <>
            {loading ? (
                <SkeletonProductPlaceholder />
            ) : (
                <MainCard
                    content={false}
                    boxShadow
                    sx={{
                        color: theme.palette.primary.light,
                        padding: '1.25rem',
                        '&:hover': {
                            transform: 'scale3d(1.03, 1.03, 1)',
                            transition: '.15s'
                        }
                    }}
                >
                    <CardMedia
                        sx={{ height: 160, borderRadius: 2 }}
                        image={displayGuildIcon(project.guildId, project.iconHash)}
                        title="Guild Icon"
                    />
                    <CardContent sx={{ p: '0 !important', justifyContent: 'center' }}>
                        {/* project name / description */}
                        <Box display="flex" flexWrap="wrap" flexDirection="column" alignItems="center" sx={{ mt: 2, mb: 2 }}>
                            <Typography variant="h4" fontWeight="600" color="inherit" sx={{ display: 'block' }}>
                                {project.name}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="primary"
                                sx={{ lineHeight: '24px', display: 'block', textAlign: 'center' }}
                            >
                                {project.description}
                            </Typography>
                        </Box>

                        <Divider />

                        <Box display="flex" flexWrap="wrap" justifyContent="space-between" sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" color="inherit" sx={{ display: 'block' }}>
                                Project Status
                            </Typography>
                            {project.isPostMint ? (
                                <Box display="flex" flexDirection="row" alignItems="center">
                                    <Typography variant="subtitle2" color="inherit" sx={{ display: 'block', paddingLeft: 0.5 }}>
                                        Post Mint
                                    </Typography>
                                </Box>
                            ) : (
                                <Box display="flex" flexDirection="row" alignItems="center">
                                    <Typography variant="subtitle2" color="inherit" sx={{ display: 'block', paddingLeft: 0.5 }}>
                                        Pre Mint
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        <Box display="flex" flexWrap="wrap" justifyContent="space-between" sx={{ mt: 1 }}>
                            <Typography variant="subtitle2" color="inherit" sx={{ display: 'block' }}>
                                Collabs
                            </Typography>
                            {project.isActive ? (
                                <Box display="flex" flexDirection="row" alignItems="center">
                                    <Enabled />
                                    <Typography variant="subtitle2" color="inherit" sx={{ display: 'block', paddingLeft: 0.5 }}>
                                        Open
                                    </Typography>
                                </Box>
                            ) : (
                                <Box display="flex" flexDirection="row" alignItems="center">
                                    <Disabled />
                                    <Typography variant="subtitle2" color="inherit" sx={{ display: 'block', paddingLeft: 0.5 }}>
                                        Closed
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        <Box display="flex" flexWrap="wrap" justifyContent="space-between" sx={{ mt: 1 }}>
                            <Typography variant="subtitle2" color="inherit" sx={{ display: 'block' }}>
                                Available Spots
                            </Typography>
                            <Typography variant="subtitle2" color="inherit" sx={{ display: 'block' }}>
                                {project.spots ? `${project.spots}` : 'N/A'}
                            </Typography>
                        </Box>

                        <Box display="flex" flexWrap="wrap" justifyContent="space-between" sx={{ mt: 1 }}>
                            <Typography variant="subtitle2" color="inherit" sx={{ display: 'block' }}>
                                Request Price
                            </Typography>
                            <Typography variant="subtitle2" color="inherit" sx={{ display: 'block' }}>
                                {project.price ? `${project.price} SOL` : 'FREE'}
                            </Typography>
                        </Box>

                        {!project.isPostMint && (
                            <>
                                <Box display="flex" flexWrap="wrap" justifyContent="space-between" sx={{ mt: 1 }}>
                                    <Typography variant="subtitle2" color="inherit" sx={{ display: 'block' }}>
                                        Mint Date
                                    </Typography>
                                    <Typography variant="subtitle2" color="inherit" sx={{ display: 'block' }}>
                                        {project.mintDate ? `${project.mintDate}` : 'TBD'}
                                    </Typography>
                                </Box>

                                <Box display="flex" flexWrap="wrap" justifyContent="space-between" sx={{ mt: 1 }}>
                                    <Typography variant="subtitle2" color="inherit" sx={{ display: 'block' }}>
                                        Mint Price
                                    </Typography>
                                    <Typography variant="subtitle2" color="inherit" sx={{ display: 'block' }}>
                                        {project.mintPrice ? `${project.mintPrice} SOL` : 'TBD'}
                                    </Typography>
                                </Box>

                                <Box display="flex" flexWrap="wrap" justifyContent="space-between" sx={{ mt: 1 }}>
                                    <Typography variant="subtitle2" color="inherit" sx={{ display: 'block' }}>
                                        Supply
                                    </Typography>
                                    <Typography variant="subtitle2" color="inherit" sx={{ display: 'block' }}>
                                        {project.mintSupply ? `${project.mintSupply}` : 'TBD'}
                                    </Typography>
                                </Box>
                            </>
                        )}

                        <Box display="flex" flexWrap="wrap" justifyContent="center" sx={{ mt: 1 }}>
                            <Typography variant="subtitle2" color="primary" sx={{ display: 'block' }}>
                                {project.collabs.length === 0 ? 'No Pending Requests' : `${project.collabs.length} Pending Requests`}
                            </Typography>
                        </Box>

                        {/* submit request */}
                        <Box display="flex" flexWrap="wrap" justifyContent="center" sx={{ ml: 1, mr: 1, mt: 1 }}>
                            {project.isActive ? (
                                <Button disableElevation color="secondary" variant="contained" fullWidth onClick={() => submitRequest}>
                                    Submit Request
                                </Button>
                            ) : (
                                <Button disableElevation color="secondary" variant="contained" fullWidth disabled>
                                    Submit Request
                                </Button>
                            )}
                        </Box>

                        <Divider sx={{ mt: 2, mb: 2 }} />

                        {/* project socials */}
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    {project.twitter ? (
                                        <Link href={project.twitter}>
                                            <TwitterWrapper fullWidth>
                                                <TwitterIcon />
                                            </TwitterWrapper>
                                        </Link>
                                    ) : (
                                        <TwitterWrapper fullWidth disabled>
                                            <TwitterIcon />
                                        </TwitterWrapper>
                                    )}
                                </Grid>
                                <Grid item xs={6}>
                                    {project.discord ? (
                                        <Link href={project.discord}>
                                            <DiscordWrapper fullWidth>
                                                <IconBrandDiscord />
                                            </DiscordWrapper>
                                        </Link>
                                    ) : (
                                        <DiscordWrapper fullWidth disabled>
                                            <IconBrandDiscord />
                                        </DiscordWrapper>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </MainCard>
            )}
        </>
    );
};

export default ProjectCard;
