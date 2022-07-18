import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, IconButton } from '@mui/material';

// project imports
import useConfig from 'hooks/useConfig';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { IconSettings } from '@tabler/icons';

const PaletteSection = () => {
    const theme = useTheme();

    // drawer on/off
    const [open, setOpen] = useState(false);
    const handleToggle = () => {
        setOpen(!open);
    };

    return (
        <>
            <Box
                sx={{
                    ml: 2,
                    mr: 3,
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
        </>
    );
};

export default PaletteSection;
