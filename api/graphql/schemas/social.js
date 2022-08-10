import { gql } from 'apollo-server-micro';

export default gql`
    type Social {
        id: ID!
        wallet: String!
        user: User
        followedCount: Int
        followersCount: Int
        followersRank: Int
    }

    extend type Query {
        socials: [Social]
        social(wallet: String!): Social
        leaderboard(first: Int, offset: Int): [Social]
        trending: [Social]
    }
`;