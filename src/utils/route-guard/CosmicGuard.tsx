import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// web3 imports
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// project imports
import { useAccess } from 'hooks/useAccess';
import { useToasts } from 'hooks/useToasts';
import defaultConfig from 'config';
import { GuardProps } from 'types';
import Loader from 'components/Loader';

/**
 * Cosmic Astronauts guard for routes having a CAS NFT required to visit
 * @param {PropTypes.node} children children element/node
 */
const CosmicGuard = ({ children }: GuardProps) => {
    const { showErrorToast } = useToasts();
    const { checkCosmicAccess } = useAccess();
    const { publicKey, connected } = useWallet();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);

    async function findCosmicAuth() {
        if (publicKey) {
            const hasAccess = await checkCosmicAccess(publicKey);
            if (!hasAccess) {
                showErrorToast('You do not have access to these routes, purchase a Cosmic Astronaut to gain access.');
                navigate(defaultConfig.defaultPath, { replace: true });
            }
        }
    }

    useEffect(() => {
        if (publicKey) {
            findCosmicAuth().then(() => {
                setIsLoading(false);
            });
        }
    }, [connected]);

    if (isLoading) {
        return <Loader />;
    }

    return children;
};

export default CosmicGuard;
