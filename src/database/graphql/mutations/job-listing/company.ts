import gql from 'graphql-tag';

export const CREATE_COMPANY = gql`
    # prettier-ignore
    mutation CreateCompany($name: String!, $bio: String!, $website: String, $twitter: String, $icon: String!, $locations: [String]!, $size: String!) {
        createCompany(name: $name, bio: $bio, website: $website, twitter: $twitter, icon: $icon, locations: $locations, size: $size) {
            id
            name
            bio
            logoURI
            website
            twitter
            locations
            size
            createdAt
        }
    }
`;

export const CREATE_COMPAN = gql`
    # prettier-ignore
    mutation CreateCompany($name: String!, $bio: String!, $website: String, $twitter: String, $icon: String!, $locations: [String]!, $size: String!) {
        createCompany(name: $name, bio: $bio, website: $website, twitter: $twitter, icon: $icon, locations: $locations, size: $size) {
            id
            name
            bio
            logoURI
            website
            twitter
            locations
            size
            createdAt
        }
    }
`;
