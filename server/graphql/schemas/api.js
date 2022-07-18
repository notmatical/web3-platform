import { gql } from 'apollo-server-express';

export default gql`
    type API {
        symbol: String
        floorPrice: Float
        listedCount: Float
        avgPrice24hr: Float
        volumeAll: Float
    }

    extend type Query {
        getStats(symbol: String!): API
    }
`;