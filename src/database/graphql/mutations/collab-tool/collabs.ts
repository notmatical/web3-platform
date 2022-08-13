import gql from 'graphql-tag';

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
