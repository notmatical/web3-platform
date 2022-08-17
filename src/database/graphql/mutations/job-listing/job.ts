import gql from 'graphql-tag';

export const CREATE_JOB_LISTING = gql`
    # prettier-ignore
    mutation CreateJob($company: ID!, $category: String!, $title: String!, $location: String!, $jobType: [String], $payRange: [String]!, $rate: String!, $offers: [String], $description: String!) {
        createJob(company: $company, category: $category, title: $title, location: $location, jobType: $jobType, payRange: $payRange, rate: $rate, offers: $offers, description: $description) {
            company {
                name
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

export const CREATE_JOB_LISTIN = gql`
    # prettier-ignore
    mutation CreateJob($company: ID!, $category: String!, $title: String!, $location: String!, $jobType: [String], $payRange: [String]!, $rate: String!, $offers: [String], $description: String!) {
        createJob(company: $company, category: $category, title: $title, location: $location, jobType: $jobType, payRange: $payRange, rate: $rate, offers: $offers, description: $description) {
            company {
                name
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
