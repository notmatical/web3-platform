import axios from 'axios';
import * as web3 from '@solana/web3.js';

const BASE = process.env.REACT_APP_API || 'http://localhost:8080/api';
const API_KEY = 'minx-key';
axios.defaults.headers.common['expect-cache-tag'] = API_KEY;

export default class API {
    private static async get(path: string, params = {}, url = BASE) {
        try {
            let response = await axios.get(`${url}/${path}`, { params });
            let { data, status } = response;

            let result = {
                data,
                status
            };

            return result;
        } catch (err: any) {
            let response = err.response;
            return response;
        }
    }

    private static async delete(path: string, url = BASE) {
        let response = await axios.delete(`${url}/${path}`);
        return response;
    }

    private static async post(path: string, body = {}, url = BASE) {
        try {
            let response = await axios.post(`${url}/${path}`, body);
            return response;
        } catch (err: any) {
            let response = err.response;
            return response;
        }
    }

    private static async put(path: string, body = {}, url = BASE) {
        try {
            let response = await axios.put(`${url}/${path}`, body);
            return response;
        } catch (err: any) {
            let response = err.response;
            return response;
        }
    }

    private static async patch(path: string, body = {}, url = BASE) {
        let response = await axios.patch(`${url}/${path}`, body);
        return response;
    }

    // Auth
    public static async login(publicKey: any) {
        console.log('api login');
    }

    public static async signup(publicKey: string, username: string) {
        console.log('api signup');
    }

    // OAuth
    public static async createOAuth(accessToken: string, service: string) {
        const path = `${BASE}/oauth2/redirect?service=${service}&token=${accessToken}`;
        window.location.href = path;
    }

    public static async removeOAuth(oauthId: string) {
        let response = await this.delete(`oauth2/${oauthId}`);
        return response;
    }

    public static async inviteDiscordBot() {
        const path = 'https://discord.com/api/oauth2/authorize?client_id=966881151451005019&permissions=268526609&scope=bot';
        window.location.href = path;
    }

    // Wallet

    // User

    // Activity

    // Profile

    // Badges

    // Miscellanous
}