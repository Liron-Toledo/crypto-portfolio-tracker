import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Link } from 'react-router-dom';
import { useFetchCryptoPrices } from '../hooks/useFetchCryptoData';
import { deleteHolding } from '../features/holdings/holdingsSlice';
import { FaTrash, FaEdit, FaInfoCircle } from 'react-icons/fa';

const HoldingsList: React.FC = () => {
  const holdings = useSelector((state: RootState) => state.holdings.items);
  const dispatch = useDispatch();

  // Fetch prices for all holdings
  const { data: pricesData, isLoading, isError } = useFetchCryptoPrices(holdings);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Symbol</th>
            <th className="py-3 px-4 text-left">Quantity</th>
            <th className="py-3 px-4 text-left">Current Price</th>
            <th className="py-3 px-4 text-left">Total Value</th>
            <th className="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding, index) => {
            const price = pricesData?.[holding.coinGeckoId.toLowerCase()]?.usd;

            return (
              <tr
                key={holding.id}
                className={`border-b ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                } hover:bg-gray-100`}
              >
                <td className="py-3 px-4">{holding.name}</td>
                <td className="py-3 px-4 uppercase">{holding.symbol}</td>
                <td className="py-3 px-4">{holding.quantity}</td>
                <td className="py-3 px-4">
                  {isLoading ? (
                    'Loading...'
                  ) : isError ? (
                    <span className="text-red-500">Error fetching prices</span>
                  ) : price !== undefined ? (
                    `$${price.toLocaleString()}`
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="py-3 px-4">
                  {price !== undefined ? (
                    `$${(price * holding.quantity).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  ) : (
                    'Calculating...'
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center space-x-4">
                    <Link
                      to={`/details/${holding.id}`}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <FaInfoCircle title="Details" />
                    </Link>
                    <Link
                      to={`/edit/${holding.id}`}
                      className="text-green-500 hover:text-green-600"
                    >
                      <FaEdit title="Edit" />
                    </Link>
                    <button
                      onClick={() => dispatch(deleteHolding(holding.id))}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FaTrash title="Delete" />
                    </button>
                  </div>
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