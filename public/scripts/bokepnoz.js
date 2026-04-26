const axios = require('axios');
const cheerio = require('cheerio');

class BokepNoz {
    homepage = async function () {
        try {
            const { data } = await axios.get('https://cloudflare-cors-anywhere.supershadowcube.workers.dev/?url=https://bokepnoz.in/');
            const $ = cheerio.load(data);
            
            const latest = [];
            $('main div.videos-list article').each((_, el) => {
                const title = $(el).find('header.entry-header span').text().trim();
                const thumbnail = $(el).find('img.video-main-thumb').attr('src') || $(el).find('img.video-main-thumb').attr('data-src');
                const url = $(el).find('a').attr('href');
                const duration = $(el).find('span.duration').text().replace(/[^\d:]/g, '').trim();
                const views = $(el).find('span.views').text().replace(/[^\d.KMB]/g, '').trim();
                
                if (title && url) latest.push({ title, duration, views, thumbnail, url });
            });
            
            const trending = [];
            $('aside div.videos-list article').each((_, el) => {
                const title = $(el).find('header.entry-header span').text().trim();
                const thumbnail = $(el).find('img.video-main-thumb').attr('src') || $(el).find('img.video-main-thumb').attr('data-src');
                const url = $(el).find('a').attr('href');
                const duration = $(el).find('span.duration').text().replace(/[^\d:]/g, '').trim();
                const views = $(el).find('span.views').text().replace(/[^\d.KMB]/g, '').trim();
                
                if (title && url) trending.push({ title, duration, views, thumbnail, url });
            });
            
            return {
                latest,
                trending
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    search = async function (q, page = 1) {
        try {
            if (!q) throw new Error('Query is required.');
            if (isNaN(page)) throw new Error('Page must be a number.');
            
            const { data } = await axios.get(parseInt(page) > 1 ? `https://cloudflare-cors-anywhere.supershadowcube.workers.dev/page/${page}/?url=https://bokepnoz.in/?s=${encodeURIComponent(q)}` : `https://cloudflare-cors-anywhere.supershadowcube.workers.dev/?url=https://bokepnoz.in/?s=${encodeURIComponent(q)}`);
            const $ = cheerio.load(data);
            const result = [];
            
            $('main > div > article').each((_, el) => {
                const title = $(el).find('header.entry-header span').text().trim();
                const thumbnail = $(el).find('img.video-main-thumb').attr('src') || $(el).find('img.video-main-thumb').attr('data-src');
                const url = $(el).find('a').attr('href');
                const duration = $(el).find('span.duration').text().replace(/[^\d:]/g, '').trim();
                const views = $(el).find('span.views').text().replace(/[^\d.KMB]/g, '').trim();
                
                if (title && url) result.push({ title, duration, views, thumbnail, url });
            });
            
            let total_pages = 1;
            $('div.pagination ul li a').each((_, el) => {
                const href = $(el).attr('href') || '';
                if ($(el).text().trim().toLowerCase() === 'last') {
                    const match = href.match(/\/page\/(\d+)/);
                    if (match) total_pages = parseInt(match[1]);
                }
            });
            
            if (total_pages && parseInt(page) > total_pages) throw new Error(`Page ${page} exceeds total pages (${total_pages}).`);
            
            return {
                page: parseInt(page),
                total_pages,
                results: result
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    detail = async function (url) {
        try {
            if (!url.includes('bokepnoz.in')) throw new Error('Invalid url.');
            
            const { data } = await axios.get(`https://cloudflare-cors-anywhere.supershadowcube.workers.dev/?url=${url}`);
            const $ = cheerio.load(data);
            
            const title = $('meta[itemprop="name"]').attr('content');
            const cover = $('meta[itemprop="thumbnailUrl"]').attr('content');
            const embed_url = $('meta[itemprop="embedURL"]').attr('content');
            
            const raw_duration = $('meta[itemprop="duration"]').attr('content') || '';
            const h = parseInt(raw_duration.match(/(\d+)H/)?.[1] || 0);
            const m = parseInt(raw_duration.match(/(\d+)M/)?.[1] || 0);
            const s = parseInt(raw_duration.match(/(\d+)S/)?.[1] || 0);
            const duration = `${String((h * 60) + m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
            
            const raw_date = $('meta[itemprop="uploadDate"]').attr('content') || '';
            const d = new Date(raw_date);
            const upload_date = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
            
            const tags = [];
            $('div.tags-list a.label[href*="/tag/"]').each((_, el) => {
                tags.push($(el).text().trim());
            });
            
            const related = [];
            $('div.under-video-block article').each((_, el) => {
                const t = $(el).find('header.entry-header span').text().trim();
                const c = $(el).find('img.video-main-thumb').attr('src') || $(el).find('img.video-main-thumb').attr('data-src');
                const u = $(el).find('a').attr('href');
                const dur = $(el).find('span.duration').text().replace(/[^\d:]/g, '').trim();
                const v = $(el).find('span.views').text().replace(/[^\d.KMB]/g, '').trim();
                if (t && u) related.push({ title: t, duration: dur, views: v, thumbnail: c, url: u });
            });
            
            return {
                title,
                cover,
                duration,
                upload_date,
                embed_url,
                download_url: embed_url?.replace('/e/', '/d/'),
                tags,
                related
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

// Usage:
const b = new BokepNoz();
b.homepage().then(console.log);