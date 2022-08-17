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
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
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
                            <TableRow
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0
                                    }
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    <Typography variant="h5" fontWeight="700" sx={{ ml: 1 }}>
                                        Core Team
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <RankMedal sx={{ borderColor: '#c77e23', backgroundColor: '#c77e23' }}>
                                        <VerifiedUserIcon style={{ fontSize: 14 }} />
                                        <Typography variant="body2">Core Team</Typography>
                                    </RankMedal>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body1">Special Rank</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0
                                    }
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    <Typography variant="h5" fontWeight="700" sx={{ ml: 1 }}>
                                        Staff
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <RankMedal sx={{ borderColor: '#bd4131', backgroundColor: '#bd4131' }}>
                                        <VerifiedUserIcon style={{ fontSize: 14 }} />
                                        <Typography variant="body2">Staff</Typography>
                                    </RankMedal>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body1">Special Rank</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0
                                    }
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    <Typography variant="h5" fontWeight="700" sx={{ ml: 1 }}>
                                        Site Developer
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <RankMedal sx={{ borderColor: '#1c0032', backgroundColor: '#1c0032' }}>
                                        <BuildIcon style={{ fontSize: 14 }} />
                                        <Typography variant="body2">Site Developer</Typography>
                                    </RankMedal>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body1">Special Rank</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0
                                    }
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    <Typography variant="h5" fontWeight="700" sx={{ ml: 1 }}>
                                        Retired Staff
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <RankMedal sx={{ borderColor: '#0c58e6', backgroundColor: '#0c58e6' }}>
                                        <GavelIcon style={{ fontSize: 14 }} />
                                        <Typography variant="body2">Retired Staff</Typography>
                                    </RankMedal>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Thank you for your commitment to making Vaporize a better place." placement="top">
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
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                            <TableRow
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0
                                    }
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    <Typography variant="h5" fontWeight="700" sx={{ ml: 1 }}>
                                        Beta Tester
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <RankMedal sx={{ borderColor: '#5e355e', backgroundColor: '#5e355e' }}>
                                        <BugReportIcon style={{ fontSize: 14 }} />
                                        <Typography variant="body2">Beta Tester</Typography>
                                    </RankMedal>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Thank you for your time to help us find bugs and improve the site." placement="top">
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
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                            <TableRow
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0
                                    }
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    <Typography variant="h5" fontWeight="700" sx={{ ml: 1 }}>
                                        Supporter
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <RankMedal
                                        sx={{
                                            borderColor: '#ff0052',
                                            background: 'linear-gradient(45deg,rgb(249,9,9) 0%,rgb(255,25,121) 50%,rgb(243,119,227) 100%)'
                                        }}
                                    >
                                        <FavoriteBorderIcon style={{ fontSize: 14 }} />
                                        <Typography variant="body2">Supporter</Typography>
                                    </RankMedal>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Thank you for supporting the site and helping us keep it running." placement="top">
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
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                            <TableRow
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0
                                    }
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    <Typography variant="h5" fontWeight="700" sx={{ ml: 1 }}>
                                        Rated Awesome
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <RankMedal
                                        sx={{
                                            borderColor: '#5254b5',
                                            background:
                                                'linear-gradient( -90deg,rgb(152,69,204) 0%,rgb(113,88,204) 20%,rgb(72,106,161) 45%,rgb(79,98,195) 62%,rgb(82,83,180) 79%,rgb(103,62,170) 98%)'
                                        }}
                                    >
                                        <GroupsIcon style={{ fontSize: 14 }} />
                                        <Typography variant="body2">Rated Awesome</Typography>
                                    </RankMedal>
                                </TableCell>
                                <TableCell>
                                    <Tooltip
                                        title="Must be active within the community anad stand out as a great member and role model."
                                        placement="top"
                                    >
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
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                            <TableRow
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0
                                    }
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    <Typography variant="h5" fontWeight="700" sx={{ ml: 1 }}>
                                        Discord Elite
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <RankMedal sx={{ borderColor: '#7288da', backgroundColor: '#7288da' }}>
                                        <StarBorderIcon style={{ fontSize: 14 }} />
                                        <Typography variant="body2">Discord Elite</Typography>
                                    </RankMedal>
                                </TableCell>
                                <TableCell>
                                    <Tooltip
                                        title="Awarded to the most active members in the Vaporize Finance Discoord Server."
                                        placement="top"
                                    >
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
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                            <TableRow
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0
                                    }
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    <Typography variant="h5" fontWeight="700" sx={{ ml: 1 }}>
                                        Summer 2022
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <RankMedal sx={{ borderColor: '#3c9402', backgroundColor: '#3c9402' }}>
                                        <ForestIcon style={{ fontSize: 14 }} />
                                        <Typography variant="body2">Summer 2022</Typography>
                                    </RankMedal>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Entered into a summer giveaway." placement="top">
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
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                            <TableRow
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0
                                    }
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    <Typography variant="h5" fontWeight="700" sx={{ ml: 1 }}>
                                        Idea Guy
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <RankMedal sx={{ borderColor: '#942b94', backgroundColor: '#942b94' }}>
                                        <TipsAndUpdatesOutlinedIcon style={{ fontSize: 14 }} />
                                        <Typography variant="body2">Idea Guy</Typography>
                                    </RankMedal>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Have a suggestion of yours successfully implemented." placement="top">
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
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                            <TableRow
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0
                                    }
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    <Typography variant="h5" fontWeight="700" sx={{ ml: 1 }}>
                                        Wizard
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <RankMedal
                                        sx={{
                                            borderColor: '#942b94',
                                            background:
                                                'linear-gradient( -90deg,rgb(82,83,180) 0%,rgb(103,62,170) 0%,rgb(160,49,191) 0%,rgb(143,60,197) 40%,rgb(132,70,200) 85%,rgb(105,61,175) 96%)'
                                        }}
                                    >
                                        <AutoAwesomeIcon style={{ fontSize: 14 }} />
                                        <Typography variant="body2">Wizard</Typography>
                                    </RankMedal>
                                </TableCell>
                                <TableCell>
                                    <Tooltip
                                        title="Must be a Wizard, prove you are a wizard by showing your true wizard skills."
                                        placement="top"
                                    >
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
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                            <TableRow
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0
                                    }
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    <Typography variant="h5" fontWeight="700" sx={{ ml: 1 }}>
                                        Ninja
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <RankMedal sx={{ borderColor: '#000', backgroundColor: '#000' }}>
                                        <HailIcon style={{ fontSize: 14 }} />
                                        <Typography variant="body2">Ninja</Typography>
                                    </RankMedal>
                                </TableCell>
                                <TableCell>
                                    <Tooltip
                                        title="Must be a Ninja, prove you are a ninja by showing your true wizard skills."
                                        placement="top"
                                    >
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
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                            <TableRow
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0
                                    }
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    <Typography variant="h5" fontWeight="700" sx={{ ml: 1 }}>
                                        Quest King
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <RankMedal sx={{ borderColor: '#015627', backgroundColor: '#015627' }}>
                                        <BoltIcon style={{ fontSize: 14 }} />
                                        <Typography variant="body2">Quest King</Typography>
                                    </RankMedal>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Obtain level 10 from questing within the platform." placement="top">
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                textDecoration: 'underline',
                                                '&:hover': {
                                                    cursor: 'help'
                                                }
                                            }}
                                        >
                                            10
                                        </Typography>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                            <TableRow
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0
                                    }
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    <Typography variant="h5" fontWeight="700" sx={{ ml: 1 }}>
                                        Quest Master
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <RankMedal sx={{ borderColor: '#3f2e8c', backgroundColor: '#3f2e8c' }}>
                                        <BoltIcon style={{ fontSize: 14 }} />
                                        <Typography variant="body2">Quest Master</Typography>
                                    </RankMedal>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Obtain level 25 from questing within the platform." placement="top">
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                textDecoration: 'underline',
                                                '&:hover': {
                                                    cursor: 'help'
                                                }
                                            }}
                                        >
                                            25
                                        </Typography>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                            <TableRow
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0
                                    }
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    <Typography variant="h5" fontWeight="700" sx={{ ml: 1 }}>
                                        Quest Elite
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <RankMedal sx={{ borderColor: '#a3007a', backgroundColor: '#a3007a' }}>
                                        <BoltIcon style={{ fontSize: 14 }} />
                                        <Typography variant="body2">Quest Elite</Typography>
                                    </RankMedal>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Obtain level 50 from questing within the platform." placement="top">
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                textDecoration: 'underline',
                                                '&:hover': {
                                                    cursor: 'help'
                                                }
                                            }}
                                        >
                                            50
                                        </Typography>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                            <TableRow
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0
                                    }
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    <Typography variant="h5" fontWeight="700" sx={{ ml: 1 }}>
                                        V1 Launch
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <RankMedal sx={{ borderColor: '#211b21', backgroundColor: '#211b21' }}>
                                        <PublicIcon style={{ fontSize: 14 }} />
                                        <Typography variant="body2">V1 Launch</Typography>
                                    </RankMedal>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Thank you for being apart of the launch of Version 1!" placement="top">
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
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    );
};

export default Badges;
