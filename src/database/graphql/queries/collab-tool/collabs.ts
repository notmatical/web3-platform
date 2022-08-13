import gql from 'graphql-tag';

export const GET_COLLABS = gql`
    query GetCollabs($guildId: String!) {
        collabs(guildId: $guildId) {
            id
            isAccepted
            project {
                guildId
                iconHash
                isPostMint
                name
            }
            requester {
                avatarURI
                wallet
                vanity
            }
            offerType
            type
            spots
            spotsFilled
            status
        }
    }
`;

export const GET_COLLAB = gql`
    query GetCollabs($guildId: String!) {
        collabs(guildId: $guildId) {
            id
            isAccepted
            project {
                guildId
                iconHash
                isPostMint
                name
            }
            requester {
                avatarURI
                wallet
                vanity
            }
            offerType
            type
            spots
            spotsFilled
            status
        }
    }
`;
