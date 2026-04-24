import axios from 'axios';

const url = 'https://www.gamersberg.com/api/v1/grow-a-garden/stock';

const fetchStockData = async () => {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Referer': 'https://www.gamersberg.com/',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin'
      }
    });
    
    const stockData = response.data.data[0];
    
    console.log('Player:', stockData.playerName);
    console.log('Session ID:', stockData.sessionId);
    console.log('User ID:', stockData.userId);
    console.log('Weather:', stockData.weather.type, `(${stockData.weather.duration}s)`);
    console.log('Update Number:', stockData.updateNumber);
    
    console.log('\nSeeds:');
    Object.entries(stockData.seeds).forEach(([seed, qty]) => {
      if (parseInt(qty) > 0) console.log(`  ${seed}: ${qty}`);
    });
    
    console.log('\nGear:');
    Object.entries(stockData.gear).forEach(([item, qty]) => {
      if (parseInt(qty) > 0) console.log(`  ${item}: ${qty}`);
    });
    
    console.log('\nEggs:');
    stockData.eggs.forEach(egg => {
      if (egg.quantity > 0) console.log(`  ${egg.name}: ${egg.quantity}`);
    });
    
    return response.data;
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    throw error;
  }
};

fetchStockData();
