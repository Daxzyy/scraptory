import fs from 'fs';
import axios from 'axios';
import PDFDocument from 'pdfkit';
import {
    finished
} from 'stream/promises';
import sharp from 'sharp';

const TMP_DIR = './tmp';
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR);

const HEADERS = {
    'User-Agent': 'Mozilla/5.0',
    'Accept': 'image/webp,image/,/;q=0.8',
    'Referer': 'https://softkomik.co/'
};

const getBuffer = async (url) => {
    try {
        const res = await axios.get(url, {
            headers: HEADERS,
            responseType: 'arraybuffer'
        });
        return Buffer.from(res.data);
    } catch {
        return null;
    }
};

const downloadImage = async (url, dest) => {
    const res = await axios.get(url, {
        headers: HEADERS,
        responseType: 'arraybuffer',
        validateStatus: s => s < 500
    });

    if (res.status !== 200) throw new Error('Bad image');

    await sharp(Buffer.from(res.data))
        .jpeg({
            quality: 90
        })
        .toFile(dest);
};

let handler = async (m, {
    args,
    conn
}) => {
    const cmd = (args[0] || '').toLowerCase();

    switch (cmd) {

        case 'search': {
            const q = args.slice(1).join(' ');
            if (!q) return m.reply('Masukkan judul');

            await m.reply('Mencari...');

            try {
                const {
                    data
                } = await axios.get(
                    global.API('theresav', '/manga/softkomik/search', {
                        q
                    }, 'apikey')
                );

                if (!data?.status || !data?.result?.length)
                    return m.reply('Tidak ditemukan');

                const rows = data.result.map(v => ({
                    title: v.title,
                    description: v.href,
                    id: \`.softkomik detail \${encodeURIComponent(v.href)}\