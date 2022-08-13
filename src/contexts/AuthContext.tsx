import { FC, ReactNode, createContext, useReducer, useEffect } from 'react';

// third party
import jwtDecode from 'jwt-decode';

// reducer - state management
import { SET_AUTH_USER, REMOVE_AUTH_USER } from 'store/actions';
import accountReducer from 'store/accountReducer';

// project imports
import axios from 'utils/axios';
import { useToasts } from 'hooks/useToasts';
import { useMutation } from '@apollo/client';
import * as db from 'database/graphql/graphql';

// types
import { KeyedObject } from 'types';
import { InitialLoginContextProps, AuthContextType } from 'types/auth';

// constant
// const initialState: InitialLoginContextProps = {
//     user: null,
//     isLoggedIn: false
// };

const testState = {
    user: {},
    loggedIn: false
};

const verifyToken: (st: string) => boolean = (serviceToken) => {
    if (!serviceToken) {
        return false;
    }
    const decoded: KeyedObject = jwtDecode(serviceToken);

    return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken?: string | null) => {
    if (serviceToken) {
        localStorage.setItem('serviceToken', serviceToken);
        axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
    } else {
        localStorage.removeItem('serviceToken');
        delete axios.defaults.headers.common.Authorization;
    }
};

// context & provider
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const { showInfoToast, showErrorToast } = useToasts();

    const [state, dispatch] = useReducer(accountReducer, testState);

    const tryLogin = async (address: string) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [login] = useMutation(db.mutations.LOG_IN);
        login({ variables: { address } }).then(
            (res) => {
                // dispatch({
                //     type: SET_AUTH_USER,
                //     payload: {
                //         user: res.data.login,
                //         loggedIn: true
                //     }
                // });
                // setSession(serviceToken);
                showInfoToast(`You have been logged in succesfully.`);
            },
            (err) => {
                showErrorToast('Something unexpected happened, please try again later.');
            }
        );
    };

    const logout = () => {
        setSession(null);
        // dispatch({ type: REMOVE_AUTH_USER });
    };

    return <AuthContext.Provider value={{ ...state, tryLogin, logout }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
