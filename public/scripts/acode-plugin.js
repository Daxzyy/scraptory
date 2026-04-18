const axios = require('axios');

class AcodePlugin {
    constructor() {
        this.inst = axios.create({
            baseURL: 'https://acode.app/api',
            headers: {
                'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                origin: 'https://localhost',
                referer: 'https://localhost/',
                'sec-fetch-site': 'cross-site',
                'sec-fetch-mode': 'cors',
                'sec-fetch-dest': 'empty',
                'user-agent': 'Mozilla/5.0 (Linux; Android 10; SM-J700F Build/QQ3A.200805.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/97.0.4692.98 Mobile Safari/537.36',
                'x-requested-with': 'com.foxdebug.acodefree'
            }
        });
    }
    
    list = async function () {
        try {
            const { data } = await this.inst.get('/plugins');
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    search = async function (query) {
        try {
            if (!query) throw new Error('Query is required.');
            
            const { data } = await this.inst.get('/plugins', {
                params: {
                    name: query
                }
            });
            
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    detail = async function (id) {
        try {
            if (!id) throw new Error('ID is required.');
            
            const { data } = await this.inst.get(`/plugin/${id}`);
            return {
                ...data,
                download_url: `https://acode.app/api/plugin/download/${id}`
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

// Usage:
const ap = new AcodePlugin();
ap.detail('acode.plugin.prettier').then(console.log);
