const axios = require('axios');

async function bypasstools(url) {
    try {
        if (!url.startsWith('https://')) throw new Error('Url is required.');
        
        const { data: cf } = await axios.post('https://rynekoo-cf.hf.space/action', {
            url: `https://bypass.tools/`,
            mode: 'turnstile-min',
            siteKey: '0x4AAAAAACXArKb_xnkUnwy8'
        });
        
        if (!cf?.data?.token) throw new Error('Failed to get cf token.');
        
        const { data } = await axios.post('https://bypass.tools/api/bypass', {
            url: url,
            captchaToken: cf.data.token,
            isPremium: false,
            key: null,
            forceRefresh: false
        }, {
            headers: {
                'content-type': 'application/json',
                origin: 'https://bypass.tools',
                referer: 'https://bypass.tools/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
            }
        });
        
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Usage:
bypasstools('https://linkvertise.com/329510/test-it-out/1').then(console.log);
