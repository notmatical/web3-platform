export type SessionContext = {
    user?: User | null | undefined;
}

export type AuthContextType = {
    loggedIn: boolean;
    user?: User | null | undefined;
    // user?: User | null | undefined;
    tryLogin: (address: string) => Promise<void>;
    logout: () => void;
};

export interface InitialLoginContextProps {
    loggedIn: boolean;
    user?: User | null | undefined;
    // user?: User | null | undefined;
}

// new test
export enum AccountConfig {
    Partner = 'partner',
    Staff = 'staff'
}

enum BadgeType {
    PartnerBadge = 'partner_badge',
    StaffBadge = 'staff_badge'
}

export interface Account {
    id?: string;
    address?: string;
    config?: AccountConfig;
    badgeType?: BadgeType;
    user?: User;
}

// used for reducer
// export type User = {
//     id?: string;
//     address: string;
//     email?: string;
//     discordName?: string;
//     discordId?: string;
//     discordAvatar?: string;
//     isEmailVerified?: boolean;
//     isDiscordLinked?: boolean;
//     isAffiliate?: boolean;
//     isLoggedIn: boolean;
// };
export type User = {
    id?: string;
    wallet?: string;
    isStaff?: boolean;
    registered?: boolean;
    username?: string;
    vanityUrl?: string;
};