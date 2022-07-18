import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// web3 imports
import { useWallet } from '@solana/wallet-adapter-react';

// project imports
import { GuardProps } from 'types';

const AuthGuard = ({ children }: GuardProps) => {
    const { connected, publicKey } = useWallet();
    const navigate = useNavigate();

    useEffect(() => {
        if (!connected) {
            navigate('login', { replace: true });
        }
    }, [connected, navigate]);

    return children;
};

export default AuthGuard;
