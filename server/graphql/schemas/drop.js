import { gql } from 'apollo-server-express';

export default gql`
    scalar JSON

    extend type Query {
        getDrops: JSON!
    }
`;