// backend/server.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

// Endpoint to fetch current price
app.get('/api/price', async (req, res) => {
    const { ids, vs_currencies } = req.query;

    if (!ids || !vs_currencies) {
        return res.status(400).json({ error: 'Missing required query parameters' });
    }

    try {
        const response = await axios.get(
            'https://api.coingecko.com/api/v3/simple/price',
            {
                params: { ids, vs_currencies },
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching price:', error.message);
        res.status(500).json({ error: 'Error fetching price data' });
    }
});

app.get('/api/prices', async (req, res) => {
    const { ids, vs_currencies } = req.query;
  
    if (!ids || !vs_currencies) {
      return res.status(400).json({ error: 'Missing required query parameters' });
    }
  
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: { ids, vs_currencies },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching prices:', error.message);
      res.status(500).json({ error: 'Error fetching price data' });
    }
  });

// Endpoint to fetch historical data
app.get('/api/history', async (req, res) => {
    const { id, days } = req.query;

    if (!id || !days) {
        return res.status(400).json({ error: 'Missing required query parameters' });
    }

    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
            {
                params: { vs_currency: 'usd', days },
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching history:', error.message);
        res.status(500).json({ error: 'Error fetching historical data' });
    }
});

app.get('/api/coinlist', async (req, res) => {
    try {
        const response = await axios.get(
            'https://api.coingecko.com/api/v3/coins/list'
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching coin list:', error.message);
        res.status(500).json({ error: 'Error fetching coin list' });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running at http://localhost:${PORT}`);
});