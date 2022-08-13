import gql from 'graphql-tag';

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
