import { ReactElement, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
    TablePagination,
    CircularProgress,
    IconButton
} from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import MainCard from 'components/MainCard';

// assets
import { CloseCircleOutlined } from '@ant-design/icons';

// badge icons
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

// styled components
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
        key: 'CORE_TEAM',
        title: 'Core Team',
        icon: <VerifiedUserIcon style={{ fontSize: 14 }} />,
        borderColor: '#c77e23',
        backgroundColor: '#c77e23'
    },
    {
        key: 'STAFF',
        title: 'Staff',
        icon: <VerifiedUserIcon style={{ fontSize: 14 }} />,
        borderColor: '#bd4131',
        backgroundColor: '#bd4131'
    },
    {
        key: 'SITE_DEVELOPER',
        title: 'Site Developer',
        icon: <BuildIcon style={{ fontSize: 14 }} />,
        borderColor: '#1c0032',
        backgroundColor: '#1c0032'
    },
    {
        key: 'RETIRED_STAFF',
        title: 'Retired Staff',
        icon: <GavelIcon style={{ fontSize: 14 }} />,
        borderColor: '#0c58e6',
        backgroundColor: '#0c58e6',
        tooltipTitle: 'Thank you for your commitment to making Vaporize a better place.'
    },
    {
        key: 'BETA_TESTER',
        title: 'Beta Tester',
        icon: <BugReportIcon style={{ fontSize: 14 }} />,
        borderColor: '#5e355e',
        backgroundColor: '#5e355e',
        tooltipTitle: 'Thank you for your time to help us find bugs and improve the site.'
    },
    {
        key: 'SUPPORTER',
        title: 'Supporter',
        icon: <FavoriteBorderIcon style={{ fontSize: 14 }} />,
        borderColor: '#ff0052',
        background: 'linear-gradient(45deg, rgb(249,9,9) 0%, rgb(255,25,121) 50%, rgb(243,119,227) 100%)',
        tooltipTitle: 'Thank you for supporting the site and helping us keep it running.'
    },
    {
        key: 'RATED_AWESOME',
        title: 'Rated Awesome',
        icon: <GroupsIcon style={{ fontSize: 14 }} />,
        borderColor: '#5254b5',
        background:
            'linear-gradient(-90deg, rgb(152,69,204) 0%, rgb(113,88,204) 20%, rgb(72,106,161) 45%, rgb(79,98,195) 62%, rgb(82,83,180) 79%, rgb(103,62,170) 98%)',
        tooltipTitle: 'Must be active within the community anad stand out as a great member and role model.'
    },
    {
        key: 'DISCORD_ELITE',
        title: 'Discord Elite',
        icon: <StarBorderIcon style={{ fontSize: 14 }} />,
        borderColor: '#7288da',
        backgroundColor: '#7288da',
        tooltipTitle: 'Awarded to the most active members in the Vaporize Finance Discoord Server.'
    },
    {
        key: 'SUMMER_2022',
        title: 'Summer 2022',
        icon: <ForestIcon style={{ fontSize: 14 }} />,
        borderColor: '#3c9402',
        backgroundColor: '#3c9402',
        tooltipTitle: 'Entered into a summer giveaway.'
    },
    {
        key: 'SOLANA_MIAMI_2022',
        title: 'Solana Miami 2022',
        icon: <HandshakeIcon style={{ fontSize: 14 }} />,
        borderColor: '#ffb428',
        backgroundColor: '#ffb428',
        tooltipTitle: 'Met the team at our mixer in the crypto lounge of Solana Miami 2022.'
    },
    {
        key: 'IDEA_GUY',
        title: 'Idea Guy',
        icon: <TipsAndUpdatesOutlinedIcon style={{ fontSize: 14 }} />,
        borderColor: '#942b94',
        backgroundColor: '#942b94',
        tooltipTitle: 'Have a suggestion of yours successfully implemented.'
    },
    {
        key: 'WIZARD',
        title: 'Wizard',
        icon: <AutoAwesomeIcon style={{ fontSize: 14 }} />,
        borderColor: '#942b94',
        background:
            'linear-gradient(-90deg,rgb(82,83,180) 0%, rgb(103,62,170) 0%, rgb(160,49,191) 0%, rgb(143,60,197) 40%, rgb(132,70,200) 85%, rgb(105,61,175) 96%)',
        tooltipTitle: 'Must be a Wizard, prove you are a wizard by showing your true wizard skills.'
    },
    {
        key: 'NINJA',
        title: 'Ninja',
        icon: <HailIcon style={{ fontSize: 14 }} />,
        borderColor: '#000',
        backgroundColor: '#000',
        tooltipTitle: 'Must be a Ninja, prove you are a ninja by showing your true ninja skills.'
    },
    {
        key: 'QUEST_KING',
        title: 'Quest King',
        icon: <BoltIcon style={{ fontSize: 14 }} />,
        borderColor: '#015627',
        backgroundColor: '#015627',
        tooltipTitle: 'Obtain level 10 from questing within the platform.',
        numbered: true,
        requirement: 10
    },
    {
        key: 'QUEST_MASTER',
        title: 'Quest Master',
        icon: <BoltIcon style={{ fontSize: 14 }} />,
        borderColor: '#3f2e8c',
        backgroundColor: '#3f2e8c',
        tooltipTitle: 'Obtain level 25 from questing within the platform.',
        numbered: true,
        requirement: 25
    },
    {
        key: 'QUEST_ELITE',
        title: 'Quest Elite',
        icon: <BoltIcon style={{ fontSize: 14 }} />,
        borderColor: '#a3007a',
        backgroundColor: '#a3007a',
        tooltipTitle: 'Obtain level 50 from questing within the platform.',
        numbered: true,
        requirement: 50
    },
    {
        key: 'V1_LAUNCH',
        title: 'V1 Launch',
        icon: <PublicIcon style={{ fontSize: 14 }} />,
        borderColor: '#211b21',
        backgroundColor: '#211b21',
        tooltipTitle: 'Thank you for being apart of the launch of Version 1!'
    }
];

