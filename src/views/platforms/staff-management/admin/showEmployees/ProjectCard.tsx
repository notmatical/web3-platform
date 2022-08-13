import MainCard from 'components/MainCard';
import SkeletonProductPlaceholder from 'components/cards/Skeleton/CardPlaceholder';
import { Grid, CardContent, useTheme, Box, Typography, Chip, IconButton, Avatar, Tooltip, AvatarGroup } from '@mui/material';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import CopyAddress from 'components/CopyAddress';
import { AccountBalanceWalletOutlined, AddCardOutlined, PaidOutlined } from '@mui/icons-material';
import { get, map } from 'lodash';
import { stringAvatar } from 'utils/utils';

const AlertIconRender = ({ notifyProjects, project, type, balance }: any) => {
    let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | undefined;
    let dayLabel = '';
    if (balance < get(notifyProjects, ['after1days', project, type])) {
        color = 'error';
        dayLabel = `next day`;
    } else if (balance < get(notifyProjects, ['after3days', project, type])) {
        color = 'warning';
        dayLabel = `3 days`;
    } else if (balance < get(notifyProjects, ['after7days', project, type])) {
        color = 'info';
        dayLabel = `7 days`;
    } else if (balance < get(notifyProjects, ['after30days', project, type])) {
        color = 'default';
        dayLabel = `30 days`;
    }
    const titleLabel: string = `Insufficient ${type} for ${dayLabel}`;

    return (
        <>
            {color && (
                <Tooltip title={titleLabel}>
                    <Chip sx={{ mr: 1 }} size="small" color={color} icon={<ExclamationCircleOutlined />} label={titleLabel} />
                </Tooltip>
            )}
        </>
    );
};

const ProjectCard = ({
    project,
    balance,
    solBalance,
    pubKey,
    setSelectProject,
    selectedProject,
    notifyProjects,
    handleDeposit,
    handleWithdraw
}: any) => {
    const theme = useTheme();
    return (
        <>
            {project ? (
                <MainCard
                    content={false}
                    boxShadow
                    sx={{
                        background:
                            // eslint-disable-next-line no-nested-ternary
                            selectedProject === project
                                ? theme.palette.mode === 'dark'
                                    ? theme.palette.success.contrastText
                                    : theme.palette.secondary.light
                                : theme.palette.mode === 'dark'
                                ? '#09080d'
                                : theme.palette.primary.light,
                        '&:hover': {
                            transform: 'scale3d(1.03, 1.03, 1)',
                            transition: '.15s'
                        },
                        height: '100%'
                    }}
                >
                    <CardContent sx={{ p: 2, pb: '16px !important' }}>
                        {/* project */}
                        <Box display="flex" justifyContent="space-between" sx={{ alignItems: 'center', minHeight: 44 }}>
                            <Typography
                                fontWeight="800"
                                color="secondary"
                                sx={{ fontSize: '1.175rem', display: 'block', textDecoration: 'none', mr: 'auto' }}
                            >
                                {project}
                            </Typography>
                            <Tooltip title="Employees">
                                <AvatarGroup
                                    total={get(notifyProjects, ['employees', project], []).length}
                                    max={3}
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => setSelectProject(project)}
                                >
                                    {map(get(notifyProjects, ['employees', project], []), (employee = '', idx) => (
                                        <Avatar key={idx} {...stringAvatar(employee)} />
                                    ))}
                                </AvatarGroup>
                            </Tooltip>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <Avatar sx={{ width: 16, height: 16, mr: 1 }}>
                                <AccountBalanceWalletOutlined sx={{ width: 12 }} />
                            </Avatar>
                            <Typography sx={{ fontSize: '0.875rem' }}>
                                <CopyAddress address={pubKey} />
                            </Typography>
                        </Box>
                        <Grid container sx={{ alignItems: 'center' }}>
                            <Grid
                                item
                                xs={6}
                                sx={{ mb: '10px', mt: '5px', display: 'flex', justifyContent: 'flex-start', gap: '4px', flexWrap: 'wrap' }}
                            >
                                <Chip label={`${balance} USDC`} size="small" color="info" />
                                <Chip label={`${solBalance} SOL`} size="small" color="secondary" />
                            </Grid>
                            <Grid item xs={6} sx={{ mb: '10px', mt: '5px', display: 'flex', justifyContent: 'flex-end' }}>
                                <Tooltip title="Deposit">
                                    <IconButton size="small" onClick={() => handleDeposit(pubKey)}>
                                        <AddCardOutlined />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Withdraw">
                                    <IconButton size="small" onClick={() => handleWithdraw(project, { balance, solBalance })}>
                                        <PaidOutlined />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sx={{ mb: '10px', mt: '5px', display: 'flex', justifyContent: 'flex-start', gap: '4px', flexWrap: 'wrap' }}
                            >
                                <AlertIconRender
                                    notifyProjects={notifyProjects}
                                    type="SOL"
                                    project={project}
                                    balance={solBalance}
                                    handleDeposit={handleDeposit}
                                    handleWithdraw={handleWithdraw}
                                />
                                <AlertIconRender
                                    notifyProjects={notifyProjects}
                                    type="USDC"
                                    project={project}
                                    balance={balance}
                                    handleDeposit={handleDeposit}
                                    handleWithdraw={handleWithdraw}
                                />
                            </Grid>
                            {/* <Grid item xs={6} sx={{ mb: '10px', mt: '5px', display: 'flex', justifyContent: 'flex-end' }}></Grid> */}
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
