import { gql } from 'apollo-server-express';

export default gql`
	type Job {
		id: ID!
		company: Company!
        category: String!
        title: String!
		location: String!
		jobType: [String]!
		payRange: [String]!
		rate: String!
		offers: [String]!
        description: String!
		status: String!
		createdAt: String!
		updatedAt: String!
	}

	extend type Query {
		getJobs: [Job]
		getJob(id: ID!): Job
        getJobsByCompany(company: ID!): [Job]
		getRecentJobListings(limit: Int!): [Job]
	}

	extend type Mutation {
        createJob(company: ID!, category: String!, title: String!, location: String!, jobType: [String]!, payRange: [String]!, rate: String!, offers: [String]!, description: String!): Job
    }
`;