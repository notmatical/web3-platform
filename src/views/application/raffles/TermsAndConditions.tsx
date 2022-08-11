import { Box, List, ListItemIcon, ListItemText, Typography, useTheme } from '@mui/material';
import MainCard from 'components/MainCard';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export const TermsAndConditions = () => {
    const theme = useTheme();
    return (
        <MainCard
            sx={{
                mt: 2,
                borderRadius: 4,
                border: `2px solid ${theme.palette.secondary.dark} !important`,
                backgroundColor: 'rgba(215, 0, 39, 0.05)'
            }}
        >
            <Typography fontWeight="700" variant="h4" color="secondary.dark">
                Terms & Conditions
            </Typography>
            <List component="div" disablePadding>
                <Box display="flex" flexDirection="row" alignItems="center">
                    <ListItemIcon sx={{ minWidth: '15px' }}>
                        <FiberManualRecordIcon sx={{ fontSize: '0.5rem' }} />
                    </ListItemIcon>
                    <ListItemText primary="When you create a raffle, the NFT prize you have chosen will be transferred from your wallet into our escrow." />
                </Box>
                <Box display="flex" flexDirection="row" alignItems="center">
                    <ListItemIcon sx={{ minWidth: '15px' }}>
                        <FiberManualRecordIcon sx={{ fontSize: '0.5rem' }} />
                    </ListItemIcon>
                    <ListItemText primary="An up-front rent fee, charged in SOL will be taken in proportion to number of tickets. This will be auto refunded after the raffle concludes." />
                </Box>
                <Box display="flex" flexDirection="row" alignItems="center">
                    <ListItemIcon sx={{ minWidth: '15px' }}>
                        <FiberManualRecordIcon sx={{ fontSize: '0.5rem' }} />
                    </ListItemIcon>
                    <ListItemText primary="Raffles will proceed regardless if all tickets are sold or not." />
                </Box>
                <Box display="flex" flexDirection="row" alignItems="center">
                    <ListItemIcon sx={{ minWidth: '15px' }}>
                        <FiberManualRecordIcon sx={{ fontSize: '0.5rem' }} />
                    </ListItemIcon>
                    <ListItemText primary="The creator can end the raffle after the specified date and time." />
                </Box>
                <Box display="flex" flexDirection="row" alignItems="center">
                    <ListItemIcon sx={{ minWidth: '15px' }}>
                        <FiberManualRecordIcon sx={{ fontSize: '0.5rem' }} />
                    </ListItemIcon>
                    <ListItemText primary="The raffle should run for a minimum of 24 hours." />
                </Box>
                <Box display="flex" flexDirection="row" alignItems="center">
                    <ListItemIcon sx={{ minWidth: '15px' }}>
                        <FiberManualRecordIcon sx={{ fontSize: '0.5rem' }} />
                    </ListItemIcon>
                    <ListItemText primary="Raffles CANNOT be edited or cancelled once a ticket is sold." />
                </Box>
            </List>
        </MainCard>
    );
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    TermsAndConditions
};
