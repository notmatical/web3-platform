import gql from 'graphql-tag';

export const GET_SPACES = gql`
    query GetSpaces {
        spaces {
            id
            owner
            members
            name
            description
            symbol
            avatar
            discord
            twitter
            website
        }
    }
`;

export const GET_SPACE = gql`
    query GetSpace($symbol: String!) {
        space(symbol: $symbol) {
            id
            owner
            creatorWallet
            members
            name
            description
            symbol
            avatar
            discord
            twitter
            website
            isPartnered
            createdAt
        }
    }
`;
