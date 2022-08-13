import { gql } from 'apollo-server-express';

export default gql`
    type Project {
        id: ID!
        guildId: String!
        name: String!
        description: String!
        template: String!
        spots: String!
        holderRole: String
        winningRole: String
        category: String
        channel: String
        price: Float
        iconHash: String
        mintPrice: String
        mintDate: String
        mintSupply: String
        discord: String
        twitter: String
        isPostMint: Boolean!
        isActive: Boolean
        managers: [User]
        collabs: [Collab]
        createdAt: String!
        updatedAt: String!
    }

    extend type Query {
        projects: [Project]!
        project(guildId: String!): Project
    }

    extend type Mutation {
        addProject(guildId: String!, name: String! description: String!, template: String!, spots: String! iconHash: String, mintPrice: String, mintDate: String, mintSupply: String, discord: String, twitter: String): Project
        disableCollabs(id: ID!, isActive: Boolean!): Boolean
    }
`;