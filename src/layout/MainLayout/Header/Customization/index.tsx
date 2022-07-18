import { useMemo, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Accordion, AccordionDetails, AccordionSummary, Box, Drawer, Stack, Typography, IconButton, Avatar } from '@mui/material';

// project import
import ThemeMode from './ThemeMode';
import ColorScheme from './ColorScheme';
import ThemeWidth from './ThemeWidth';
import ThemeFont from './ThemeFont';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import useConfig from 'hooks/useConfig';

// assets
import { IconSettings } from '@tabler/icons';
import { HighlightOutlined, BorderInnerOutlined, BgColorsOutlined, CloseCircleOutlined, FontColorsOutlined } from '@ant-design/icons';

const Customization = () => {
    const theme = useTheme();
    const { container, fontFamily, mode, presetColor } = useConfig();

    // eslint-disable-next-line
    const themeMode = useMemo(() => <ThemeMode />, [mode]);
    // eslint-disable-next-line
    const themeColor = useMemo(() => <ColorScheme />, [presetColor]);
    // eslint-disable-next-line
    const themeWidth = useMemo(() => <ThemeWidth />, [container]);
    // eslint-disable-next-line
    const themeFont = useMemo(() => <ThemeFont />, [fontFamily]);

    const [open, setOpen] = useState(false);
    const handleToggle = () => {
        setOpen(!open);
    };

    return (
        <>
            <Box
                sx={{
                    ml: 2,
                    mr: 2,
                    [theme.breakpoints.down('md')]: {
                        mr: 2
                    }
                }}
            >
                <Avatar
                    variant="rounded"
                    sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        transition: 'all .2s ease-in-out',
                        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
                        color: theme.palette.mode === 'dark' ? theme.palette.secondary.dark : theme.palette.secondary.dark,
                        '&[aria-controls="menu-list-grow"],&:hover': {
                            background: theme.palette.mode === 'dark' ? theme.palette.secondary.dark : theme.palette.secondary.dark,
                            color: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.secondary.light
                        }
                    }}
                    onClick={handleToggle}
                    color="inherit"
                >
                    <AnimateButton type="rotate">
                        <IconButton color="inherit" size="small" disableRipple>
                            <IconSettings />
                        </IconButton>
                    </AnimateButton>
                </Avatar>
            </Box>

            <Drawer
                sx={{ zIndex: 2001 }}
                anchor="right"
                onClose={handleToggle}
                open={open}
                PaperProps={{
                    sx: {
                        width: 340
                    }
                }}
            >
                {open && (
                    <MainCard
                        title="Theme Customization"
                        sx={{
                            border: 'none',
                            borderRadius: 0,
                            height: '100vh',
                            '& .MuiCardHeader-root': {
                                color: theme.palette.secondary.dark,
                                bgcolor: theme.palette.secondary.dark,
                                '& .MuiTypography-root': { fontSize: '1rem' }
                            }
                        }}
                        content={false}
                        secondary={
                            <IconButton size="small" onClick={handleToggle} sx={{ color: theme.palette.divider }}>
                                <CloseCircleOutlined style={{ fontSize: '1.15rem' }} />
                            </IconButton>
                        }
                    >
                        <Box
                            sx={{
                                height: 'calc(100vh - 64px)',
                                '& .MuiAccordion-root': {
                                    borderColor: theme.palette.divider,
                                    '& .MuiAccordionSummary-root': {
                                        bgcolor: 'transparent',
                                        flexDirection: 'row',
                                        pl: 1
                                    },
                                    '& .MuiAccordionDetails-root': {
                                        border: 'none'
                                    },
                                    '& .Mui-expanded': {
                                        color: theme.palette.primary.main
                                    }
                                }
                            }}
                        >
                            <Accordion defaultExpanded sx={{ borderTop: 'none' }}>
                                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                    <Stack direction="row" spacing={1.25} alignItems="center">
                                        <IconButton
                                            disableRipple
                                            color="secondary"
                                            sx={{ bgcolor: theme.palette.background.default, borderRadius: 1 }}
                                            onClick={handleToggle}
                                            aria-label="settings toggler"
                                        >
                                            <HighlightOutlined />
                                        </IconButton>
                                        <Stack>
                                            <Typography variant="subtitle1" color="textPrimary">
                                                Theme Mode
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                Choose your preferred theme mode.
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </AccordionSummary>
                                <AccordionDetails>{themeMode}</AccordionDetails>
                            </Accordion>
                            <Accordion defaultExpanded sx={{ borderTop: 'none' }}>
                                <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <IconButton
                                            disableRipple
                                            color="secondary"
                                            sx={{ bgcolor: theme.palette.background.default, borderRadius: 1 }}
                                            onClick={handleToggle}
                                            aria-label="settings toggler"
                                        >
                                            <BorderInnerOutlined />
                                        </IconButton>
                                        <Stack>
                                            <Typography variant="subtitle1" color="textPrimary">
                                                Layout Width
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                Choose your preferred layout.
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </AccordionSummary>
                                <AccordionDetails>{themeWidth}</AccordionDetails>
                            </Accordion>
                            <Accordion defaultExpanded sx={{ borderTop: 'none' }}>
                                <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <IconButton
                                            disableRipple
                                            color="secondary"
                                            sx={{ bgcolor: theme.palette.background.default, borderRadius: 1 }}
                                            onClick={handleToggle}
                                            aria-label="settings toggler"
                                        >
                                            <BgColorsOutlined />
                                        </IconButton>
                                        <Stack>
                                            <Typography variant="subtitle1" color="textPrimary">
                                                Color Scheme
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                Choose your preferred color scheme.
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </AccordionSummary>
                                <AccordionDetails>{themeColor}</AccordionDetails>
                            </Accordion>
                            <Accordion defaultExpanded sx={{ borderTop: 'none' }}>
                                <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <IconButton
                                            disableRipple
                                            color="secondary"
                                            sx={{ bgcolor: theme.palette.background.default, borderRadius: 1 }}
                                            onClick={handleToggle}
                                            aria-label="settings toggler"
                                        >
                                            <FontColorsOutlined />
                                        </IconButton>
                                        <Stack>
                                            <Typography variant="subtitle1" color="textPrimary">
                                                Font Family
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                Choose your preferred font family.
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </AccordionSummary>
                                <AccordionDetails>{themeFont}</AccordionDetails>
                            </Accordion>
                        </Box>
                    </MainCard>
                )}
            </Drawer>
        </>
    );
};

export default Customization;
