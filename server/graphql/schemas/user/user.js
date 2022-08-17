import { gql } from 'apollo-server-express';

export default gql`
    enum BadgeTypes {
        STAFF
        SITE_DEVELOPER
        RETIRED_STAFF
        BETA_TESTER
        SUPPORTER
        RATED_AWESOME
        DISCORD_ELITE
        IDEA_GUY
        WIZARD
    }

    type User {
        id: ID!
        wallet: String!
        vanity: String
        bio: String
        avatarURI: String
        level: Int!
        levelUpXpRequired: Int!
        xp: Int!
        badges: [BadgeTypes]
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
        multiUsers(wallets: [String!]): [User]!
        user(wallet: String!): User
    }

    extend type Mutation {
        login(wallet: String!): User
        signup(wallet: String!, vanity: String): User
        updateAvatar(wallet: String!, avatar: String!): User
        follow(userAddress: String!, userAddressToFollow: String!): User
        unfollow(userAddress: String!, userAddressToUnfollow: String!): User
        changeUsername(wallet: String!, vanity: String!): User
        addExperience(wallet: String!, xp: Int!): User
        addBadge(wallet: String!, badge: String!): User
        linkDiscord(address: String!, discordId: String!, discordName: String!, discordAvatar: String!): User
    }
`;