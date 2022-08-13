import { Avatar, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, useTheme } from '@mui/material';

// project imports
import MainCard from 'components/MainCard';
import ProjectCard from './ProjectCard';
import CopyAddress from 'components/CopyAddress';
import RevenueCard from 'components/cards/RevenueCard';
import { useSolPrice } from 'contexts/CoinGecko';

// third party
import { useWallet } from '@solana/wallet-adapter-react';
import { capitalize, groupBy, keys, map, sum } from 'lodash';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

// graphql
import { useQuery } from '@apollo/client';
import * as db from 'database/graphql/graphql';

// assets
import { UserOutlined } from '@ant-design/icons';
import { AccountBalanceWalletOutlined, RefreshOutlined } from '@mui/icons-material';
import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
import AccountBalanceTwoToneIcon from '@mui/icons-material/AccountBalanceTwoTone';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import EqualizerTwoToneIcon from '@mui/icons-material/EqualizerTwoTone';

type registeredwallet = {
    walletaddress: any;
    item: any;
    name: String;
    method: String;
    project: String;
    wallet: String;
    amount: String;
    time: String;
    period: String;
    key: any;
    transactionHash: any;
};

function Projects({ data, refetch }: any) {
    return (
        <>
            {data ? (
                <MainCard
                    title={<FormattedMessage id="projects" />}
                    secondary={
                        <IconButton onClick={() => refetch()}>
                            <RefreshOutlined />
                        </IconButton>
                    }
                >
                    <Grid container spacing={2}>
                        {map(data.getClaimer, (item: registeredwallet, key: any) => (
                            <Grid item xs={12} md={6} lg={4}>
                                <ProjectCard
                                    key={key}
                                    project={item.project}
                                    method={item.method}
                                    wallet={item.wallet}
                                    amount={item.amount}
                                    time={item.time}
                                    period={item.period}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </MainCard>
            ) : (
                <Grid item sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                    <h2>
                        <FormattedMessage id="no-project-joined" />
                    </h2>
                </Grid>
            )}
        </>
    );
}

export default function Employee() {
    const wallet = useWallet();

    const walletAddr = { wallet: wallet.connected ? wallet.publicKey!.toBase58() : 'Not Connected' };

    const { data, refetch } = useQuery(db.queries.GET_CLAIMER, { variables: { wallet: walletAddr.wallet } });

    const theme = useTheme();
    const solPrice = useSolPrice();

    const calcTotal = (mode = 'USD') => {
        const Weekly = moment().endOf('month').isoWeek() - moment().startOf('month').isoWeek() + 1;
        const multiplier: Record<string, number> = {
            Daily: moment().daysInMonth(),
            Weekly,
            BiWeekly: Weekly / 2,
            Monthly: 1
        };

        const currency = (cur: string) => {
            switch (mode) {
                case 'USD':
                    return cur === 'SOL' ? solPrice : 1;
                case 'SOL':
                    return cur === 'SOL' ? 1 : 0;
                case 'USDC':
                    return cur === 'SOL' ? 0 : 1;
            }
            return 1;
        };
        if (!data || !data.getClaimer.length) {
            return 0;
        }

        return sum(map(data.getClaimer, ({ amount: amt, method: cur, period: per }: any) => amt * currency(cur) * (multiplier[per] || 1)));
    };
    return (
        <Grid container spacing={2} justifyContent="center" sx={{ p: 2 }}>
            <Grid container spacing={4} sx={{ pb: 3 }}>
                {wallet.connected ? (
                    <>
                        <Grid item xs={12} lg={3} sm={6}>
                            <RevenueCard
                                primary={<FormattedMessage id="projects" />}
                                secondary={keys(groupBy(data?.getClaimer, 'project')).length || 0}
                                content={<FormattedMessage id="projects-desc-e" />}
                                iconPrimary={AccountBalanceTwoToneIcon}
                                color={theme.palette.warning.dark}
                            />
                        </Grid>

                        <Grid item xs={12} lg={3} sm={6}>
                            <RevenueCard
                                primary={<FormattedMessage id="total-usdc" />}
                                secondary={calcTotal('USDC')}
                                content={<FormattedMessage id="total-usdc-desc-e" />}
                                iconPrimary={MonetizationOnTwoToneIcon}
                                color={theme.palette.info.dark}
                            />
                        </Grid>

                        <Grid item xs={12} lg={3} sm={6}>
                            <RevenueCard
                                primary={<FormattedMessage id="total-sol" />}
                                secondary={calcTotal('SOL')}
                                content={<FormattedMessage id="total-sol-desc-e" />}
                                iconPrimary={EqualizerTwoToneIcon}
                                color={theme.palette.secondary.main}
                            />
                        </Grid>

                        <Grid item xs={12} lg={3} sm={6}>
                            <RevenueCard
                                primary={<FormattedMessage id="monthly-outcome" />}
                                secondary={calcTotal('USD')}
                                content={<FormattedMessage id="monthly-outcome-desc" />}
                                iconPrimary={FormatListBulletedTwoToneIcon}
                                color={theme.palette.primary.dark}
                            />
                        </Grid>
                        {!data || (data && !data.getClaimer.length) ? (
                            <Grid item xs={12}>
                                <MainCard title={<FormattedMessage id="staff-info" />}>
                                    <List>
                                        <ListItem>
                                            <ListItemText>
                                                <FormattedMessage id="no-project-joined" />
                                            </ListItemText>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <AccountBalanceWalletOutlined />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText>
                                                <CopyAddress address={wallet.connected && wallet.publicKey!.toBase58()} />
                                            </ListItemText>
                                        </ListItem>
                                    </List>
                                </MainCard>
                            </Grid>
                        ) : (
                            <>
                                <Grid item xs={12} md={3}>
                                    <MainCard title={<FormattedMessage id="staff-info" />}>
                                        <List>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <UserOutlined />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText>{capitalize(data.getClaimer[0].name)}</ListItemText>
                                            </ListItem>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <AccountBalanceWalletOutlined />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText>
                                                    <CopyAddress address={wallet.connected && wallet.publicKey!.toBase58()} />
                                                </ListItemText>
                                            </ListItem>
                                        </List>
                                    </MainCard>
                                </Grid>
                                <Grid item xs={12} md={9}>
                                    <Projects data={data} refetch={refetch} />
                                </Grid>
                            </>
                        )}
                    </>
                ) : (
                    <FormattedMessage id="connect-your-wallet" />
                )}
            </Grid>
        </Grid>
    );
}
