import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Box, Button, Avatar, ClickAwayListener, Grid, Paper, Popper, useMediaQuery } from '@mui/material';

// project imps
import MainCard from './MainCard';
import Transitions from 'components/@extended/Transitions';
import { shortenAddress } from 'utils/utils';

// assets
import { IconExternalLink } from '@tabler/icons';
import DefaultUser from 'assets/images/users/user-image.jpg';
import Clipboard from 'assets/images/icons/clipboard.svg';

const UserLink = ({ user }: { user: any }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

    const [open, setOpen] = useState(false);
    const anchorRef = useRef<any>(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: MouseEvent | TouchEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <>
            <strong>
                <Link
                    to={`/account/${user.wallet}/portfolio`}
                    ref={anchorRef}
                    onMouseEnter={handleToggle}
                    // onMouseLeave={handleToggle}
                    style={{
                        textDecoration: 'none',
                        marginLeft: 5,
                        color: theme.palette.secondary.main
                    }}
                >
                    {user.vanity ? user.vanity : shortenAddress(user.wallet, 7)}
                </Link>
            </strong>

            <Popper
                placement="bottom"
                open={open}
                anchorEl={anchorRef.current}
                transition
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [matchesXs ? 5 : 0, 20]
                            }
                        },
                        {
                            name: 'arrow',
                            enabled: true,
                            options: {
                                element: anchorRef.current
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <ClickAwayListener onClickAway={handleClose}>
                        <Transitions position={matchesXs ? 'bottom' : 'bottom'} in={open} {...TransitionProps}>
                            <Paper>
                                {open && (
                                    <MainCard elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                        <Grid container direction="column" spacing={2}>
                                            <Grid item xs={12}>
                                                <Box display="flex" flexDirection="column" sx={{ p: 2 }}>
                                                    <Box display="flex" flexDirection="row">
                                                        <Avatar
                                                            alt="User Image"
                                                            src={user.avatarURI ? user.avatarURI : DefaultUser}
                                                            sx={{
                                                                '&:hover': {
                                                                    cursor: 'pointer',
                                                                    transition: 'all .15s ease-in-out',
                                                                    filter: 'brightness(0.4)'
                                                                },
                                                                width: { xs: 64, sm: 64, md: 64 },
                                                                height: { xs: 64, sm: 64, md: 64 }
                                                            }}
                                                        />
                                                        <Stack justifyContent="center" sx={{ px: 2 }}>
                                                            <Typography variant="h3" color="inherit">
                                                                {user.vanity ? user.vanity : shortenAddress(user.wallet, 7)}
                                                            </Typography>
                                                            <Box
                                                                display="flex"
                                                                justifyContent="center"
                                                                alignItems="center"
                                                                sx={{
                                                                    borderRadius: 1,
                                                                    px: 0.2,
                                                                    border: '1px solid rgba(213, 217, 233, 0.1)'
                                                                }}
                                                            >
                                                                <Typography variant="caption" color="inherit" sx={{ fontSize: '10px' }}>
                                                                    {shortenAddress(user.wallet, 7)}
                                                                </Typography>
                                                                {/* <img
                                                                    src={Clipboard}
                                                                    alt="Clip/Copy"
                                                                    style={{ fontSize: '7px', marginLeft: 5 }}
                                                                /> */}
                                                            </Box>
                                                        </Stack>
                                                    </Box>

                                                    <Box display="flex" flexDirection="row" sx={{ mt: 2, gap: 1 }}>
                                                        <Button
                                                            color="secondary"
                                                            size="small"
                                                            variant="contained"
                                                            onClick={() => navigate(`/account/${user.wallet}/portfolio`)}
                                                            fullWidth
                                                        >
                                                            View Profile
                                                        </Button>
                                                        <Button
                                                            color="primary"
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() =>
                                                                window.open(`https://solscan.io/account/${user.wallet}`, '_blank')
                                                            }
                                                            // endIcon={<IconExternalLink size="0.975rem" />}
                                                            fullWidth
                                                        >
                                                            See Explorer
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </MainCard>
                                )}
                            </Paper>
                        </Transitions>
                    </ClickAwayListener>
                )}
            </Popper>
        </>
    );
};

export default UserLink;
