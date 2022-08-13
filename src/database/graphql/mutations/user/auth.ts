import gql from 'graphql-tag';

export const LOG_IN = gql`
    mutation login($wallet: String!) {
        login(wallet: $wallet) {
            id
            wallet
            vanity
            registered
            isStaff
            createdAt
            updatedAt
        }
    }
`;

export const SIGN_UP = gql`
    mutation signup($wallet: String!, $vanity: String) {
        signup(wallet: $wallet, vanity: $vanity) {
            wallet
            vanity
            registered
            isStaff
            createdAt
            updatedAt
        }
    }
`;

export const LINK_DISCORD = gql`
    mutation LinkDiscord($address: String!) {
        LinkDiscord(address: $address) {
            name
        }
    }
`;
