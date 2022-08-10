import { API } from '../../models/models';

export default {
    Query: {
        getStats: async (_source, args, { dataSources }) => {
            const data = await dataSources.magicEdenAPI.fetchStats(args.symbol);
            return data;
        }
    }
};