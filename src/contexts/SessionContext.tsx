import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { SessionContext } from 'types/auth';

const SESSION_KEY = 'MINX_SESSION';

const DEFAULT_STATE = {
    user: null,
    loggedIn: false
};

// local
const getLocal = () => {
    const localState = localStorage.getItem(SESSION_KEY);
    return localState ? JSON.parse(localState) : DEFAULT_STATE;
};

const setLocal = (session: any) => {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

const removeLocal = () => {
    localStorage.removeItem(SESSION_KEY);
};

// reducer
const reducer = (session: any, newSession: any) => {
    if (newSession === null) {
        removeLocal();
        return DEFAULT_STATE;
    }

    return { ...session, ...newSession };
};

// context
const Context = createContext<SessionContext>({} as SessionContext);
export const useSession = () => useContext(Context);

// providere
export const SessionProvider: React.FC = ({ children }) => {
    const [session, setSession] = useReducer(reducer, getLocal());

    useEffect(() => {
        setLocal(session);
    }, [session]);

    return (
        <Context.Provider value={{ ...session, setSession }}>
            {children}
        </Context.Provider>
    );
};
