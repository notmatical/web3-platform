import GraphQLJSON from 'graphql-type-json';

export default {
    JSON: GraphQLJSON,
    Query: {
        getDrops: async (_source, _args, { dataSources }) => {
            const data = await dataSources.dropsAPI.fetchDrops();
            return data.result.data;
        }
    }
};