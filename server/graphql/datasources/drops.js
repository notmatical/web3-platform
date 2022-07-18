const { RESTDataSource } = require('apollo-datasource-rest');

class DropsAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://api.howrare.is/v0.1/';
    }

    async fetchDrops() {
        try {
            const data = await this.get(`drops`);
            return data;
        } catch (error) {
            console.log(error);
        }
    }
}

export default DropsAPI;
