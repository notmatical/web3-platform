import gql from 'graphql-tag';

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
