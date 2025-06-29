import axios from 'axios';

export async function askLoky(question: string) {
  try {
    const data = JSON.stringify({
      "api_key": "1b4c4e2337194e439378818481163331",
      "chain": "base",
      "question": question
    });

    const config = {
      method: 'post' as const,
      maxBodyLength: Infinity,
      url: 'https://api.dapplooker.com/v1/ask-loky',
      headers: { 
        'Content-Type': 'application/json'
      },
      data: data
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error asking Loky:', error);
    throw error;
  }
}



export async function getMarketData(ticker: string) {
  try {

    const config = {
      method: 'get' as const,
      maxBodyLength: Infinity,
      url: `https://api.dapplooker.com/v1/crypto-market?api_key=1b4c4e2337194e439378818481163331&chain=base&token_tickers=${ticker}`,
      headers: { 
        'Content-Type': 'application/json'
      },
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error getting market data:', error);
    throw error;
  }
}

