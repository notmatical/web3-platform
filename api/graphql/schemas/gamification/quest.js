import { gql } from 'apollo-server-micro';

export default gql`
    type Quest {
        id: ID!
        name: String!
        description: String!
        expiresAt: String!
        cooldownDays: Int
        rewardedXp: Int
        rewardedPoints: Int
        requiredLevel: Int
        isClaimable: Boolean
        isCompletable: Boolean
        isCompletableAt: String
        isExpired: Boolean
        isOneOff: Boolean
        createdAt: String!
        updatedAt: String!
    }

    extend type Query {
        quests: [Quest!]!
    }
`;