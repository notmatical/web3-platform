import gql from 'graphql-tag';

export const GET_COMPANIES = gql`
    query GetCompanies {
        getCompanies {
            id
            name
            bio
            website
            logoURI
            locations
            size
            verified
        }
    }
`;

export const GET_COMPANY = gql`
    query GetCompanies {
        companies {
            id
            name
            bio
            website
            logoURI
            locations
            size
            verified
            createdAt
        }
    }
`;
