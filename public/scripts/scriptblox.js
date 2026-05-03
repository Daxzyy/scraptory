import axios from 'axios';

const query = process.argv.slice(2).join(' ');

if (!query) {
  console.log('usage: node scriptblox.js <query>');
  process.exit(1);
}

async function scrapeAllScripts() {
  const results = [];
  let page = 1;
  
  while (true) {
    try {
      const response = await axios.get('https://scriptblox.com/api/script/search', {
        params: {
          q: query,
          page: page,
          max: 20
        },
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      });
      
      const scripts = response.data.result?.scripts;
      if (!scripts || scripts.length === 0) break;
      
      for (const script of scripts) {
        results.push({
          title: script.title,
          script: script.script
        });
      }
      
      console.error(`page ${page} - ${scripts.length} script`);
      page++;
      
      if (scripts.length < 20) break;
    } catch (error) {
      console.error(`error: ${error.message}`);
      if (error.response) {
        console.error(`status: ${error.response.status}`);
        console.error(`data:`, error.response.data);
      }
      break;
    }
  }
  
  console.log(JSON.stringify(results, null, 2));
}

scrapeAllScripts();