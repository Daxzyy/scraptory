const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const cheerio = require('cheerio');

async function test(imagePath) {
  const BASE = 'https://www.image-search.org';

  const form = new FormData();
  form.append('img', fs.createReadStream(imagePath));
  form.append('check', 'Search Similar Images');

  const res = await axios.post(BASE + '/', form, {
    headers: {
      ...form.getHeaders(),
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      'Origin': BASE,
      'Referer': BASE + '/',
    },
    validateStatus: null,
  });

  const $ = cheerio.load(res.data);

  const results = {};
  $('.result-area a, .result_img a, .search-result a').each((i, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    if (href.includes('lens.google.com')) results.google = href;
    else if (href.includes('bing.com')) results.bing = href;
    else if (href.includes('yandex.com')) results.yandex = href;
    else if (href.includes('baidu.com')) results.baidu = href;
    else if (href.includes('sogou.com')) results.sogou = href;
    else if (href.includes('tineye.com')) results.tineye = href;
  });

  const uploadedImageUrl = results.google
    ? new URL(results.google).searchParams.get('url')
    : null;

  return {
    imagePath,
    status: res.status,
    uploadedImageUrl,
    results,
  };
}

return test('./image2.jpg')