import { Grid, useTheme } from '@mui/material';
import RevenueCard from 'components/cards/RevenueCard';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import ShowEmployee from './showEmployees/ShowEmployee';
import ShowProjects from './showEmployees/ShowProjects';

import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
import AccountBalanceTwoToneIcon from '@mui/icons-material/AccountBalanceTwoTone';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import EqualizerTwoToneIcon from '@mui/icons-material/EqualizerTwoTone';

export default function Admin() {
    const [selectedProject, setSelectedProject] = useState<string>();
    const [numOfProjects, setNumberOfProject] = useState(0);
    const [totalUSDCBal, setTotalUSDCBal] = useState(0);
    const [totalSolBal, setTotalSolBal] = useState(0);
    const [monthlyPayout, setMonthlyPayout] = useState(0);
    const [notifyProjects, setNofifyProjects] = useState({});
    const theme = useTheme();
    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid container spacing={4} sx={{ pb: 3 }}>
                <Grid item xs={12} lg={3} sm={6}>
                    <RevenueCard
                        primary={<FormattedMessage id="projects" />}
                        secondary={numOfProjects}
                        content={<FormattedMessage id="projects-desc" />}
                        iconPrimary={AccountBalanceTwoToneIcon}
                        color={theme.palette.warning.dark}
                    />
                </Grid>

                <Grid item xs={12} lg={3} sm={6}>
                    <RevenueCard
                        primary={<FormattedMessage id="total-usdc" />}
                        secondary={totalUSDCBal}
                        content={<FormattedMessage id="total-usdc-desc" />}
                        iconPrimary={MonetizationOnTwoToneIcon}
                        color={theme.palette.info.dark}
                    />
                </Grid>

                <Grid item xs={12} lg={3} sm={6}>
                    <RevenueCard
                        primary={<FormattedMessage id="total-sol" />}
                        secondary={totalSolBal}
                        content={<FormattedMessage id="total-sol-desc" />}
                        iconPrimary={EqualizerTwoToneIcon}
                        color={theme.palette.secondary.main}
                    />
                </Grid>

                <Grid item xs={12} lg={3} sm={6}>
                    <RevenueCard
                        primary={<FormattedMessage id="monthly-outcome" />}
                        secondary={monthlyPayout}
                        content={<FormattedMessage id="monthly-outcome-desc" />}
                        iconPrimary={FormatListBulletedTwoToneIcon}
                        color={theme.palette.primary.dark}
                    />
                </Grid>
            </Grid>
            <ShowProjects
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
                setNumberOfProject={setNumberOfProject}
                setTotalUSDCBal={setTotalUSDCBal}
                setTotalSolBal={setTotalSolBal}
                notifyProjects={notifyProjects}
            />
            <ShowEmployee
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
                setMonthlyPayout={setMonthlyPayout}
                setNofifyProjects={setNofifyProjects}
            />
        </Grid>
    );
}
