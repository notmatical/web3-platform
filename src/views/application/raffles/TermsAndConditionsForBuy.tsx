import { Box, List, ListItemIcon, ListItemText, Typography, useTheme } from '@mui/material';
import MainCard from 'components/MainCard';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { MAX_BUYING_TICKET } from 'config/config';

export const TermsAndConditionsForBuy = () => {
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
                    <ListItemText primary="All NFT prizes are held in escrow and can be claimed by the winner or creator once the draw is done." />
                </Box>
                <Box display="flex" flexDirection="row" alignItems="center">
                    <ListItemIcon sx={{ minWidth: '15px' }}>
                        <FiberManualRecordIcon sx={{ fontSize: '0.5rem' }} />
                    </ListItemIcon>
                    <ListItemText primary="Raffle tickets cannot be refunded once bought." />
                </Box>
                <Box display="flex" flexDirection="row" alignItems="center">
                    <ListItemIcon sx={{ minWidth: '15px' }}>
                        <FiberManualRecordIcon sx={{ fontSize: '0.5rem' }} />
                    </ListItemIcon>
                    <ListItemText primary="Raffle tickets will not be refunded if you did not win the raffle." />
                </Box>
                <Box display="flex" flexDirection="row" alignItems="center">
                    <ListItemIcon sx={{ minWidth: '15px' }}>
                        <FiberManualRecordIcon sx={{ fontSize: '0.5rem' }} />
                    </ListItemIcon>
                    <ListItemText
                        primary={`You can only buy ${(MAX_BUYING_TICKET * 100).toFixed(0)}% of total tickets in one transaction.`}
                    />
                </Box>
            </List>
        </MainCard>
    );
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    TermsAndConditionsForBuy
};
