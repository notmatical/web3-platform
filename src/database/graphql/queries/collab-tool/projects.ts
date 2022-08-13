import gql from 'graphql-tag';

export const GET_PROJECTS = gql`
    query GetProjects {
        projects {
            guildId
            name
            description
            template
            spots
            price
            iconHash
            mintPrice
            mintDate
            mintSupply
            discord
            twitter
            managers {
                wallet
            }
            collabs {
                id
            }
            isPostMint
            isActive
        }
    }
`;

export const GET_PROJECT = gql`
    query GetProject($guildId: String!) {
        project(guildId: $guildId) {
            guildId
            name
            description
            template
            price
            spots
            iconHash
            mintPrice
            mintDate
            mintSupply
            discord
            twitter
            managers {
                wallet
            }
            collabs {
                id
            }
            isPostMint
            isActive
        }
    }
`;
