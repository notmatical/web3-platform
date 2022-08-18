import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import {
    Grid,
    Box,
    Stack,
    Button,
    Divider,
    Avatar,
    Tooltip,
    Typography,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    CircularProgress,
    IconButton
} from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';

// assets
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BuildIcon from '@mui/icons-material/Build';
import GavelIcon from '@mui/icons-material/Gavel';
import BugReportIcon from '@mui/icons-material/BugReport';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import GroupsIcon from '@mui/icons-material/Groups';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HailIcon from '@mui/icons-material/Hail';
import ForestIcon from '@mui/icons-material/Forest';
import HandshakeIcon from '@mui/icons-material/Handshake';
import BoltIcon from '@mui/icons-material/Bolt';
import PublicIcon from '@mui/icons-material/Public';

// styled
const RankMedal = styled(Box)({
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '3px',
    // border: '1px solid transparent',
    position: 'relative',
    height: '32px',
    lineHeight: '32px',
    textAlign: 'center',
    padding: '0 15px',
    textTransform: 'uppercase',
    boxShadow:
        '0 2px 5px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.3), inset 0 0 15px rgba(255,255,255,.3), inset 0 20px 0 rgba(255,255,255,.05)',
    background:
        '-webkit-gradient(linear, left top, left bottom, color-stop(0%, rgba(255,255,255,0.2)), color-stop(100%, rgba(255,255,255,0)))',
    overflow: 'hidden',
    '& p': {
        textShadow: '1px 1px 5px rgba(0, 0, 0, 0.6)',
        color: '#fff',
        fontWeight: '700 !important',
        fontSize: '14px !important'
    },
    '& svg': {
        display: 'block',
        float: 'left',
        height: '20px',
        lineHeight: '30px',
        width: '30px',
        color: '#fff',
        margin: '0 8px 0 -15px',
        overflow: 'hidden',
        textAlign: 'center',
        // backgroundColor: 'rgba(0, 0, 0, 0.3)',
        opacity: '0.7'
    }
});

