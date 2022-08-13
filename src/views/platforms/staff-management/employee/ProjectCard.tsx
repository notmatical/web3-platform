import { Grid, Button, Divider, CardContent, useTheme, Box, Typography, Chip } from '@mui/material';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { mutations } from '../../../graphql/graphql';
import { useToasts } from 'hooks/useToasts';
import { useNavigate } from 'react-router-dom';
import MainCard from 'components/MainCard';
import SkeletonProductPlaceholder from 'components/cards/Skeleton/CardPlaceholder';
import { FormattedMessage } from 'react-intl';

const ProjectCard = ({ time: datetime, project, wallet, method, amount, period }: any) => {
    const [clickClaim] = useMutation(mutations.CLAIM);
    const theme = useTheme();
    const now = new Date();
    const time = new Date(datetime);
    const [canClaim, setCanClaim] = useState(true);
    const { showInfoToast, showErrorToast } = useToasts();
    const navigate = useNavigate();
    const onClaim = async () => {
        if (time >= now) {
            showErrorToast("Can't claim until payment date");
            return;
        }
        setCanClaim(false);
        const oldDate = new Date(datetime);
        const differentTime = now.getTime() - oldDate.getTime();
        // eslint-disable-next-line no-bitwise
        const differentDay = ~~(differentTime / (1000 * 3600 * 24));
        const delayed = (differentDay + 1).toString();
        try {
            const res = await clickClaim({
                variables: { project, wallet, method, claimTime: now, delayed }
            });
            const txHash = res.data.clickClaim;
            // TODO: emit transaction
            throw new Error('Fail to claim.');
            setCanClaim(false);
            showInfoToast('Transaction Success');
            navigate('/staff-management/employee', { replace: true });
        } catch (err) {
            setCanClaim(true);
            showErrorToast(`${project} Transaction failed.`);
        }
    };
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
                        <Box display="flex" alignItems="center">
                            <Typography
                                fontWeight="800"
                                color="secondary"
                                sx={{ fontSize: '1.175rem', display: 'block', textDecoration: 'none', mr: 'auto' }}
                            >
                                {project}
                            </Typography>
                        </Box>

                        {/* Amount */}
                        <Grid item xs={12} sx={{ mb: '10px', mt: '5px', display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Chip label={`${amount} ${method}`} size="small" color={method === 'SOL' ? 'secondary' : 'info'} />
                            <Chip label={`${period}`} size="small" color="success" />
                        </Grid>

                        <Grid item xs={12} sx={{ mb: '10px', mt: '5px', display: 'flex', justifyContent: 'space-between' }}>
                            <Typography component="p">
                                <FormattedMessage id="upcoming-payment-date" />
                            </Typography>
                            <Typography component="p">{time.toLocaleString()}</Typography>
                        </Grid>

                        <Divider sx={{ mb: '10px' }} />

                        {/* Management Buttons */}
                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    {time < now ? (
                                        <Button variant="contained" onClick={onClaim} sx={{ p: 2 }} fullWidth disabled={!canClaim}>
                                            {canClaim ? <FormattedMessage id="claim" /> : <FormattedMessage id="in-progress" />}
                                        </Button>
                                    ) : (
                                        <Button variant="contained" sx={{ p: 2 }} fullWidth disabled>
                                            <FormattedMessage id="wait-till-upcoming-date" />
                                        </Button>
                                    )}
                                </Grid>
                            </Grid>
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
