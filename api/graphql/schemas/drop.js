import { gql } from 'apollo-server-micro';

export default gql`
    scalar JSON

    extend type Query {
        getDrops: JSON!
    }
`;