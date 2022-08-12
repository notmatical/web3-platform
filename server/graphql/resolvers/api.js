export default {
    Query: {
        getStats: async (_source, args, { dataSources }) => {
            const data = await dataSources.magicEdenAPI.fetchStats(args.symbol);
            return data;
        },
        getAllMECollections: async (_source, args, { dataSources }) => {
            const data = await dataSources.magicEdenAPI.getAllMECollections();
            console.log(data);
            return data;
        }
    }
};