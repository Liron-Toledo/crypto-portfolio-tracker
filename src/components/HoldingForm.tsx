import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addHolding, updateHolding } from '../features/holdings/holdingsSlice';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { useFetchCoinList } from '../hooks/useFetchCryptoData';

interface HoldingFormProps {
  holdingId?: string;
}

const HoldingForm: React.FC<HoldingFormProps> = ({ holdingId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const holding = useSelector((state: RootState) =>
    state.holdings.items.find((item) => item.id === holdingId)
  );

  const { data: coinList, isLoading: isCoinListLoading } = useFetchCoinList();

  const [formState, setFormState] = useState({
    name: '',
    symbol: '',
    coinGeckoId: '',
    quantity: '',
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Updates form based on selected holding
  useEffect(() => {
    if (holding) {
      setFormState({
        name: holding.name,
        symbol: holding.symbol,
        coinGeckoId: holding.coinGeckoId,
        quantity: holding.quantity.toString(),
      });
    }
  }, [holding]);

  // Update name and symbol when coinGeckoId changes
  useEffect(() => {
    if (coinList && formState.coinGeckoId) {
      const selectedCoin = coinList.find(
        (coin) => coin.id === formState.coinGeckoId
      );
      if (selectedCoin) {
        setFormState((prevState) => ({
          ...prevState,
          name: selectedCoin.name,
          symbol: selectedCoin.symbol.toUpperCase(),
        }));
      }
    }
  }, [formState.coinGeckoId, coinList]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedQuantity = parseFloat(formState.quantity);

    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      alert('Quantity must be a positive number.');
      return;
    }

    const holdingData = {
      id: holdingId || Date.now().toString(),
      name: formState.name,
      symbol: formState.symbol,
      coinGeckoId: formState.coinGeckoId,
      quantity: parsedQuantity,
    };

    if (holdingId) {
      dispatch(updateHolding(holdingData));
    } else {
      dispatch(addHolding(holdingData));
    }

    navigate('/');
  };

  // Filtered coin list based on search query (by name or symbol)
  const filteredCoinList = coinList?.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-lg w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200 transition-colors duration-300">
        {holdingId ? 'Edit Holding' : 'Add New Holding'}
      </h2>
      <form onSubmit={handleSubmit}>
        
        {/* Cryptocurrency Selection */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-300">
            Cryptocurrency
          </label>
          {isCoinListLoading ? (
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Loading coin list...
            </p>
          ) : (
            <>
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search by name or symbol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 px-3 py-2 mb-2 w-full rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              />
              {/* Select Dropdown */}
              <select
                name="coinGeckoId"
                value={formState.coinGeckoId}
                onChange={handleChange}
                className="border border-gray-300 dark:border-gray-600 px-3 py-2 w-full rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                required
              >
                <option value="">Select a coin</option>
                {filteredCoinList && filteredCoinList.length > 0 ? (
                  filteredCoinList.map((coin) => (
                    <option key={coin.id} value={coin.id}>
                      {coin.name} ({coin.symbol.toUpperCase()})
                    </option>
                  ))
                ) : (
                  <option disabled>No coins found</option>
                )}
              </select>
            </>
          )}
        </div>
        {/* Display Selected Coin's Name and Symbol */}
        {formState.name && formState.symbol && (
          <div className="mb-4">
            <p className="text-gray-800 dark:text-gray-200">
              <strong>Name:</strong> {formState.name}
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              <strong>Symbol:</strong> {formState.symbol}
            </p>
          </div>
        )}
        {/* Quantity Input */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-300">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            value={formState.quantity}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-600 px-3 py-2 w-full rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
            required
            min="0.00000001"
            step="any"
            placeholder="Enter quantity"
            onInvalid={(e) =>
              (e.target as HTMLInputElement).setCustomValidity(
                'Quantity must be positive'
              )
            }
            onInput={(e) =>
              (e.target as HTMLInputElement).setCustomValidity('')
            }
          />
        </div>
        {/* Form Buttons */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 dark:bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {holdingId ? 'Update Holding' : 'Add Holding'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default HoldingForm;