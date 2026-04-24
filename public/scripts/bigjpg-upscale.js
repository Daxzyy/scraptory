import fs from 'fs';
import crypto from 'crypto';
import sizeOf from 'image-size';

export async function upscale(path) {
    try {
        const buf = fs.readFileSync(path);
        const stat = fs.statSync(path);
        const dim = sizeOf(buf);
        const name = path.split('/').pop();

        // upload image to tmpfiles
        const f = new FormData();
        f.append('file', new Blob([buf]), name);
        const up = await fetch('https://tmpfiles.org/api/v1/upload', {
            method: 'POST',
            body: f
        }).then(r => r.json());
        if (!up?.data?.url) throw 'upload tmpfiles gagal';
        const imgUrl = up.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');

        // login & get apikey/cookies
        const id = crypto.randomBytes(4).toString('hex');
        const login = await fetch('https://bigjpg.com/login', {
            method: 'POST',
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                username: \`user_\${id}@gmail.com\