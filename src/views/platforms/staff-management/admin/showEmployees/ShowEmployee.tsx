import React, { useEffect, useState } from 'react';

import { useTheme, styled } from '@mui/material/styles';
import {
    Grid,
    Stack,
    Button,
    Avatar,
    TextField,
    Tooltip,
    FormControl,
    Select,
    MenuItem,
    SelectChangeEvent,
    IconButton,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    Divider,
    DialogActions,
    OutlinedInput,
    InputLabel,
    Box,
    CircularProgress,
    Chip,
    TableContainer,
    TablePagination,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell
} from '@mui/material';

import moment from 'moment';
import { useMutation, useQuery } from '@apollo/client';
import * as db from 'database/graphql/graphql';
import { useToasts } from 'hooks/useToasts';
import MainCard from 'components/MainCard';
import { AddOutlined, DeleteOutlined, RefreshOutlined } from '@mui/icons-material';
import { useWallet } from '@solana/wallet-adapter-react';
import { capitalize, each, get, groupBy, last, map, sum } from 'lodash';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import CopyAddress from 'components/CopyAddress';
import EmployCard from './EmployCard';
import { FormattedMessage } from 'react-intl';
import { useSolPrice } from 'contexts/CoinGecko';
import { IconArrowsSort, IconPlus, IconRefresh } from '@tabler/icons';

// assets
import { CloseCircleOutlined } from '@ant-design/icons';

