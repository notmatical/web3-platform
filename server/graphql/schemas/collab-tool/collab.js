import { gql } from 'apollo-server-express';

export default gql`
    type Collab {
        id: ID!
        project: Project!
        requester: User!
        offerType: Boolean!
        type: Boolean!
        fromGuild: String!
        toGuild: String!
        holderRole: String
        winningRole: String
        category: String
        channel: String
        template: String!
        spots: Int
        spotsFilled: Int
        status: String
        isAccepted: Boolean
        createdAt: String!
        updatedAt: String!
    }

    extend type Query {
        collabs(guildId: String!): [Collab]!
        collab(id: Int): Collab
    }

    extend type Mutation {
        requestCollab(discordId: String!, name: String!, format: String!, description: String!, iconHash: String, discord: String, twitter: String): Collab
        approveCollab(id: ID!, spots: Int!): Boolean
        rejectCollab(id: ID!): Boolean
    }
`;