const BadgesTab = ({ user }: { user: any }) => {
    const theme = useTheme();

    // table pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - user.badges.length) : 0;

    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                {user.badges && user.badges.length > 0 ? (
                    <MainCard border={false} sx={{ width: '100%', mt: 2 }} contentSX={{ p: '0 !important' }}>
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} aria-label="badge table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Achieved Badge</TableCell>
                                        <TableCell>Requirement</TableCell>
                                        <TableCell>Date Acquired</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {user.badges
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((badge: any, index: number) => {
                                            const foundBadge = AvailableBadges.find((b) => b.key === badge);
                                            return (
                                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell component="th" scope="row">
                                                        {foundBadge!.background ? (
                                                            <RankMedal
                                                                sx={{
                                                                    borderColor: foundBadge!.borderColor,
                                                                    background: foundBadge!.background
                                                                }}
                                                            >
                                                                <Typography variant="body2">{foundBadge!.title}</Typography>
                                                            </RankMedal>
                                                        ) : (
                                                            <RankMedal
                                                                sx={{
                                                                    borderColor: foundBadge!.borderColor,
                                                                    backgroundColor: foundBadge!.backgroundColor
                                                                }}
                                                            >
                                                                {foundBadge!.icon as ReactElement}
                                                                <Typography variant="body2">{foundBadge!.title}</Typography>
                                                            </RankMedal>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {foundBadge!.tooltipTitle ? (
                                                            <Tooltip title={foundBadge!.tooltipTitle} placement="top">
                                                                {foundBadge!.numbered ? (
                                                                    <Typography
                                                                        variant="body1"
                                                                        sx={{
                                                                            textDecoration: 'underline',
                                                                            '&:hover': {
                                                                                cursor: 'help'
                                                                            }
                                                                        }}
                                                                    >
                                                                        {foundBadge!.requirement}
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
                                                    <TableCell>test</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Divider />
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50]}
                            component="div"
                            count={user.badges.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </MainCard>
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
                                    No Badges Found
                                </Typography>
                                <Typography variant="subtitle2" color="inherit">
                                    There are no badges to display, go earn some!
                                </Typography>
                            </Stack>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Grid>
    );
};

export default BadgesTab;
