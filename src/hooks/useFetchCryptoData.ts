import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

/**
 * Fetch prices for multiple cryptocurrencies in a single batch.
 * This hook uses the CoinGecko API to retrieve the current prices in USD for all provided holdings.
 *
 * @param holdings - An array of holdings, each containing a `coinGeckoId`.
 * @returns A React Query object with the fetched price data, loading state, and error information.
 */
export const useFetchCryptoPrices = (holdings: { coinGeckoId: string }[]) => {
    return useQuery({
        // Unique query key based on all holdings' CoinGecko IDs
        queryKey: ['cryptoPrices', holdings.map((h) => h.coinGeckoId).join(',')],
        queryFn: async () => {
            // Prepare the comma-separated list of CoinGecko IDs
            const ids = holdings.map((h) => h.coinGeckoId.toLowerCase()).join(',');

            // Fetch prices from the backend
            const response = await axios.get(`http://localhost:3000/api/prices`, {
                params: {
                    ids, // IDs of the cryptocurrencies
                    vs_currencies: 'usd', // Fetch prices in USD
                },
            });

            // Return the fetched data
            return response.data;
        },
        enabled: holdings.length > 0, // Only fetch if there are holdings
        staleTime: 15 * 60 * 1000, // Cache data for 15 minutes
    });
};

/**
 * Fetch historical price data for a specific cryptocurrency.
 * This hook uses the CoinGecko API to retrieve the price history over a specified number of days.
 *
 * @param id - The CoinGecko ID of the cryptocurrency.
 * @param days - The number of days of historical data to retrieve.
 * @returns A React Query object with the historical price data, loading state, and error information.
 */
export const useFetchCryptoHistory = (
    id: string | undefined,
    days: string
) => {
    return useQuery<
        { date: string; price: number }[], // The shape of the returned data
        Error // The shape of any error
    >({
        // Unique query key based on the cryptocurrency ID and timeframe
        queryKey: ['cryptoHistory', id, days],
        queryFn: async ({ queryKey }) => {
            const [, cryptoId, days] = queryKey;

            // Validate the crypto ID
            if (!cryptoId || typeof cryptoId !== 'string') {
                throw new Error('Invalid crypto ID');
            }

            // Fetch historical data from the backend
            const response = await axios.get(`http://localhost:3000/api/history`, {
                params: {
                    id: cryptoId.toLowerCase(), // Use lowercase ID for API consistency
                    days, // Timeframe for historical data
                },
            });

            // Transform the data into an array of { date, price } objects
            return response.data.prices.map(
                ([timestamp, price]: [number, number]) => ({
                    date: new Date(timestamp).toLocaleDateString(),
                    price,
                })
            );
        },
        enabled: !!id, // Only fetch if the ID is defined
        staleTime: 0, // Always consider the data stale
        refetchInterval: false, // No automatic refetching
    });
};

/**
 * Fetch a list of all available cryptocurrencies and their metadata.
 * This hook uses the CoinGecko API to retrieve a list of coins, including their ID, symbol, and name.
 *
 * @returns A React Query object with the coin list, loading state, and error information.
 */
export const useFetchCoinList = () => {
    return useQuery<
        { id: string; symbol: string; name: string }[], // The shape of the returned data
        Error // The shape of any error
    >({
        // Unique query key for the coin list
        queryKey: ['coinList'],
        queryFn: async () => {
            // Fetch the coin list from the backend
            const response = await axios.get(`http://localhost:3000/api/coinlist`);
            return response.data;
        },
        staleTime: 15 * 60 * 1000, // Cache data for 15 minutes
    });
};