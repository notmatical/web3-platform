import { gql } from 'apollo-server-micro';

export default gql`
    type User {
        id: ID!
        wallet: String!
        vanity: String
        bio: String
        avatarURI: String
        level: Int!
        levelUpXpRequired: Int!
        xp: Int!
        badges: [String]
        followed: [User]
        followers: [User]
        socialStats: Social
        registered: Boolean
        isStaff: Boolean
        createdAt: String!
        updatedAt: String!
    }

    extend type Query {
        users: [User!]!
        user(wallet: String!): User
    }

    extend type Mutation {
        login(wallet: String!): User
        signup(wallet: String!, vanity: String): User
        updateAvatar(wallet: String!, avatar: String!): User
        follow(userAddress: String!, userAddressToFollow: String!): User
        unfollow(userAddress: String!, userAddressToUnfollow: String!): User
        changeUsername(wallet: String!, vanity: String!): User
        linkDiscord(address: String!, discordId: String!, discordName: String!, discordAvatar: String!): User
    }
`;