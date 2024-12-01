import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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

export const useFetchCryptoHistory = (
    id: string | undefined,
    days: string
) => {
    return useQuery<
        { date: string; price: number }[],
        Error
    >({
        queryKey: ['cryptoHistory', id, days],
        queryFn: async ({ queryKey }) => {
            const [, cryptoId, days] = queryKey;

            if (!cryptoId || typeof cryptoId !== 'string') {
                throw new Error('Invalid crypto ID');
            }

            const response = await axios.get(`http://localhost:3000/api/history`, {
                params: {
                    id: cryptoId.toLowerCase(),
                    days,
                },
            });

            return response.data.prices.map(
                ([timestamp, price]: [number, number]) => ({
                    date: new Date(timestamp).toLocaleDateString(),
                    price,
                })
            );
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