const AvailableBadges = [
    {
        title: 'Core Team',
        icon: <VerifiedUserIcon style={{ fontSize: 14 }} />,
        borderColor: '#c77e23',
        backgroundColor: '#c77e23'
    },
    {
        title: 'Staff',
        icon: <VerifiedUserIcon style={{ fontSize: 14 }} />,
        borderColor: '#bd4131',
        backgroundColor: '#bd4131'
    },
    {
        title: 'Site Developer',
        icon: <BuildIcon style={{ fontSize: 14 }} />,
        borderColor: '#1c0032',
        backgroundColor: '#1c0032'
    },
    {
        title: 'Retired Staff',
        icon: <GavelIcon style={{ fontSize: 14 }} />,
        borderColor: '#0c58e6',
        backgroundColor: '#0c58e6',
        tooltipTitle: 'Thank you for your commitment to making Vaporize a better place.'
    },
    {
        title: 'Beta Tester',
        icon: <BugReportIcon style={{ fontSize: 14 }} />,
        borderColor: '#5e355e',
        backgroundColor: '#5e355e',
        tooltipTitle: 'Thank you for your time to help us find bugs and improve the site.'
    },
    {
        title: 'Supporter',
        icon: <FavoriteBorderIcon style={{ fontSize: 14 }} />,
        borderColor: '#ff0052',
        background: 'linear-gradient(45deg, rgb(249,9,9) 0%, rgb(255,25,121) 50%, rgb(243,119,227) 100%)',
        tooltipTitle: 'Thank you for supporting the site and helping us keep it running.'
    },
    {
        title: 'Rated Awesome',
        icon: <GroupsIcon style={{ fontSize: 14 }} />,
        borderColor: '#5254b5',
        background:
            'linear-gradient(-90deg, rgb(152,69,204) 0%, rgb(113,88,204) 20%, rgb(72,106,161) 45%, rgb(79,98,195) 62%, rgb(82,83,180) 79%, rgb(103,62,170) 98%)',
        tooltipTitle: 'Must be active within the community anad stand out as a great member and role model.'
    },
    {
        title: 'Discord Elite',
        icon: <StarBorderIcon style={{ fontSize: 14 }} />,
        borderColor: '#7288da',
        backgroundColor: '#7288da',
        tooltipTitle: 'Awarded to the most active members in the Vaporize Finance Discoord Server.'
    },
    {
        title: 'Summer 2022',
        icon: <ForestIcon style={{ fontSize: 14 }} />,
        borderColor: '#3c9402',
        backgroundColor: '#3c9402',
        tooltipTitle: 'Entered into a summer giveaway.'
    },
    {
        title: 'Solana Miami 2022',
        icon: <HandshakeIcon style={{ fontSize: 14 }} />,
        borderColor: '#ffb428',
        backgroundColor: '#ffb428',
        tooltipTitle: 'Met the team at our mixer in the crypto lounge of Solana Miami 2022.'
    },
    {
        title: 'Idea Guy',
        icon: <TipsAndUpdatesOutlinedIcon style={{ fontSize: 14 }} />,
        borderColor: '#942b94',
        backgroundColor: '#942b94',
        tooltipTitle: 'Have a suggestion of yours successfully implemented.'
    },
    {
        title: 'Wizard',
        icon: <AutoAwesomeIcon style={{ fontSize: 14 }} />,
        borderColor: '#942b94',
        background:
            'linear-gradient(-90deg,rgb(82,83,180) 0%, rgb(103,62,170) 0%, rgb(160,49,191) 0%, rgb(143,60,197) 40%, rgb(132,70,200) 85%, rgb(105,61,175) 96%)',
        tooltipTitle: 'Must be a Wizard, prove you are a wizard by showing your true wizard skills.'
    },
    {
        title: 'Ninja',
        icon: <HailIcon style={{ fontSize: 14 }} />,
        borderColor: '#000',
        backgroundColor: '#000',
        tooltipTitle: 'Must be a Ninja, prove you are a ninja by showing your true ninja skills.'
    },
    {
        title: 'Quest King',
        icon: <BoltIcon style={{ fontSize: 14 }} />,
        borderColor: '#015627',
        backgroundColor: '#015627',
        tooltipTitle: 'Obtain level 10 from questing within the platform.',
        numbered: true,
        requirement: 10
    },
    {
        title: 'Quest Master',
        icon: <BoltIcon style={{ fontSize: 14 }} />,
        borderColor: '#3f2e8c',
        backgroundColor: '#3f2e8c',
        tooltipTitle: 'Obtain level 25 from questing within the platform.',
        numbered: true,
        requirement: 25
    },
    {
        title: 'Quest Elite',
        icon: <BoltIcon style={{ fontSize: 14 }} />,
        borderColor: '#a3007a',
        backgroundColor: '#a3007a',
        tooltipTitle: 'Obtain level 50 from questing within the platform.',
        numbered: true,
        requirement: 50
    },
    {
        title: 'V1 Launch',
        icon: <PublicIcon style={{ fontSize: 14 }} />,
        borderColor: '#211b21',
        backgroundColor: '#211b21',
        tooltipTitle: 'Thank you for being apart of the launch of Version 1!'
    }
];

const Badges = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="project monitor table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Badge Title</TableCell>
                                <TableCell>Badge Image</TableCell>
                                <TableCell>Requirements</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {AvailableBadges.map((badge: any, index: any) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0
                                        }
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        <Typography variant="h5" fontWeight="700" sx={{ ml: 1 }}>
                                            {badge.title}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {badge.background ? (
                                            <RankMedal sx={{ borderColor: badge.borderColor, background: badge.background }}>
                                                {badge.icon}
                                                <Typography variant="body2">{badge.title}</Typography>
                                            </RankMedal>
                                        ) : (
                                            <RankMedal sx={{ borderColor: badge.borderColor, backgroundColor: badge.backgroundColor }}>
                                                {badge.icon}
                                                <Typography variant="body2">{badge.title}</Typography>
                                            </RankMedal>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {badge.tooltipTitle ? (
                                            <Tooltip title={badge.tooltipTitle} placement="top">
                                                {badge.numbered ? (
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            textDecoration: 'underline',
                                                            '&:hover': {
                                                                cursor: 'help'
                                                            }
                                                        }}
                                                    >
                                                        {badge.requirement}
                                                    </Typography>
                                                ) : (
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            textDecoration: 'underline',
                                                            '&:hover': {
                                                                cursor: 'help'
                                                            }
                                                        }}
                                                    >
                                                        Special Rank
                                                    </Typography>
                                                )}
                                            </Tooltip>
                                        ) : (
                                            <Typography variant="body1">Special Rank</Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    );
};

export default Badges;
