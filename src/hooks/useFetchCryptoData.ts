import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useFetchCryptoPrice = async (symbol: string) => {
    if (!symbol) {
        throw new Error('Symbol is undefined');
    }

    const response = await axios.get(`http://localhost:3000/api/price`, {
        params: {
            ids: symbol.toLowerCase(), // CoinGecko IDs are lowercase
            vs_currencies: 'usd',
        },
    });

    const price = response.data[symbol.toLowerCase()]?.usd;

    if (price === undefined) {
        throw new Error(`Price data not available for symbol: ${symbol}`);
    }

    return price;
};

// Fetch prices for multiple cryptocurrencies in a single batch
export const useFetchCryptoPrices = (holdings: { coinGeckoId: string }[]) => {
    return useQuery({
      queryKey: ['cryptoPrices', holdings.map((h) => h.coinGeckoId).join(',')],
      queryFn: async () => {
        const ids = holdings.map((h) => h.coinGeckoId.toLowerCase()).join(',');
        const response = await axios.get(`http://localhost:3000/api/prices`, {
          params: {
            ids,
            vs_currencies: 'usd',
          },
        });
        return response.data;
      },
      enabled: holdings.length > 0, // Only fetch if there are holdings
      staleTime: 15 * 60 * 1000, // Cache data for 15 minutes
    });
  };

export const useFetchCryptoHistory = (id: string | undefined) => {
    return useQuery<
        { date: string; price: number }[],
        Error
    >({
        queryKey: ['cryptoHistory', id],
        queryFn: async ({ queryKey }) => {
            const [, cryptoId] = queryKey;

            if (!cryptoId || typeof cryptoId !== 'string') {
                throw new Error('Invalid crypto ID');
            }

            const response = await axios.get(`http://localhost:3000/api/history`, {
                params: {
                    id: cryptoId.toLowerCase(),
                    days: '7',
                },
            });

            return response.data.prices.map(([timestamp, price]: [number, number]) => ({
                date: new Date(timestamp).toLocaleDateString(),
                price,
            }));
        },
        enabled: !!id,
        staleTime: 0,
        refetchInterval: false,
    });
};

export const useFetchCoinList = () => {
    return useQuery<
        { id: string; symbol: string; name: string }[],
        Error
    >({
        queryKey: ['coinList'],
        queryFn: async () => {
            const response = await axios.get(`http://localhost:3000/api/coinlist`);
            return response.data;
        },
        staleTime: 15 * 60 * 1000, // Cache data for 15 minutes,
    });
};