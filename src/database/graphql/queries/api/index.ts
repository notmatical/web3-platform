import gql from 'graphql-tag';

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

export const GET_DROPS = gql`
    query getDrops {
        getDrops
    }
`;
