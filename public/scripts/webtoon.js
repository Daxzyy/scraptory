import fs from 'fs';
import axios from 'axios';
import PDFDocument from 'pdfkit';
import {
    finished
} from 'stream/promises';
import sharp from 'sharp';

const TMP_DIR = './tmp';
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR);

const WEBTOON_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Accept': 'image/webp,image/apng,image/,/;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://www.webtoons.com/',
    'Origin': 'https://www.webtoons.com'
};

const getBuffer = async (url) => {
    try {
        const res = await axios.get(url, {
            headers: WEBTOON_HEADERS,
            responseType: 'arraybuffer',
            timeout: 20000
        });
        return Buffer.from(res.data);
    } catch {
        return null;
    }
};

const downloadImage = async (url, path) => {
    const res = await axios({
        method: 'GET',
        url,
        responseType: 'stream',
        headers: WEBTOON_HEADERS,
        timeout: 20000,
        validateStatus: s => s < 500
    });

    if (res.status !== 200) throw new Error('Bad image');

    const writer = fs.createWriteStream(path);
    res.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
};

let handler = async (m, {
    args,
    conn
}) => {
    const subcommand = (args[0] || '').toLowerCase();

    switch (subcommand) {

        case 'search': {
            const keyword = args.slice(1).join(' ');
            if (!keyword) return m.reply('Masukkan judul webtoon');

            await m.reply('Mencari...');

            try {
                const url = global.API('theresav', '/manga/webtoon/search', {
                    q: encodeURIComponent(keyword)
                }, 'apikey');

                const {
                    data
                } = await axios.get(url);

                if (!data?.status || !data?.result)
                    return m.reply('Tidak ditemukan');

                const all = [...(data.result.original || []), ...(data.result.canvas || [])];

                const seen = new Set();
                const unique = all.filter(v => {
                    if (!v?.link) return false;
                    if (seen.has(v.link)) return false;
                    seen.add(v.link);
                    return true;
                });

                if (!unique.length) return m.reply('Tidak ditemukan');

                let rows = unique.map(v => ({
                    header: v.viewCount || '',
                    title: v.title || 'No title',
                    description: v.author || '-',
                    id: \`.webtoon detail \${v.link}\