function SelectProject({ projects, setProjects, address }: any) {
    const { data } = useQuery(db.queries.GET_WALLETS, { variables: { wallet: address } });

    const onProjects = ({ target: { value } }: SelectChangeEvent) => {
        setProjects(value);
    };

    return (
        <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
                <InputLabel id="project-select-label">
                    <FormattedMessage id="project" />
                </InputLabel>
                <Select id="project-select-label" input={<OutlinedInput label="Project" />} value={projects} onChange={onProjects}>
                    {data &&
                        data.getWallets.length > 0 &&
                        data.getWallets.map((item: any, key: any) => (
                            <MenuItem value={item.project} key={key}>
                                {item.project}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
        </Grid>
    );
}

export default function ShowEmployee({ selectedProject, setSelectedProject, setMonthlyPayout, setNofifyProjects }: any) {
    const theme = useTheme();

    const [period, setPeriod] = useState('Daily');
    const [method, setMethod] = useState('SOL');
    const [isLoading, setIsLoading] = useState(false);

    const { data: allData, refetch: refetchAllData } = useQuery(db.queries.GET_CLAIMERS);
    const { data, refetch } = useQuery(db.queries.GET_EMPLOYEES, { variables: { project: selectedProject || '' } });
    const [data1, setData1] = useState<any[]>([]);

    const [deleteClaimer] = useMutation(db.mutations.DELETE_CLAIMER);

    const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);

    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [wallet, setWallet] = useState('');
    const [time, setTime] = useState('');
    const [projects, setProjects] = useState('');
    const [createClaimer] = useMutation(db.mutations.ADD_CLAIMER);

    const { showInfoToast, showErrorToast } = useToasts();
    const adminWallet = useWallet();
    const solPrice = useSolPrice();

    // table pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data1.length) : 0;

    const onPeriod = ({ target: { value } }: SelectChangeEvent) => {
        setPeriod(value);
    };

    const onMethod = ({ target: { value } }: SelectChangeEvent) => {
        setMethod(value);
    };

    const updatePage = async () => {
        try {
            setIsLoading(true);
            if (selectedProject) {
                const {
                    data: projectData = {
                        getEmployees: []
                    }
                } = await refetch();
                setData1(projectData.getEmployees);
            } else {
                const {
                    data: projectData = {
                        getClaimers: []
                    }
                } = await refetchAllData();
                setData1(projectData.getClaimers);
                setMonthlyPayout(
                    sum(
                        map(projectData.getClaimers, ({ amount: amt, method: cur, period: per }: any) => {
                            const Weekly = Math.ceil((new Date().getDate() - 1 - new Date().getDay()) / 7);
                            const multiplier: Record<string, number> = {
                                Daily: new Date().getDate(),
                                Weekly,
                                BiWeekly: Weekly / 2,
                                Monthly: 1
                            };
                            return amt * (cur === 'SOL' ? solPrice : 1) * (multiplier[per] || 1);
                        })
                    )
                );
                const projectGrp = groupBy(projectData.getClaimers, 'project');
                const after1days: any = {};
                const after3days: any = {};
                const after7days: any = {};
                const after30days: any = {};
                each(Object.keys(projectGrp), (key) => {
                    map(projectGrp[key], ({ amount: amt, method: met, time: datetime }) => {
                        if (!after1days[key]) {
                            after1days[key] = {};
                        }
                        if (after1days[key][met] === undefined) {
                            after1days[key][met] = 0;
                        }
                        if (!after3days[key]) {
                            after3days[key] = {};
                        }
                        if (after3days[key][met] === undefined) {
                            after3days[key][met] = 0;
                        }
                        if (!after7days[key]) {
                            after7days[key] = {};
                        }
                        if (after7days[key][met] === undefined) {
                            after7days[key][met] = 0;
                        }
                        if (!after30days[key]) {
                            after30days[key] = {};
                        }
                        if (after30days[key][met] === undefined) {
                            after30days[key][met] = 0;
                        }
                        if (moment(datetime).diff(moment(), 'days') <= 1) {
                            after1days[key][met] += +amt;
                        }
                        if (moment(datetime).diff(moment(), 'days') <= 3) {
                            after3days[key][met] += +amt;
                        }
                        if (moment(datetime).diff(moment(), 'days') <= 7) {
                            after7days[key][met] += +amt;
                        }
                        if (moment(datetime).diff(moment(), 'days') <= 30) {
                            after30days[key][met] += +amt;
                        }
                    });
                });
                setNofifyProjects({
                    after1days,
                    after3days,
                    after7days,
                    after30days
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        updatePage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allData, data, selectedProject]);

    const deleteFunc = async (delData: any) => {
        try {
            setIsLoading(true);
            await deleteClaimer({ variables: { project: delData.project, name: delData.name, wallet: delData.wallet } });
            updatePage();
        } catch (err) {
            console.error(err);
            console.error('Error occured');
        } finally {
            setIsLoading(false);
        }
    };

    const onSave = async () => {
        if (!projects || !name || !method || !wallet || !amount || !time || !period) {
            showInfoToast('fields must be required.');
            return;
        }

        try {
            setIsLoading(true);
            await createClaimer({
                variables: { project: projects, name, method, amount, wallet, period, time }
            });
            updatePage();
            setShowAddEmployeeModal(false);
            setName('');
            setAmount('');
            setWallet('');
            setPeriod('');
            setTime('');
        } catch (err) {
            console.error(err);
            showErrorToast('Already employed on that project OR ERROR!');
        } finally {
            setIsLoading(false);
        }
    };

    const EmployeeListCard = ({ children, sx }: any) => (
        <MainCard
            title={selectedProject ? `${selectedProject} - Employees` : 'Employees'}
            contentSX={sx}
            secondary={
                <>
                    <IconButton onClick={() => setShowAddEmployeeModal(true)}>
                        <AddOutlined />
                    </IconButton>
                    <IconButton onClick={() => updatePage()}>
                        <RefreshOutlined />
                    </IconButton>
                    <Button color="inherit" onClick={() => setSelectedProject(undefined)}>
                        Show All
                    </Button>
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
            <Box sx={{ display: { md: 'none' }, width: '100%' }}>
                <EmployeeListCard>
                    {!isLoading ? (
                        <>
                            {data1 && data1.length > 0 ? (
                                <Grid container spacing={2}>
                                    {map(data1, (item: any, i: number) => (
                                        <Grid item xs={12} sm={6}>
                                            <EmployCard key={i} index={i} {...item} onDelete={(params: any) => deleteFunc(params)} />
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Grid item sx={{ p: 2 }}>
                                    <Typography component="h2" sx={{ textAlign: 'center' }}>
                                        <FormattedMessage id="no-employees-found" />
                                    </Typography>
                                </Grid>
                            )}
                        </>
                    ) : (
                        <Grid item sx={{ p: 2 }}>
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <CircularProgress color="secondary" />
                            </Box>
                        </Grid>
                    )}
                </EmployeeListCard>
            </Box>

            <Grid item xs={12}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h3">Current Employees</Typography>
                    <Box display="flex" alignItems="center" sx={{ gap: 1 }}>
                        <Tooltip title="Add Employee" placement="top" arrow>
                            <IconButton
                                onClick={() => setShowAddEmployeeModal(true)}
                                sx={{
                                    background: '#202a30',
                                    width: '33px',
                                    height: '33px'
                                }}
                            >
                                <IconPlus color="#FFF" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Refresh Employees" placement="top" arrow>
                            <IconButton
                                onClick={() => updatePage()}
                                sx={{
                                    background: '#202a30',
                                    width: '33px',
                                    height: '33px'
                                }}
                            >
                                <IconRefresh color="#FFF" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Show All" placement="top" arrow>
                            <IconButton
                                onClick={() => setSelectedProject(undefined)}
                                sx={{
                                    background: '#202a30',
                                    width: '33px',
                                    height: '33px'
                                }}
                            >
                                <IconArrowsSort color="#FFF" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </Grid>
            {!isLoading ? (
                <>
                    {data1 && data1.length > 0 ? (
                        <>
                            <MainCard border={false} sx={{ width: '100%', mt: 2 }} contentSX={{ p: '0 !important' }}>
                                <TableContainer>
                                    <Table sx={{ minWidth: 650 }} aria-label="employee table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Project</TableCell>
                                                <TableCell>Employee</TableCell>
                                                <TableCell>Wallet</TableCell>
                                                <TableCell>Budget</TableCell>
                                                <TableCell>Next Payment</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data1
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((item: any, index: number) => (
                                                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell component="th" scope="row">
                                                            {item.project}
                                                        </TableCell>
                                                        <TableCell>{item.name}</TableCell>
                                                        <TableCell>
                                                            <CopyAddress address={item.wallet} />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                <Chip
                                                                    label={`${item.amount} ${item.method}`}
                                                                    color={item.method === 'SOL' ? 'secondary' : 'info'}
                                                                    size="small"
                                                                    sx={{ borderRadius: '4px' }}
                                                                />
                                                                <Chip
                                                                    label={item.period}
                                                                    color="success"
                                                                    size="small"
                                                                    sx={{ borderRadius: '4px' }}
                                                                />
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>{new Date(item.time).toLocaleString()}</TableCell>
                                                        <TableCell>
                                                            {!item.transactionHash.length ? (
                                                                <Chip
                                                                    label="Hasn't Claimed"
                                                                    size="small"
                                                                    color="error"
                                                                    sx={{ borderRadius: '4px' }}
                                                                />
                                                            ) : (
                                                                <Chip
                                                                    label="Not Started"
                                                                    size="small"
                                                                    color="secondary"
                                                                    sx={{ borderRadius: '4px' }}
                                                                />
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box display="flex" flexDirection="row" sx={{ gap: 1 }}>
                                                                <Button
                                                                    color="error"
                                                                    size="small"
                                                                    variant="contained"
                                                                    onClick={() =>
                                                                        deleteFunc({
                                                                            project: item.project,
                                                                            name: item.name,
                                                                            wallet: item.wallet
                                                                        })
                                                                    }
                                                                >
                                                                    Remove
                                                                </Button>
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Divider />
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={data1.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </MainCard>
                        </>
                    ) : (
                        <Grid item xs={12}>
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                sx={{ borderRadius: 3, padding: 4, border: '1px solid rgba(213, 217, 233, 0.2)' }}
                            >
                                <Stack alignItems="center">
                                    <Avatar
                                        variant="rounded"
                                        sx={{
                                            borderRadius: '9999px',
                                            width: '80px !important',
                                            height: '80px !important',
                                            backgroundColor: theme.palette.dark.main,
                                            color: theme.palette.secondary.dark,
                                            mb: 2
                                        }}
                                    >
                                        <CloseCircleOutlined style={{ fontSize: 32 }} />
                                    </Avatar>
                                    <Typography variant="h3" color="inherit">
                                        No Employees Found
                                    </Typography>
                                    <Typography variant="subtitle2" color="inherit">
                                        There are no employees to display.
                                    </Typography>
                                </Stack>
                            </Box>
                        </Grid>
                    )}
                </>
            ) : (
                <Grid item sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <CircularProgress color="secondary" />
                    </Box>
                </Grid>
            )}

            {/* <Box sx={{ display: { xs: 'none', md: 'block' }, width: '100%' }}>
                <EmployeeListCard sx={{ p: 0 }}>
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
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <CircularProgress color="secondary" />
                            </Box>
                        </Grid>
                    )}
                </EmployeeListCard>
            </Box> */}

            <Dialog
                open={showAddEmployeeModal}
                onClose={() => {
                    setShowAddEmployeeModal(false);
                }}
                maxWidth="xl"
            >
                <DialogTitle>
                    <FormattedMessage id="add-an-employee" />
                </DialogTitle>
                <DialogContent>
                    <Grid container justifyContent="center" sx={{ py: 4 }}>
                        <Grid container spacing={2}>
                            <SelectProject projects={projects} setProjects={setProjects} address={adminWallet.publicKey?.toBase58()} />
                            <Grid item xs={12} md={6}>
                                <FormattedMessage id="staff-name">
                                    {(msg) => (
                                        <TextField
                                            fullWidth
                                            id="standard-basic"
                                            label={`${msg}`}
                                            variant="outlined"
                                            onChange={({ target: { value } }: any) => {
                                                setName(value);
                                            }}
                                        />
                                    )}
                                </FormattedMessage>
                            </Grid>
                            <Grid item xs={6}>
                                <FormattedMessage id="budget">
                                    {(msg) => (
                                        <TextField
                                            fullWidth
                                            id="standard-basic"
                                            label={`${msg}`}
                                            variant="outlined"
                                            onChange={(e) => {
                                                setAmount(e.target.value);
                                            }}
                                        />
                                    )}
                                </FormattedMessage>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth variant="outlined">
                                    <Select value={method} onChange={onMethod}>
                                        <MenuItem value="SOL">SOL</MenuItem>
                                        <MenuItem value="USDC">USDC</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormattedMessage id="wallet-addr">
                                    {(msg) => (
                                        <TextField
                                            fullWidth
                                            id="standard-basic"
                                            label={`${msg}`}
                                            variant="outlined"
                                            onChange={(e) => {
                                                setWallet(e.target.value);
                                            }}
                                        />
                                    )}
                                </FormattedMessage>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth variant="outlined">
                                    <Select value={period} onChange={onPeriod}>
                                        <MenuItem value="Daily">
                                            <FormattedMessage id="Daily" />
                                        </MenuItem>
                                        <MenuItem value="Weekly">
                                            <FormattedMessage id="Weekly" />
                                        </MenuItem>
                                        <MenuItem value="Biweekly">
                                            <FormattedMessage id="Biweekly" />
                                        </MenuItem>
                                        <MenuItem value="Monthly">
                                            <FormattedMessage id="Monthly" />
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormattedMessage id="datetime">
                                    {(msg) => (
                                        <TextField
                                            fullWidth
                                            id="datetime=local"
                                            label={`${msg}`}
                                            type="datetime-local"
                                            defaultValue={moment().format('YYYY-MM-DDTHH:MM:SS')}
                                            InputLabelProps={{ shrink: true }}
                                            onChange={(e) => {
                                                setTime(e.target.value);
                                            }}
                                        />
                                    )}
                                </FormattedMessage>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <Divider />
                <DialogActions sx={{ pt: 3, px: 2 }}>
                    <Button variant="outlined" color="primary" onClick={() => setShowAddEmployeeModal(false)}>
                        <FormattedMessage id="cancel" />
                    </Button>
                    <Button variant="contained" color="secondary" onClick={onSave}>
                        <FormattedMessage id="save" />
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
