const { RESTDataSource } = require('apollo-datasource-rest');

class MagicEdenAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://api-mainnet.magiceden.dev/';
    }

    async fetchStats(symbol) {
        try {
            if (symbol === 'all') {
                console.log('symbol is ALL');
                const astroData = await this.get(`v2/collections/cosmic_astronauts/stats`);
                const bikeData = await this.get(`v2/collections/yaku_corp/stats`);
                const capsuleData = await this.get(`v2/collections/yaku_corp_capsulex/stats`);
                const yakuData = await this.get(`v2/collections/yaku_x/stats`);
                console.log(astroData, bikeData, capsuleData, yakuData);

                return {
                    floorPrice: astroData.floorPrice + bikeData.floorPrice + capsuleData.floorPrice + yakuData.floorPrice,
                    listedCount: astroData.listedCount + bikeData.listedCount + capsuleData.listedCount + yakuData.listedCount,
                    avgPrice24hr: astroData.avgPrice24hr + bikeData.listedCount + capsuleData.avgPrice24hr + yakuData.avgPrice24hr,
                    volumeAll: astroData.volumeAll + bikeData.volumeAll + capsuleData.volumeAll + yakuData.volumeAll
                }
            } else {
                const data = await this.get(`v2/collections/${symbol}/stats`);
                return data;
            }
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
