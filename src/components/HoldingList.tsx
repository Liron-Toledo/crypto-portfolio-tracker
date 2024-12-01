import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Link } from 'react-router-dom';
import { useFetchCryptoPrices } from '../hooks/useFetchCryptoData';
import { deleteHolding } from '../features/holdings/holdingsSlice';

const HoldingsList: React.FC = () => {
  const holdings = useSelector((state: RootState) => state.holdings.items);
  const dispatch = useDispatch();

  // Fetch prices for all holdings
  const { data: pricesData, isLoading, isError } = useFetchCryptoPrices(holdings);

  return (
    <div>
      <Link
        to="/add"
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Add Holding
      </Link>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th>Symbol</th>
            <th>Quantity</th>
            <th>Current Price</th>
            <th>Total Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding) => {
            const price = pricesData?.[holding.coinGeckoId.toLowerCase()]?.usd;

            if (!price && pricesData) {
              console.warn(`Price data missing for ${holding.coinGeckoId}`);
            }

            return (
              <tr key={holding.id}>
                <td className="py-2">{holding.name}</td>
                <td>{holding.symbol}</td>
                <td>{holding.quantity}</td>
                <td>
                  {isLoading
                    ? 'Loading...'
                    : isError
                      ? <span className="text-red-500">Error fetching prices</span>
                      : price !== undefined
                        ? `$${price}`
                        : 'N/A'}
                </td>
                <td>
                  {price !== undefined
                    ? `$${(price * holding.quantity).toFixed(2)}`
                    : 'Calculating...'}
                </td>
                <td>
                  <Link
                    to={`/details/${holding.id}`}
                    className="text-blue-500 mr-2 hover:underline"
                  >
                    Details
                  </Link>
                  <Link
                    to={`/edit/${holding.id}`}
                    className="text-green-500 mr-2 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => dispatch(deleteHolding(holding.id))}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default HoldingsList;