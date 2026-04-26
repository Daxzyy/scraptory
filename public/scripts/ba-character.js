const axios = require('axios');

class BlueArchive {
    findUrl = (input, urls) => {
        const clean = input.toLowerCase().replace(/\s+/g, '_');
        if (urls.includes(clean)) return clean;
        
        const words = clean.split('_');
        const matches = urls.filter(url => words.every(word => url.toLowerCase().includes(word)));
        
        return matches.length > 0 ? matches[0] : null;
    }
    
    list = async function () {
        try {
            const { data } = await axios.get('https://api.dotgg.gg/bluearchive/characters');
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    char = async function (char) {
        try {
            const listc = await this.list();
            const urls = listc.map(c => c.url);
            const foundUrl = this.findUrl(char, urls);
            
            if (!foundUrl) throw new Error(`Character "${char}" not found.`);
            
            const { data } = await axios.get(`https://api.dotgg.gg/bluearchive/characters/${foundUrl}`);
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }
};

// Usage:
const ba = new BlueArchive();
ba.char('shiroko').then(console.log);