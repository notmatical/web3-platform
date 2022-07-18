// action - state management
import { AnyAction } from 'redux';
import { SET_AUTH_USER, REMOVE_AUTH_USER } from './actions';
import { InitialLoginContextProps, User } from 'types/auth';

// ==============================|| ACCOUNT REDUCER ||============================== //

interface AccountReducerActionProps {
    type: string;
    payload?: InitialLoginContextProps;
}

const initialState: InitialLoginContextProps = {
    user: null,
    loggedIn: false
};

const accountReducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case SET_AUTH_USER: {
            // eslint-disable-next-line
            const { user } = action.payload!
            return {
                ...state,
                user,
                loggedIn: true
            };
        }
        case REMOVE_AUTH_USER: {
            return {
                ...state,
                user: {},
                loggedIn: false
            };
        }
        default: {
            return { ...state };
        }
    }
};

export default accountReducer;
