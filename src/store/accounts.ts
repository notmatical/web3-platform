import { User } from './users';

export enum AccountConfig {
    Verified = "verified",
    Staff = "staff"
}

enum BadgeType {
    VerifiedBadge = "verified_badge",
    StaffBadge = "staff_badge"
}

export interface Account {
    id?: number;
    address?: string;
    config?: AccountConfig;
    badgeType?: BadgeType;
    user?: User;
}