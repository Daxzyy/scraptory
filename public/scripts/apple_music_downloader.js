const axios = require('axios')

const headers = {
  'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
  'Accept': 'application/json, text/javascript, */*; q=0.01',
  'origin': 'https://aaplmusicdownloader.com',
  'referer': 'https://aaplmusicdownloader.com/',
  'sec-fetch-site': 'same-origin',
  'sec-fetch-mode': 'cors',
  'accept-language': 'id-ID,id;q=0.9,en-AU;q=0.8,en;q=0.7,en-US;q=0.6'
}

async function aapldown(url) {
  const init = await axios.get('https://aaplmusicdownloader.com/', { headers })
  const cookies = init.headers['set-cookie']
  const cookieStr = cookies ? cookies.map(c => c.split(';')[0]).join('; ') : ''

  const reqheaders = { ...headers, 'Cookie': cookieStr, 'x-requested-with': 'XMLHttpRequest' }

  const metadata = await axios.get(\`https://aaplmusicdownloader.com/api/song_url.php?url=\${encodeURIComponent(url)}\