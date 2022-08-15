import { ReactElement, useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/styles';
import {
    Button,
    Avatar,
    Stack,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    Box,
    Typography,
    IconButton,
    CircularProgress,
    CardMedia
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// project imports
import { useToasts } from 'hooks/useToasts';

// assets
import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

// types
interface ConfirmLogoutModalProps {
    onCancel: () => void;
    onLogout: () => void;
}

const ConfirmLogoutModal = ({ onCancel, onLogout }: ConfirmLogoutModalProps) => {
    const theme = useTheme();
    const { showInfoToast, showErrorToast } = useToasts();

    return (
        <>
            <DialogTitle sx={{ m: 0, p: 2, pb: '0 !important' }}>
                Log out of all your accounts?
                <IconButton
                    aria-label="cloe"
                    onClick={onCancel}
                    sx={{
                        position: 'absolute',
                        right: 12,
                        top: 12,
                        color: theme.palette.grey[500]
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ px: 2, pb: '0 !important' }}>
                <Typography variant="body1" color="textPrimary" sx={{ mt: 2 }}>
                    This will remove all watched and connected addresses from the dashboard and return you to the home screen.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 3, justifyContent: 'flex-start' }}>
                <Box display="flex" flexDirection="row" sx={{ gap: 2 }}>
                    <Button variant="contained" color="primary" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={onLogout}>
                        Logout
                    </Button>
                </Box>
            </DialogActions>
        </>
    );
};

export default ConfirmLogoutModal;
