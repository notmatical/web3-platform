import { gql } from 'apollo-server-micro';

export default gql`
    type API {
        symbol: String
        floorPrice: Float
        listedCount: Float
        avgPrice24hr: Float
        volumeAll: Float
    }

    type MERarityFlag {
        showMoonrank: Boolean
        showHowrare: Boolean
        showMagicEden: Boolean
    }

    type Collection {
        symbol: String
        candyMachineIds: [String]
        categories: [String]
        createdAt: String
        description: String
        discord: String
        enabledAttributesFilters: Boolean
        image: String
        isAutolist: Boolean
        name: String
        rarity: MERarityFlag
        totalItems: Int
        twitter: String
    }
    
    extend type Query {
        getStats(symbol: String!): API
        getAllMECollections: [Collection]
    }
`;