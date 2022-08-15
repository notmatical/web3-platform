import gql from 'graphql-tag';

export const GET_JOBS = gql`
    query GetJobs {
        companies {
            id
            name
            bio
            website
            icon
            locations
            size
            verified
            createdAt
        }
    }
`;

export const GET_JOB = gql`
    query GetCompanies {
        companies {
            id
            name
            bio
            website
            icon
            locations
            size
            verified
            createdAt
        }
    }
`;
