import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Link } from 'react-router-dom';
import { useFetchCryptoPrices } from '../hooks/useFetchCryptoData';
import { deleteHolding } from '../features/holdings/holdingsSlice';
import { FaTrash, FaEdit, FaInfoCircle, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

type SortKey = 'name' | 'symbol' | 'quantity' | 'price' | 'totalValue';

const HoldingsList: React.FC = () => {
  const holdings = useSelector((state: RootState) => state.holdings.items);
  const dispatch = useDispatch();

  // Fetch prices for all holdings
  const { data: pricesData, isLoading, isError } = useFetchCryptoPrices(holdings);

  // Local state for filter and sort
  const [filterQuery, setFilterQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Handler to change sort key and toggle sort order
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      // Toggle sort order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  // Memoized filtered and sorted holdings
  const filteredAndSortedHoldings = useMemo(() => {
    // Filter holdings based on filterQuery (by name or symbol)
    const filtered = holdings.filter(
      (holding) =>
        holding.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
        holding.symbol.toLowerCase().includes(filterQuery.toLowerCase())
    );

    // Map holdings to include current price and total value
    const holdingsWithPrice = filtered.map((holding) => {
      const price = pricesData?.[holding.coinGeckoId.toLowerCase()]?.usd || 0;
      const totalValue = price * holding.quantity;
      return { ...holding, price, totalValue };
    });

    // Sort holdings based on sortKey and sortOrder
    const sorted = holdingsWithPrice.sort((a, b) => {
      let compareA: string | number = '';
      let compareB: string | number = '';

      switch (sortKey) {
        case 'name':
          compareA = a.name.toLowerCase();
          compareB = b.name.toLowerCase();
          break;
        case 'symbol':
          compareA = a.symbol.toLowerCase();
          compareB = b.symbol.toLowerCase();
          break;
        case 'quantity':
          compareA = a.quantity;
          compareB = b.quantity;
          break;
        case 'price':
          compareA = a.price;
          compareB = b.price;
          break;
        case 'totalValue':
          compareA = a.totalValue;
          compareB = b.totalValue;
          break;
        default:
          break;
      }

      if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1;
      if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [holdings, pricesData, filterQuery, sortKey, sortOrder]);

  // Helper to render sort icons
  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <FaSort className="inline ml-1" />;
    return sortOrder === 'asc' ? (
      <FaSortUp className="inline ml-1" />
    ) : (
      <FaSortDown className="inline ml-1" />
    );
  };

  return (
    <div>
      {/* Filter and Sort Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        {/* Filter Input */}
        <input
          type="text"
          placeholder="Search by name or symbol..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="mb-2 md:mb-0 border border-gray-300 dark:border-gray-600 px-3 py-2 rounded w-full md:w-1/3 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
        />

        {/* Sort Controls */}
        <div className="flex space-x-2">
          {/* Sort Dropdown */}
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          >
            <option value="name">Sort by Name</option>
            <option value="symbol">Sort by Symbol</option>
            <option value="quantity">Sort by Quantity</option>
            <option value="price">Sort by Current Price</option>
            <option value="totalValue">Sort by Total Value</option>
          </select>

          {/* Sort Order Toggle */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          >
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>
      </div>

      {/* Holdings Table for Desktop */}
      <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden hidden md:table transition-colors duration-300">
        <thead className="bg-blue-500 text-white dark:bg-blue-700">
          <tr>
            <th
              className="py-3 px-4 text-left cursor-pointer"
              onClick={() => handleSort('name')}
            >
              Name {renderSortIcon('name')}
            </th>
            <th
              className="py-3 px-4 text-left cursor-pointer"
              onClick={() => handleSort('symbol')}
            >
              Symbol {renderSortIcon('symbol')}
            </th>
            <th
              className="py-3 px-4 text-left cursor-pointer"
              onClick={() => handleSort('quantity')}
            >
              Quantity {renderSortIcon('quantity')}
            </th>
            <th
              className="py-3 px-4 text-left cursor-pointer"
              onClick={() => handleSort('price')}
            >
              Current Price {renderSortIcon('price')}
            </th>
            <th
              className="py-3 px-4 text-left cursor-pointer"
              onClick={() => handleSort('totalValue')}
            >
              Total Value {renderSortIcon('totalValue')}
            </th>
            <th className="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedHoldings.length > 0 ? (
            filteredAndSortedHoldings.map((holding, index) => {
              const { name, symbol, quantity, price, totalValue, id } = holding;

              return (
                <tr
                  key={id}
                  className={`border-b ${
                    index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
                  } hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300`}
                >
                  <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{name}</td>
                  <td className="py-3 px-4 uppercase text-gray-800 dark:text-gray-200">{symbol}</td>
                  <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{quantity}</td>
                  <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                    {isLoading ? (
                      'Loading...'
                    ) : isError ? (
                      <span className="text-red-500">Error</span>
                    ) : price !== undefined ? (
                      `$${price.toLocaleString()}`
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                    {isLoading ? (
                      'Loading...'
                    ) : isError ? (
                      <span className="text-red-500">Error</span>
                    ) : price !== undefined ? (
                      `$${totalValue.toLocaleString(undefined, {
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
                        to={`/details/${id}`}
                        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 transition-colors duration-300"
                        title="Details"
                      >
                        <FaInfoCircle />
                      </Link>
                      <Link
                        to={`/edit/${id}`}
                        className="text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-500 transition-colors duration-300"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => dispatch(deleteHolding(id))}
                        className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500 transition-colors duration-300"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                className="py-3 px-4 text-center text-gray-600 dark:text-gray-400"
                colSpan={6}
              >
                No holdings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Holdings List for Mobile */}
      <div className="space-y-4 md:hidden">
        {filteredAndSortedHoldings.length > 0 ? (
          filteredAndSortedHoldings.map((holding) => {
            const { name, symbol, quantity, price, totalValue, id } = holding;

            return (
              <div
                key={id}
                className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 transition-colors duration-300"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    {name} ({symbol})
                  </h2>
                  <div className="flex space-x-2">
                    <Link
                      to={`/details/${id}`}
                      className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 transition-colors duration-300"
                      title="Details"
                    >
                      <FaInfoCircle />
                    </Link>
                    <Link
                      to={`/edit/${id}`}
                      className="text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-500 transition-colors duration-300"
                      title="Edit"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => dispatch(deleteHolding(id))}
                      className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500 transition-colors duration-300"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="text-gray-700 dark:text-gray-300">
                  <p>
                    <strong>Quantity:</strong> {quantity}
                  </p>
                  <p>
                    <strong>Current Price:</strong>{' '}
                    {isLoading ? (
                      'Loading...'
                    ) : isError ? (
                      <span className="text-red-500">Error</span>
                    ) : price !== undefined ? (
                      `$${price.toLocaleString()}`
                    ) : (
                      'N/A'
                    )}
                  </p>
                  <p>
                    <strong>Total Value:</strong>{' '}
                    {isLoading ? (
                      'Loading...'
                    ) : isError ? (
                      <span className="text-red-500">Error</span>
                    ) : price !== undefined ? (
                      `$${totalValue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    ) : (
                      'Calculating...'
                    )}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-600 dark:text-gray-400">
            No holdings found.
          </div>
        )}
      </div>
    </div>
  );
};

export default HoldingsList;