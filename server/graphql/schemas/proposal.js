import { gql } from 'apollo-server-express';

export default gql`
    type Proposal {
        id: ID!
        author: User!
        title: String!
        body: String
        discussion: String
        state: String!
        choices: [String!]
        postedIn: Space
        forVotes: [String!]
        againstVotes: [String!]
        abstainVotes: [String!]
        endsAt: String!
        createdAt: String!
        updatedAt: String!
    }

    extend type Query {
        proposals(first: Int!, skip: Int!, state: String!, space: String, space_in: [String], author_in: [String]): [Proposal]
        proposalsBy(author: String!): [Proposal]
        proposalsIn(id: ID!): [Proposal]
        proposal(id: ID!): Proposal
    }

    extend type Mutation {
        createProposal(author: String!, title: String!, body: String, discussion: String, postedIn: ID!, endsAt: String!): Proposal
        closeProposal(id: ID!): Boolean
        deleteProposal(id: ID!): Boolean
        voteProposal(id: ID!, type: String!, wallet: String!): Proposal
    }
`;