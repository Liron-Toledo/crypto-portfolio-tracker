// backend/server.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const NodeCache = require('node-cache');

const app = express();
const PORT = 3000;
const cache = new NodeCache({ stdTTL: 300 }); // Cache TTL: 5 minutes

// Enable CORS for all routes
app.use(cors());

/**
 * Endpoint to fetch current prices for multiple cryptocurrencies
 */
app.get('/api/prices', async (req, res) => {
    const { ids, vs_currencies } = req.query;
  
    if (!ids || !vs_currencies) {
      console.error('Missing query parameters:', { ids, vs_currencies });
      return res.status(400).json({ error: 'Missing required query parameters' });
    }
  
    const cacheKey = `prices_${ids}_${vs_currencies}`;
    const cachedData = cache.get(cacheKey);
  
    if (cachedData) {
      console.log('Serving /api/prices from cache');
      return res.json(cachedData);
    }
  
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
        params: { ids, vs_currencies },
        timeout: 10000, // 10 seconds timeout
      });
  
      cache.set(cacheKey, response.data);
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching price data:', error.message);
      res.status(500).json({ error: 'Error fetching price data' });
    }
  });

/**
 * Endpoint to fetch historical data for a specific cryptocurrency
 */
app.get('/api/history', async (req, res) => {
    const { id, days } = req.query;
  
    if (!id || !days) {
      console.error('Missing query parameters:', { id, days });
      return res.status(400).json({ error: 'Missing required query parameters' });
    }
  
    const cacheKey = `history_${id}_${days}`;
    const cachedData = cache.get(cacheKey);
  
    if (cachedData) {
      console.log('Serving /api/history from cache');
      return res.json(cachedData);
    }
  
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`, {
        params: { vs_currency: 'usd', days },
        timeout: 10000, // 10 seconds timeout
      });
  
      cache.set(cacheKey, response.data);
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching historical data:', error.message);
      res.status(500).json({ error: 'Error fetching historical data' });
    }
  });


/**
 * Endpoint to fetch the list of all supported coins
 */
app.get('/api/coinlist', async (req, res) => {
    const cacheKey = 'coinlist';
    const cachedData = cache.get(cacheKey);
  
    if (cachedData) {
      console.log('Serving /api/coinlist from cache');
      return res.json(cachedData);
    }
  
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/list', {
        timeout: 10000, // 10 seconds timeout
      });
      cache.set(cacheKey, response.data, 3600); // Cache for 1 hour
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching coin list:', error.message);
      res.status(500).json({ error: 'Error fetching coin list' });
    }
  });

app.listen(PORT, () => {
    console.log(`Proxy server running at http://localhost:${PORT}`);
});