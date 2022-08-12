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

export const GET_MULTIPLE_USERS = gql`
    query MultipleUsers($wallets: [String!]) {
        multiUsers(wallets: $wallets) {
            id
            vanity
            avatarURI
            vanity
            level
            xp
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

export const GET_COLLECTIONS = gql`
    query GetCollections {
        getAllMECollections {
            symbol
            image
            name
            totalItems
            description
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

// staff management
export const GET_TOKEN = gql`
    query getToken($name: String!) {
        getToken(name: $name) {
            mint
            name
            symbol
            logo
            decimal
            value
        }
    }
`;

export const GET_TOKENS = gql`
    query getTokens {
        getTokens {
            mint
            name
            symbol
            decimal
            value
            logo
        }
    }
`;

export const GET_TRANSACTIONS = gql`
    query getTransactions {
        getTransactions {
            wallet
            transactionHash
            from
            to
            fromAmount
            toAmount
            type
        }
    }
`;
export const GET_TRANSACTION = gql`
    query getTransaction($transactionHash: String!) {
        getTransaction(transactionHash: $transactionHash) {
            wallet
            transactionHash
            from
            to
            fromAmount
            toAmount
            type
        }
    }
`;

export const GET_CLAIMER = gql`
    query getClaimer($wallet: String!) {
        getClaimer(wallet: $wallet) {
            project
            method
            name
            amount
            wallet
            period
            transactionHash {
                date
                txHash
            }
            time
        }
    }
`;

export const GET_CLAIMERS = gql`
    query getClaimers {
        getClaimers {
            project
            name
            method
            amount
            wallet
            period
            transactionHash {
                date
                txHash
            }
            time
        }
    }
`;

export const GET_EMPLOYEES = gql`
    query getEmployees($project: String!) {
        getEmployees(project: $project) {
            project
            name
            method
            amount
            wallet
            period
            transactionHash {
                date
                txHash
            }
            time
        }
    }
`;

export const GET_WALLETS = gql`
    query getWallets($wallet: String!) {
        getWallets(wallet: $wallet) {
            project
        }
    }
`;

export const GET_WALLETPUBKEY = gql`
    query getWalletPubkey($project: String!, $wallet: String!) {
        getWalletPubkey(project: $project, wallet: $wallet) {
            pubkey
        }
    }
`;
