import MainCard from 'components/MainCard';
import SkeletonProductPlaceholder from 'components/cards/Skeleton/CardPlaceholder';
import { Grid, CardContent, useTheme, Box, Typography, Chip, IconButton, Divider, Button } from '@mui/material';
import { EyeOutlined } from '@ant-design/icons';
import CopyAddress from 'components/CopyAddress';
import { DeleteOutlined } from '@mui/icons-material';
import { capitalize, get, last } from 'lodash';

const EmployCard = ({ time: datetime, project, name, wallet, method, amount, period, transactionHash, onDelete, index }: any) => {
    const theme = useTheme();
    const time = new Date(datetime);
    return (
        <>
            {project ? (
                <MainCard
                    boxShadow
                    sx={{
                        background: theme.palette.mode === 'dark' ? '#09080d' : theme.palette.primary.light,
                        '&:hover': {
                            transform: 'scale3d(1.03, 1.03, 1)',
                            transition: '.15s'
                        }
                    }}
                    title={
                        <Typography
                            fontWeight="800"
                            color="inherit"
                            sx={{ fontSize: '1.175rem', display: 'block', textDecoration: 'none', mr: 'auto' }}
                        >
                            {capitalize(name)}
                        </Typography>
                    }
                    secondary={
                        <IconButton color="error" onClick={() => onDelete({ project, name, wallet }, index)}>
                            <DeleteOutlined />
                        </IconButton>
                    }
                >
                    <CardContent sx={{ p: 0, pb: '0px !important' }}>
                        {/* project */}
                        <Box display="flex" alignItems="center">
                            <Typography
                                fontWeight="800"
                                color="secondary"
                                sx={{ fontSize: '1rem', display: 'block', textDecoration: 'none', mr: 'auto' }}
                            >
                                {project}
                            </Typography>
                        </Box>

                        {/* Amount */}
                        <Grid item xs={12} sx={{ mb: '10px', mt: '5px', display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Chip label={`${amount} ${method}`} size="small" color={method === 'SOL' ? 'secondary' : 'info'} />
                            <Chip label={`${period}`} size="small" color="success" />
                        </Grid>

                        <Grid item xs={12} sx={{ mb: '10px', mt: '5px' }}>
                            <Typography component="p">Upcoming payment date: </Typography>
                            <Typography component="p">{time.toLocaleString()}</Typography>
                        </Grid>

                        <Divider sx={{ mb: '10px' }} />
                        <Grid item xs={6} md={1}>
                            {!transactionHash || !transactionHash.length ? (
                                <Chip label="No Claim" color="primary" size="small" />
                            ) : (
                                <a
                                    href={`https://solscan.io/tx/${get(last(transactionHash), 'txHash', '')}?cluster=devnet`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {new Date(get(last(transactionHash), 'date', '')).toLocaleString()}
                                </a>
                            )}
                        </Grid>
                    </CardContent>
                </MainCard>
            ) : (
                <SkeletonProductPlaceholder />
            )}
        </>
    );
};

export default EmployCard;
