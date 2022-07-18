import React, { useContext, useEffect, useState } from 'react';

import { HyperspaceClient } from 'hyperspace-client-js';
import { HS_API_KEY } from 'config';

export interface HyperspaceContextState {
    client: HyperspaceClient;
}

const HyperspaceContext = React.createContext<HyperspaceContextState | null>(null);

export function HyperspaceProvider({ children = null }: { children: any }) {
    const [client, setClient] = useState<HyperspaceClient>(new HyperspaceClient(HS_API_KEY));

    useEffect(() => {
        console.log(`constructing HyperspaceClient with ${HS_API_KEY}`);
        setClient(new HyperspaceClient(HS_API_KEY));
    }, [setClient]);

    return <HyperspaceContext.Provider value={{ client }}>{children}</HyperspaceContext.Provider>;
}

export const useHyperspace = () => {
    const context = useContext(HyperspaceContext);
    return context as HyperspaceContextState;
};

export const useHyperspaceClient = () => {
    const { client } = useHyperspace();
    console.log(client);
    return client;
};
