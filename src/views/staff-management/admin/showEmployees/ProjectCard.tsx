import MainCard from 'components/MainCard';
import SkeletonProductPlaceholder from 'components/cards/Skeleton/CardPlaceholder';
import { Grid, CardContent, useTheme, Box, Typography, Chip, IconButton } from '@mui/material';
import { EyeOutlined } from '@ant-design/icons';
import CopyAddress from 'components/CopyAddress';

const ProjectCard = ({ project, balance, solBalance, pubKey, setSelectProject }: any) => {
    const theme = useTheme();
    return (
        <>
            {project ? (
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
                    <CardContent sx={{ p: 2, pb: '16px !important' }}>
                        {/* project */}
                        <Box display="flex" alignItems="space-between">
                            <Typography
                                fontWeight="800"
                                color="secondary"
                                sx={{ fontSize: '1.175rem', display: 'block', textDecoration: 'none', mr: 'auto' }}
                            >
                                {project}
                            </Typography>
                            <IconButton onClick={() => setSelectProject(project)}>
                                <EyeOutlined />
                            </IconButton>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <Typography sx={{ fontSize: '1rem' }}>
                                <CopyAddress address={pubKey} />
                            </Typography>
                        </Box>

                        <Grid item xs={12} sx={{ mb: '10px', mt: '5px', display: 'flex', justifyContent: 'space-between' }}>
                            <Chip label={`${balance} USDC`} size="small" color="info" />
                            <Chip label={`${solBalance} SOL`} size="small" color="secondary" />
                        </Grid>
                    </CardContent>
                </MainCard>
            ) : (
                <SkeletonProductPlaceholder />
            )}
        </>
    );
};

export default ProjectCard;
