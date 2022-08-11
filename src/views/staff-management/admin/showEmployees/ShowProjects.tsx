import {
    Grid,
    Button,
    TextField,
    IconButton,
    Typography,
    Dialog,
    Box,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    LinearProgress,
    Chip,
    Tooltip
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { mutations, queries } from '../../../../graphql/graphql';

import { useToasts } from 'hooks/useToasts';
import { AddOutlined, RefreshOutlined } from '@mui/icons-material';
import MainCard from 'components/MainCard';
import { useMeta } from 'contexts/meta/meta';
import { useWallet } from '@solana/wallet-adapter-react';
import { solConnection } from 'actions/shared';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { AccountLayout, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { USDCMINT } from 'config/config';
import { Promise } from 'bluebird';
import { ExclamationCircleOutlined, EyeOutlined } from '@ant-design/icons';
import CopyAddress from 'components/CopyAddress';
import { get, map, sumBy } from 'lodash';
import ProjectCard from './ProjectCard';
import { FormattedMessage } from 'react-intl';

export default function ShowProjects({ notifyProjects, setSelectedProject, setNumberOfProject, setTotalSolBal, setTotalUSDCBal }: any) {
    const [project, setProject] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
    const wallet = useWallet();

    const [createWallet] = useMutation(mutations.CREAT_PROJECT);

    const { data, refetch } = useQuery(queries.GET_WALLETS, { variables: { wallet: wallet.publicKey?.toBase58() } });
    const { data: projectWallet, refetch: refetchProjectWallet } = useQuery(queries.GET_WALLETPUBKEY, {
        variables: { project: '', wallet: wallet.publicKey?.toBase58() }
    });
    const [data1, setData1] = useState<any[]>([]);

    const { showInfoToast, showErrorToast } = useToasts();
    const { startLoading, stopLoading } = useMeta();

    const getProjects = async () => {
        const { data: projectsData } = await refetch();
        const projects = projectsData.getWallets;
        const records: any[] = [];
        await Promise.map(projects, async (proj: any) => {
            const { data: projectData } = await refetchProjectWallet({
                project: proj.project,
                wallet: wallet.publicKey?.toBase58()
            });
            const pubKey = projectData.getWalletPubkey.pubkey;
            const getBal = await solConnection.getBalance(new PublicKey(pubKey));
            const fromWindowsWallet = new PublicKey(pubKey);
            const tokenAccounts = await solConnection.getTokenAccountsByOwner(fromWindowsWallet, {
                programId: TOKEN_PROGRAM_ID
            });
            let usdcBal = 0;
            tokenAccounts.value.forEach((e) => {
                const accountInfo = AccountLayout.decode(e.account.data);
                if (accountInfo.mint.toBase58() === USDCMINT) {
                    usdcBal = Number(accountInfo.amount);
                }
            });
            const result = {
                project: proj.project,
                pubKey,
                solBalance: getBal / LAMPORTS_PER_SOL,
                balance: usdcBal / LAMPORTS_PER_SOL
            };
            records.push(result);
        });
        setNumberOfProject(records.length);
        setTotalSolBal(sumBy(records, 'solBalance'));
        setTotalUSDCBal(sumBy(records, 'balance'));
        return records;
    };

    const onGenerate = async () => {
        if (!project) {
            showErrorToast('Project field required.');
            return;
        }
        if (!wallet || !wallet.publicKey) {
            showErrorToast('Please connect wallet.');
            return;
        }
        startLoading();
        setIsLoading(true);
        try {
            await createWallet({ variables: { project, wallet: wallet.publicKey?.toBase58() } });
            updatePage();
            showInfoToast('New project has been created successfully.');
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
            stopLoading();
            setShowNewProjectDialog(false);
            setSelectedProject(project);
            setProject('');
        }
    };

    const handleProjectNameChange = ({ target: { value } }: any) => {
        setProject(value);
    };

    const columns: GridColDef[] = [
        { field: 'project', headerName: 'Project', flex: 2 },
        {
            field: 'pubKey',
            headerName: 'Project Wallet',
            flex: 5,
            renderCell: (params: GridRenderCellParams) => <CopyAddress address={params.row.pubKey} />
        },
        {
            field: 'solBalance',
            headerName: 'Balance (SOL)',
            type: 'number',
            flex: 2,
            renderCell: (params: GridRenderCellParams) => {
                const type = 'SOL';
                let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | undefined;
                let titleLabel: string = '';
                if (params.row.solBalance < get(notifyProjects, ['after1days', params.row.project, type])) {
                    color = 'error';
                    titleLabel = 'Insufficient for next day payout';
                } else if (params.row.solBalance < get(notifyProjects, ['after3days', params.row.project, type])) {
                    color = 'warning';
                    titleLabel = 'Insufficient for 3 days payout';
                } else if (params.row.solBalance < get(notifyProjects, ['after7days', params.row.project, type])) {
                    color = 'info';
                    titleLabel = 'Insufficient for 7 days payout';
                } else if (params.row.solBalance < get(notifyProjects, ['after30days', params.row.project, type])) {
                    color = 'default';
                    titleLabel = 'Insufficient for 30 days payout';
                }

                return (
                    <>
                        {color && (
                            <Tooltip title={titleLabel}>
                                <Chip sx={{ mr: 1, pl: 1 }} size="small" color={color} icon={<ExclamationCircleOutlined />} />
                            </Tooltip>
                        )}
                        {params.row.solBalance}
                    </>
                );
            }
        },
        {
            field: 'balance',
            headerName: 'Balance (USDC)',
            type: 'number',
            flex: 2,
            renderCell: (params: GridRenderCellParams) => {
                const type = 'USDC';
                let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | undefined;
                let titleLabel: string = '';
                if (params.row.balance < get(notifyProjects, ['after1days', params.row.project, type])) {
                    color = 'error';
                    titleLabel = 'Insufficient for next day payout';
                } else if (params.row.balance < get(notifyProjects, ['after3days', params.row.project, type])) {
                    color = 'warning';
                    titleLabel = 'Insufficient for 3 days payout';
                } else if (params.row.balance < get(notifyProjects, ['after7days', params.row.project, type])) {
                    color = 'info';
                    titleLabel = 'Insufficient for 7 days payout';
                } else if (params.row.balance < get(notifyProjects, ['after30days', params.row.project, type])) {
                    color = 'default';
                    titleLabel = 'Insufficient for 30 days payout';
                }

                return (
                    <>
                        {color && (
                            <Tooltip title={titleLabel}>
                                <Chip sx={{ mr: 1, pl: 1 }} size="small" color={color} icon={<ExclamationCircleOutlined />} />
                            </Tooltip>
                        )}
                        {params.row.balance}
                    </>
                );
            }
        },
        {
            field: 'select',
            headerName: '',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <IconButton color="inherit" onClick={() => setSelectedProject(params.row.project)}>
                    <EyeOutlined />
                </IconButton>
            )
        }
    ];

    const updatePage = async () => {
        try {
            setIsLoading(true);
            const records = await getProjects();
            setData1(records);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        updatePage();
    }, []);

    const ProjectListCard = ({ children, sx }: any) => (
        <MainCard
            title={<FormattedMessage id="projects" />}
            contentSX={sx}
            secondary={
                <>
                    <IconButton
                        onClick={() => {
                            setSelectedProject('');
                            setProject('');
                            setShowNewProjectDialog(true);
                        }}
                    >
                        <AddOutlined />
                    </IconButton>
                    <IconButton onClick={() => updatePage()}>
                        <RefreshOutlined />
                    </IconButton>
                </>
            }
            sx={{
                width: '100%',
                '.MuiCardContent-root:last-child': {
                    pb: { md: 0 }
                }
            }}
        >
            {children}
        </MainCard>
    );

    return (
        <>
            <Box sx={{ display: { md: 'none' }, width: '100%', mb: 2 }}>
                <ProjectListCard>
                    {!isLoading ? (
                        <>
                            {data && data1.length > 0 ? (
                                <Grid container spacing={2}>
                                    {map(data1, (item: any, i: number) => (
                                        <Grid item xs={12} sm={6}>
                                            <ProjectCard
                                                key={i}
                                                index={i}
                                                {...item}
                                                setSelectProject={(proj: string) => setSelectedProject(proj)}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Grid item sx={{ p: 2 }}>
                                    <Typography component="h2" sx={{ textAlign: 'center' }}>
                                        <FormattedMessage id="no-projects-found" />
                                    </Typography>
                                </Grid>
                            )}
                        </>
                    ) : (
                        <Grid item sx={{ p: 2 }}>
                            <LinearProgress color="secondary" />
                        </Grid>
                    )}
                </ProjectListCard>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'block' }, width: '100%', mb: 2 }}>
                <ProjectListCard sx={{ p: 0 }}>
                    {!isLoading ? (
                        <DataGrid
                            sx={{
                                width: '100%',
                                border: 'none',
                                '.MuiDataGrid-columnSeparator': { display: 'none' }
                            }}
                            getRowId={(row) => row.project}
                            rows={data1}
                            columns={columns}
                            pageSize={10}
                            autoHeight
                            rowsPerPageOptions={[10]}
                            disableColumnFilter
                            disableColumnMenu
                            disableColumnSelector
                            disableDensitySelector
                            disableSelectionOnClick
                            hideFooterSelectedRowCount
                        />
                    ) : (
                        <Grid item sx={{ p: 2 }}>
                            <LinearProgress color="secondary" />
                        </Grid>
                    )}
                </ProjectListCard>
            </Box>
            <Dialog
                open={showNewProjectDialog}
                onClose={() => {
                    setShowNewProjectDialog(false);
                }}
            >
                <DialogTitle>
                    <FormattedMessage id="create-a-new-project" />
                </DialogTitle>
                <DialogContent>
                    <Grid container sx={{ py: 2, alignItems: 'center', flex: 1, justifyContent: 'flex-start' }}>
                        <Grid item xs={12}>
                            <Typography component="h2" sx={{ py: 2, textAlign: 'start' }}>
                                <FormattedMessage id="create-project-desc" />
                            </Typography>
                            <FormattedMessage id="new-project-name">
                                {(msg) => (
                                    <TextField
                                        fullWidth
                                        id="standard-basic"
                                        value={project}
                                        label={`${msg}`}
                                        variant="outlined"
                                        onChange={(e) => handleProjectNameChange(e)}
                                    />
                                )}
                            </FormattedMessage>
                        </Grid>
                    </Grid>
                </DialogContent>
                <Divider />
                <DialogActions sx={{ pt: 3, px: 2 }}>
                    <Button variant="outlined" color="primary" onClick={() => setShowNewProjectDialog(false)}>
                        <FormattedMessage id="cancel" />
                    </Button>
                    <Button variant="contained" color="secondary" onClick={onGenerate}>
                        <FormattedMessage id="create-a-new-project" />
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
