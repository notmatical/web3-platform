import { AnyAction } from "redux";
import { Account, AccountConfig } from './accounts';

export interface User {
    id?: number;
    username?: string;
    email?: string;
    emailVerified?: boolean;
    account?: Account;
    isAffiliate?: boolean;
}

const initialState: User = {
    id: undefined,
    username: undefined,
    email: undefined,
    emailVerified: false,
    account: {},
    isAffiliate: false,
}

const UsersReducer = (state: User = initialState, action: AnyAction) => {
    console.log(state, action);
}