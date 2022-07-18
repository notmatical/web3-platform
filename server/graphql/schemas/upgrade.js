import { gql } from 'apollo-server-express';

export default gql`
    input MetadataInput {
        image: String!
        uri: String!
    }

    type Metadata {
        image: String!
        uri: String!
    }

    type Upgrade {
        id: ID!
        mintKey: String!
        metadata: [Metadata!]
        createdAt: String!
        updatedAt: String!
    }

    extend type Query {
        artSwitchers: [Upgrade]
        artSwitcher(mintKey: String!): Upgrade!
    }

    extend type Mutation {
        createArtSwitcher(mintKey: String!, metadata: [MetadataInput]!): Upgrade
    }
`;