import gql from 'graphql-tag';

export const FOLLOW_USER = gql`
    mutation follow($userAddress: String!, $userAddressToFollow: String!) {
        follow(userAddress: $userAddress, userAddressToFollow: $userAddressToFollow) {
            vanity
            wallet
        }
    }
`;

export const UNFOLLOW_USER = gql`
    mutation unfollow($userAddress: String!, $userAddressToUnfollow: String!) {
        unfollow(userAddress: $userAddress, userAddressToUnfollow: $userAddressToUnfollow) {
            vanity
            wallet
        }
    }
`;
