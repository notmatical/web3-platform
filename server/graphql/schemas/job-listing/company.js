import { gql } from 'apollo-server-express';

export default gql`
    enum CompanySize {
        SMALL
        MEDIUM
        LARGE
    }

	type Company {
		id: ID!
		name: String!
        bio: String!
        logoURI: String!
		website: String
		twitter: String
		size: CompanySize
		locations: [String]
		team: [User]!
		jobs: [Job]
        verified: Boolean
		createdAt: String!
		updatedAt: String!
	}

	extend type Query {
		getCompanies: [Company]
		getCompany(company: String!): Company
	}

	extend type Mutation {
        createCompany(name: String!, bio: String!, icon: String!, website: String, twitter: String, size: CompanySize!, locations: [String]): Company
    }
`;