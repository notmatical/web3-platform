import React, { FC, MouseEventHandler, useCallback, useMemo } from 'react';

// material ui
import { useTheme, styled } from '@mui/material/styles';
import { Button, ButtonProps } from '@mui/material';

// web3 imports
import { useWallet } from '@solana/wallet-adapter-react';

// project imports
import { useToasts } from 'hooks/useToasts';

const WalletButton = styled(Button)({
    gap: '5px'
});

const WalletConnectButton: FC<ButtonProps> = ({
    color = 'secondary',
    variant = 'contained',
    type = 'button',
    children,
    disabled,
    onClick,
    ...props
}) => {
    const { wallet, connect, connecting, connected } = useWallet();
    const { showInfoToast } = useToasts();

    const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
        (event: any) => {
            if (onClick) onClick(event);
            if (event.defaultPrevented) {
                connect().catch(() => {
                    // silent catch
                });

                showInfoToast('Your wallet has been connected');
            }
        },
        [onClick, connect]
    );

    const content = useMemo(() => {
        if (children) return children;
        if (connecting) return 'Connecting...';
        if (connected) return 'Connected';
        if (wallet) return 'Connect';
        return 'Connect Wallet';
    }, [children, connecting, connected, wallet]);

    return (
        <WalletButton
            color={color}
            variant={variant}
            type={type}
            onClick={handleClick}
            disabled={disabled || !wallet || connecting || connected}
            {...props}
        >
            {content}
        </WalletButton>
    );
};

export default WalletConnectButton;
