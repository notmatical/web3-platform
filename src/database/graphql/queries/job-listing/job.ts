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

export const GET_JOBS_BY_COMPANY = gql`
    query GetJobsByCompany($company: ID!) {
        getJobsByCompany(company: $companyId) {
            company {
                icon
                name
                bio
                verified
            }
            title
            description
            location
            jobType
            payRange
            rate
            offers
            createdAt
        }
    }
`;

export const GET_RECENT_JOB_LISTINGS = gql`
    query GetRecentJobListings($limit: Int!) {
        getRecentJobListings(limit: $limit) {
            company {
                icon
                name
                bio
                size
                verified
            }
            title
            description
            location
            jobType
            payRange
            rate
            offers
            createdAt
        }
    }
`;
