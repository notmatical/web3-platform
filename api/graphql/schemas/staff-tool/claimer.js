import { gql } from 'apollo-server-micro';

export default gql`
    type TransactionHash {
        date: String
        txHash: String
    }

	type Claimer {
		id: ID!
		project: String!
        name: String!
        method: String!
		amount: String!
		period: String!
		transactionHash: [TransactionHash]
		time: String!
		wallet: String!
		createdAt: String!
		updatedAt: String!
	}

	extend type Query {
		getClaimers: [Claimer]
		getClaimer(wallet: String!): [Claimer]
        getEmployees(project: String!): [Claimer]
	}

	extend type Mutation {
		createClaimer(project: String!, name: String!, method: String!, amount: String!, wallet: String!, time: String!, period: String!): Claimer
		deleteClaimer(project: String!, name: String!, wallet: String!): Claimer
		clickClaim(project: String!, wallet: String!, method: String!, claimTime: String!, delayed: String!): Claimer
	}
`;