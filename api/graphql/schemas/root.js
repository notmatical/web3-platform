import { gql } from 'apollo-server-micro';

export default gql`
    type Query {
        _: String
    }
    type Mutation {
        _: String
    }
    type Subscription {
        _: String
    }
`;