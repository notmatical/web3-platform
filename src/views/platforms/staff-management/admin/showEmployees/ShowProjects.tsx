import { useEffect, useState } from 'react';

// material-ui
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
    FormControl,
    Select,
    MenuItem,
    CircularProgress
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { AddOutlined, RefreshOutlined } from '@mui/icons-material';

// third-party
import { FormattedMessage } from 'react-intl';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { AccountLayout, TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Promise } from 'bluebird';
import { map, sortBy, sumBy } from 'lodash';

// project imports
import { useToasts } from 'hooks/useToasts';
import { useMeta } from 'contexts/meta/meta';
import { solConnection } from 'actions/shared';
import { USDCMINT } from 'config/config';
import { NumberInput } from 'components/NumberInput';
import { getOrCreateAssociatedTokenAccount } from 'actions/project';
import MainCard from 'components/MainCard';
import ProjectCard from './ProjectCard';

// graphql
import { useMutation, useQuery } from '@apollo/client';
import * as db from 'database/graphql/graphql';

export default function ShowProjects({
    notifyProjects,
    selectedProject,
    setSelectedProject,
    setNumberOfProject,
    setTotalSolBal,
    setTotalUSDCBal
}: any) {
    const [clickWithdraw] = useMutation(db.mutations.WITHDRAW);
    const { connection } = useConnection();

    const [project, setProject] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
    const [showDepositDialog, setShowDepositDialog] = useState(false);
    const [depositAmt, setDepositAmt] = useState(0);
    const [depositCurrency, setDepositCurrency] = useState('SOL');
    const [depositWallet, setDepositWallet] = useState<string>();
    const [isDepositing, setIsDepositing] = useState(false);
    const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
    const [withdrawAmt, setWithdrawAmt] = useState(0);
    const [withdrawCurrency, setWithdrawCurrency] = useState('SOL');
    const [withdrawProject, setWithdrawProject] = useState('');
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [maxBalance, setMaxBalance] = useState<any>({});
    const wallet = useWallet();

    const [createWallet] = useMutation(db.mutations.CREATE_PROJECT);

    const { data, refetch } = useQuery(db.queries.GET_WALLETS, { variables: { wallet: wallet.publicKey?.toBase58() } });
    const { data: projectWallet, refetch: refetchProjectWallet } = useQuery(db.queries.GET_WALLETPUBKEY, {
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

    const depositSol = async () => {
        const amount = depositAmt;
        const toPubkey = depositWallet;

        // console.log('deposit solana function called');
        // console.log(wallet, wallet.publicKey, amount, toPubkey);

        if (!wallet || !wallet.publicKey || !amount || !toPubkey) {
            return;
        }

        try {
            setIsDepositing(true);

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: new PublicKey(toPubkey),
                    lamports: LAMPORTS_PER_SOL * amount
                })
            );

            // Sign transaction, broadcast, and confirm
            const signature = await wallet.sendTransaction(transaction, connection);

            await connection.confirmTransaction(signature, 'processed');
            // console.log('SIGNATURE', signature);
            showInfoToast(`You have successfully deposit ${amount.toFixed(2)} SOL.`);
        } catch (error) {
            showErrorToast('There are some issues with the transaction. It may due to Solana congestion.');
        } finally {
            setShowDepositDialog(false);
            setIsDepositing(false);
            await updatePage();
        }
    };

    const depositUSDC = async () => {
        const amount = depositAmt;
        const toPubkey = depositWallet;

        if (!wallet || !wallet.publicKey || !amount || !wallet.signTransaction || !toPubkey) {
            return;
        }

        try {
            setIsDepositing(true);
            const USDCTokenMintPk = new PublicKey(USDCMINT);
            const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                wallet.publicKey,
                USDCTokenMintPk,
                wallet.publicKey,
                wallet.signTransaction
            );

            const toTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                wallet.publicKey,
                USDCTokenMintPk,
                new PublicKey(toPubkey),
                wallet.signTransaction
            );

            const transaction = new Transaction().add(
                Token.createTransferInstruction(
                    TOKEN_PROGRAM_ID,
                    fromTokenAccount.address,
                    toTokenAccount.address,
                    wallet.publicKey,
                    [],
                    amount * 100000
                )
            );

            const signature = await wallet.sendTransaction(transaction, connection);

            const response = await connection.confirmTransaction(signature, 'processed');
            // console.log('response', response);
            showInfoToast(`You have successfully deposit ${amount.toFixed(2)} USDC.`);
        } catch (error) {
            showErrorToast('There are some issues with the transaction. It may due to Solana congestion.');
        } finally {
            setShowDepositDialog(false);
            setIsDepositing(false);
            await updatePage();
        }
    };

    const withdraw = async () => {
        const amount = withdrawAmt;

        try {
            setIsWithdrawing(true);

            const { data: withdrawRes } = await clickWithdraw({
                variables: {
                    project: withdrawProject,
                    method: withdrawCurrency,
                    amount: withdrawCurrency === 'SOL' ? (amount - 0.00095) * LAMPORTS_PER_SOL : amount * 100000
                }
            });

            const txHash = withdrawRes.clickWithdraw;
            if (!txHash) {
                throw new Error('There are some issues with the transaction. It may due to Solana congestion.');
            }

            showInfoToast(`You have successfully deposit ${amount.toFixed(2)} ${withdrawCurrency}. Transaction: ${txHash}`);
        } catch (err: any) {
            showErrorToast(err.message || err);
        } finally {
            setShowWithdrawDialog(false);
            setIsWithdrawing(false);
            await updatePage();
        }
    };

    const handleDeposit = (address: string) => {
        // console.log('handleDeposit', address);
        setDepositAmt(0);
        setDepositWallet(address);
        setShowDepositDialog(true);
    };

    const handleWithdraw = (proj: string, maxBal: any) => {
        setMaxBalance(maxBal);
        setWithdrawCurrency(maxBal.solBalance > 0 ? 'SOL' : 'USDC');
        setWithdrawAmt(maxBal.solBalance > 0 ? maxBal.solBalance : maxBal.balance);
        setWithdrawProject(proj);
        setShowWithdrawDialog(true);
    };

    const updatePage = async () => {
        try {
            setIsLoading(true);
            const records = await getProjects();
            // console.log(records);
            setData1(sortBy(records, 'project'));
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
            <Box sx={{ width: '100%', mb: 2 }}>
                <ProjectListCard>
                    {!isLoading ? (
                        <>
                            {data && data1.length > 0 ? (
                                <Grid container spacing={2} sx={{ pb: 2 }}>
                                    {map(data1, (item: any, i: number) => (
                                        <Grid item xs={12} sm={6} md={4} xl={3}>
                                            <ProjectCard
                                                key={i}
                                                index={i}
                                                {...item}
                                                selectedProject={selectedProject}
                                                notifyProjects={notifyProjects}
                                                handleDeposit={handleDeposit}
                                                handleWithdraw={handleWithdraw}
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
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <CircularProgress color="secondary" />
                            </Box>
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
            <Dialog
                open={showDepositDialog}
                onClose={() => {
                    setShowDepositDialog(false);
                }}
            >
                <DialogTitle>
                    <FormattedMessage id="deposit-to-project-wallet" />
                </DialogTitle>
                <DialogContent>
                    <Grid container sx={{ py: 2, alignItems: 'center', flex: 1, justifyContent: 'flex-start' }}>
                        <Grid item xs={12}>
                            <Typography component="h2" sx={{ py: 2, textAlign: 'start' }}>
                                <FormattedMessage id="amount-to-be-deposit" />
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <FormattedMessage id="deposit-amount-placeholder">
                                    {(msg) => (
                                        <NumberInput
                                            className="number-control"
                                            name="depositAmount"
                                            value={depositAmt}
                                            min={0.01}
                                            step={0.01}
                                            precision={2}
                                            onChange={(value?: number) => {
                                                if (!value) return;
                                                if (value >= 0.01) {
                                                    setDepositAmt(value);
                                                }
                                            }}
                                            placeholder={`${msg}`}
                                        />
                                    )}
                                </FormattedMessage>

                                <FormControl>
                                    <Select value={depositCurrency} defaultValue="SOL" onChange={(e) => setDepositCurrency(e.target.value)}>
                                        <MenuItem value="SOL">SOL</MenuItem>
                                        <MenuItem value="USDC">USDC</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <Divider />
                <DialogActions sx={{ pt: 3, px: 2 }}>
                    <Button variant="outlined" color="primary" onClick={() => setShowDepositDialog(false)}>
                        <FormattedMessage id="cancel" />
                    </Button>
                    <LoadingButton
                        variant="contained"
                        color="secondary"
                        loading={isDepositing}
                        onClick={async () => {
                            if (depositCurrency === 'SOL') {
                                await depositSol();
                            } else {
                                await depositUSDC();
                            }
                        }}
                    >
                        <FormattedMessage id="deposit" />
                    </LoadingButton>
                </DialogActions>
            </Dialog>
            <Dialog
                open={showWithdrawDialog}
                onClose={() => {
                    setShowWithdrawDialog(false);
                }}
            >
                <DialogTitle>
                    <FormattedMessage id="withdraw-from-project-wallet" />
                </DialogTitle>
                <DialogContent>
                    <Grid container sx={{ py: 2, alignItems: 'center', flex: 1, justifyContent: 'flex-start' }}>
                        <Grid item xs={12}>
                            <Typography component="h2" sx={{ py: 2, textAlign: 'start' }}>
                                <FormattedMessage id="amount-to-be-withdraw" />
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <FormattedMessage id="withdraw-amount-placeholder">
                                    {(msg) => (
                                        <NumberInput
                                            className="number-control"
                                            name="withdrawAmount"
                                            value={withdrawAmt}
                                            min={0.000001}
                                            step={0.01}
                                            precision={10}
                                            onChange={(value?: number) => {
                                                if (!value) return;
                                                if (value >= 0.000001) {
                                                    setWithdrawAmt(value);
                                                }
                                            }}
                                            placeholder={`${msg}`}
                                        />
                                    )}
                                </FormattedMessage>

                                <FormControl>
                                    <Select
                                        value={withdrawCurrency}
                                        defaultValue="SOL"
                                        onChange={(e) => {
                                            setWithdrawCurrency(e.target.value);
                                            setWithdrawAmt(e.target.value === 'SOL' ? maxBalance.solBalance : maxBalance.balance);
                                        }}
                                    >
                                        <MenuItem value="SOL">SOL</MenuItem>
                                        <MenuItem value="USDC">USDC</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <Divider />
                <DialogActions sx={{ pt: 3, px: 2 }}>
                    <Button variant="outlined" color="primary" onClick={() => setShowWithdrawDialog(false)}>
                        <FormattedMessage id="cancel" />
                    </Button>
                    <LoadingButton
                        variant="contained"
                        color="secondary"
                        loading={isWithdrawing}
                        onClick={async () => {
                            await withdraw();
                        }}
                    >
                        <FormattedMessage id="withdraw" />
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    );
}
