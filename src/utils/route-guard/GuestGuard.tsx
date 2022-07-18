import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// web3 imports
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// project imports
import defaultConfig from 'config';
import { GuardProps } from 'types';

/**
 * Guest guard for routes having no auth required
 * @param {PropTypes.node} children children element/node
 */
const GuestGuard = ({ children }: GuardProps) => {
    const { connected, publicKey } = useWallet();
    const { connection } = useConnection();
    const navigate = useNavigate();

    useEffect(() => {
        if (connected) {
            navigate(defaultConfig.defaultPath, { replace: true });
        }
    }, [connected, navigate]);

    return children;
};

export default GuestGuard;
