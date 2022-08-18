import gql from 'graphql-tag';

export const GET_USER = gql`
    query User($wallet: String!) {
        user(wallet: $wallet) {
            id
            wallet
            bio
            avatarURI
            vanity
            badges
            level
            levelUpXpRequired
            xp
            socialStats {
                followedCount
                followersCount
                followersRank
            }
            createdAt
        }
    }
`;

export const GET_USER_BADGES = gql`
    query GetUserBadges($wallet: String!) {
        userBadges(wallet: $wallet) {
            badges
        }
    }
`;

export const GET_MULTIPLE_USERS = gql`
    query MultipleUsers($wallets: [String!]) {
        multiUsers(wallets: $wallets) {
            id
            vanity
            avatarURI
            vanity
            level
            xp
        }
    }
`;
