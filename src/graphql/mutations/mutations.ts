import gql from 'graphql-tag';

// Project Mutations
export const ADD_PROJECT = gql`
    # prettier-ignore
    mutation AddProject($guildId: String!, $name: String!, $description: String!, $template: String!, $spots: String! $iconHash: String, $mintPrice: String, $mintDate: String, $mintSupply: String, $discord: String, $twitter: String) {
        addProject(guildId: $guildId, name: $name, description: $description, template: $template, spots: $spots, iconHash: $iconHash, mintPrice: $mintPrice, mintDate: $mintDate, mintSupply: $mintSupply, discord: $discord, twitter: $twitter) {
            guildId
            name
        }
    }
`;

export const DISABLE_COLLABS = gql`
    # prettier-ignore
    mutation DisableCollabs($id: ID!, $isActive: Boolean!) {
        disableCollabs(id: $id, isActive: $isActive) {
            guildId
            name
            isActive
        }
    }
`;

// Collab Mutations
export const APPROVE_COLLAB = gql`
    # prettier-ignore
    mutation ApproveCollab($id: ID!, $spots: Int!) {
        approveCollab(id: $id, spots: $spots)
    }
`;

export const REJECT_COLLAB = gql`
    # prettier-ignore
    mutation RejectCollab($id: ID!) {
        rejectCollab(id: $id)
    }
`;

// Drop Mutations
export const ADD_DROP = gql`
    mutation AddDrop($time: String!, $title: String!, $price: String!, $twitter: String!) {
        addDrop(time: $time, title: $title, price: $price, twitter: $twitter) {
            id
            time
            title
            price
            twitter
            createdAt
        }
    }
`;

// Space Mutations
export const ADD_SPACE = gql`
    # prettier-ignore
    mutation AddSpace($owner: String!, $creatorWallet: String!, $name: String!, $symbol: String!, $avatar: String!, $discord: String, $twitter: String, $website: String) {
        addSpace(owner: $owner, creatorWallet: $creatorWallet, name: $name, symbol: $symbol, avatar: $avatar, discord: $discord, twitter: $twitter, website: $website) {
            id
            owner
            creatorWallet
            name
            symbol
        }
    }
`;

export const JOIN_SPACE = gql`
    # prettier-ignore
    mutation AddMember($_id: ID!, $member: String!) {
        addMember(_id: $_id, member: $member) {
            id
            owner
            creatorWallet
            name
            symbol
        }
    }
`;

export const CREATE_PROPOSAL = gql`
    # prettier-ignore
    mutation CreateProposal($author: String!, $title: String!, $body: String, $discussion: String, $postedIn: ID!, $endsAt: String!) {
        createProposal(author: $author, title: $title, body: $body, discussion: $discussion, postedIn: $postedIn, endsAt: $endsAt) {
            id
            author
            title
            body
            discussion
            state
            choices
            endsAt
            createdAt
        }
    }
`;

export const CLOSE_PROPOSAL = gql`
    mutation CloseProposal($id: ID!) {
        closeProposal(id: $id)
    }
`;

export const DELETE_PROPOSAL = gql`
    mutation DeleteProposal($id: ID!) {
        deleteProposal(id: $id)
    }
`;

export const VOTE_PROPOSAL = gql`
    mutation VoteProposal($id: ID!, $type: String!, $wallet: String!) {
        voteProposal(id: $id, type: $type, wallet: $wallet) {
            id
            author
            title
            description
            discussion
            status
            type
            forVotes
            againstVotes
            abstainVotes
            endsAt
            createdAt
        }
    }
`;

// User Mutations
export const LOG_IN = gql`
    mutation login($wallet: String!) {
        login(wallet: $wallet) {
            id
            wallet
            vanity
            registered
            isStaff
            createdAt
            updatedAt
        }
    }
`;

export const SIGN_UP = gql`
    mutation signup($wallet: String!, $vanity: String) {
        signup(wallet: $wallet, vanity: $vanity) {
            wallet
            vanity
            registered
            isStaff
            createdAt
            updatedAt
        }
    }
`;

export const FOLLOW_USER = gql`
    mutation follow($userAddress: String!, $userAddressToFollow: String!) {
        follow(userAddress: $userAddress, userAddressToFollow: $userAddressToFollow) {
            vanity
            wallet
        }
    }
`;

export const UNFOLLOW_USER = gql`
    mutation unfollow($userAddress: String!, $userAddressToUnfollow: String!) {
        unfollow(userAddress: $userAddress, userAddressToUnfollow: $userAddressToUnfollow) {
            vanity
            wallet
        }
    }
`;

export const UPDATE_AVATAR = gql`
    mutation UpdateAvatar($wallet: String!, $avatar: String!) {
        updateAvatar(wallet: $wallet, avatar: $avatar) {
            wallet
            vanity
            avatarURI
        }
    }
`;

export const LINK_DISCORD = gql`
    mutation LinkDiscord($address: String!) {
        LinkDiscord(address: $address) {
            name
        }
    }
`;
