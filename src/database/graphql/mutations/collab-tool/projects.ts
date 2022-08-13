import gql from 'graphql-tag';

export const ADD_PROJECT = gql`
    # prettier-ignore
    mutation AddProject($guildId: String!, $name: String!, $description: String!, $template: String!, $spots: String! $iconHash: String, $mintPrice: String, $mintDate: String, $mintSupply: String, $discord: String, $twitter: String) {
        addProject(guildId: $guildId, name: $name, description: $description, template: $template, spots: $spots, iconHash: $iconHash, mintPrice: $mintPrice, mintDate: $mintDate, mintSupply: $mintSupply, discord: $discord, twitter: $twitter) {
            guildId
            name
        }
    }
`;

export const DISABLE_COLLABS = gql`
    # prettier-ignore
    mutation DisableCollabs($id: ID!, $isActive: Boolean!) {
        disableCollabs(id: $id, isActive: $isActive) {
            guildId
            name
            isActive
        }
    }
`;
