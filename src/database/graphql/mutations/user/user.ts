import gql from 'graphql-tag';

export const UPDATE_AVATAR = gql`
    mutation UpdateAvatar($wallet: String!, $avatar: String!) {
        updateAvatar(wallet: $wallet, avatar: $avatar) {
            wallet
            vanity
            avatarURI
        }
    }
`;

export const UPDATE_AVATARS = gql`
    mutation UpdateAvatar($wallet: String!, $avatar: String!) {
        updateAvatar(wallet: $wallet, avatar: $avatar) {
            wallet
            vanity
            avatarURI
        }
    }
`;
