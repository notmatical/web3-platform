const { RESTDataSource } = require('apollo-datasource-rest');

class MagicEdenAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://api-mainnet.magiceden.dev/';
    }

    async fetchStats(symbol) {
        try {
            const data = await this.get(`v2/collections/${symbol}/stats`);
            return data;
        } catch (error) {
            console.error(error);
        }
    }

    // gets all ME Collections
    async getAllMECollections() {
        try {
            const requestInit = {
                timeout: 60 * 60 * 1000,
                compress: true,
            }
            const {collections = {}} = await this.get('all_collections', process.env.ME_AUTHORIZATION_TOKEN ? {
                headers: {
                    Authorization: process.env.ME_AUTHORIZATION_TOKEN,
                },
            } : {}, requestInit);
            return collections;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
}

export default MagicEdenAPI;
