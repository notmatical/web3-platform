import gql from 'graphql-tag';

export const ADD_SPACE = gql`
    # prettier-ignore
    mutation AddSpace($owner: String!, $creatorWallet: String!, $name: String!, $symbol: String!, $avatar: String!, $discord: String, $twitter: String, $website: String) {
        addSpace(owner: $owner, creatorWallet: $creatorWallet, name: $name, symbol: $symbol, avatar: $avatar, discord: $discord, twitter: $twitter, website: $website) {
            id
            owner
            creatorWallet
            name
            symbol
        }
    }
`;

export const JOIN_SPACE = gql`
    # prettier-ignore
    mutation AddMember($_id: ID!, $member: String!) {
        addMember(_id: $_id, member: $member) {
            id
            owner
            creatorWallet
            name
            symbol
        }
    }
`;
