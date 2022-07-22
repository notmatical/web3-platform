import gql from 'graphql-tag';

/* eslint-disable import/prefer-default-export */
// User
export const GET_USER = gql`
    query User($wallet: String!) {
        user(wallet: $wallet) {
            id
            wallet
            bio
            avatarURI
            vanity
            badges
            level
            levelUpXpRequired
            xp
            socialStats {
                followedCount
                followersCount
                followersRank
            }
            createdAt
        }
    }
`;

// Social/Ranking
export const GET_LEADERBOARD = gql`
    query ranking($first: Int) {
        leaderboard(first: $first) {
            followersRank
            followersCount
            user {
                wallet
                vanity
                avatarURI
                followed {
                    wallet
                }
                followers {
                    wallet
                }
            }
        }
    }
`;

// Gamification
export const GET_QUESTS = gql`
    query quests {
        quests {
            name
            description
            expiresAt
            cooldownDays
            rewardedXp
            rewardedPoints
            requiredLevel
            isClaimable
            isCompletable
            isCompletableAt
            isExpired
            isOneOff
        }
    }
`;

// API
export const GET_COLLECTION_STATS = gql`
    query GetCollectionStats($symbol: String!) {
        getStats(symbol: $symbol) {
            symbol
            floorPrice
            listedCount
            avgPrice24hr
            volumeAll
        }
    }
`;

// Project/Collabs
export const GET_PROJECTS = gql`
    query GetProjects {
        projects {
            guildId
            name
            description
            template
            spots
            price
            iconHash
            mintPrice
            mintDate
            mintSupply
            discord
            twitter
            managers {
                wallet
            }
            collabs {
                id
            }
            isPostMint
            isActive
        }
    }
`;

export const GET_PROJECT = gql`
    query GetProject($guildId: String!) {
        project(guildId: $guildId) {
            guildId
            name
            description
            template
            price
            spots
            iconHash
            mintPrice
            mintDate
            mintSupply
            discord
            twitter
            managers {
                wallet
            }
            collabs {
                id
            }
            isPostMint
            isActive
        }
    }
`;

export const GET_COLLABS = gql`
    query GetCollabs($guildId: String!) {
        collabs(guildId: $guildId) {
            id
            isAccepted
            project {
                guildId
                iconHash
                isPostMint
                name
            }
            requester {
                avatarURI
                wallet
                vanity
            }
            offerType
            type
            spots
            spotsFilled
            status
        }
    }
`;

// Drops
export const GET_DROPS = gql`
    query getDrops {
        getDrops
    }
`;

// Spaces / Proposals
export const GET_SPACES = gql`
    query GetSpaces {
        spaces {
            id
            owner
            members
            name
            description
            symbol
            avatar
            discord
            twitter
            website
        }
    }
`;

export const GET_SPACE = gql`
    query GetSpace($symbol: String!) {
        space(symbol: $symbol) {
            id
            owner
            creatorWallet
            members
            name
            description
            symbol
            avatar
            discord
            twitter
            website
            isPartnered
            createdAt
        }
    }
`;

export const GET_PROPOSALS_FOR_SPACE = gql`
    query GetProposalsForSpace($id: ID!) {
        proposalsIn(id: $id) {
            id
            author {
                vanity
                wallet
                avatarURI
            }
            title
            body
            discussion
            state
            choices
            forVotes
            againstVotes
            abstainVotes
            endsAt
            createdAt
        }
    }
`;

export const GET_PROPOSAL = gql`
    query GetProposal($id: ID!) {
        proposal(id: $id) {
            id
            author {
                vanity
                wallet
                avatarURI
            }
            title
            body
            discussion
            state
            choices
            forVotes
            againstVotes
            abstainVotes
            endsAt
            createdAt
        }
    }
`;

// misc
export const GET_ART_URIS = gql`
    query GetArtUris($mintKey: String!) {
        artSwitcher(mintKey: $mintKey) {
            id
            mintKey
            metadata {
                image
                uri
            }
        }
    }
`;
