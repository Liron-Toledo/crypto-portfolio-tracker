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

  return (
    <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {holdingId ? 'Edit Holding' : 'Add New Holding'}
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Cryptocurrency */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Cryptocurrency</label>
          {isCoinListLoading ? (
            <p>Loading coin list...</p>
          ) : (
            <select
              name="coinGeckoId"
              value={formState.coinGeckoId}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a coin</option>
              {coinList?.map((coin) => (
                <option key={coin.id} value={coin.id}>
                  {coin.name} ({coin.symbol.toUpperCase()})
                </option>
              ))}
            </select>
          )}
        </div>
        {/* Display Name and Symbol */}
        {formState.name && formState.symbol && (
          <div className="mb-4">
            <p>
              <strong>Name:</strong> {formState.name}
            </p>
            <p>
              <strong>Symbol:</strong> {formState.symbol}
            </p>
          </div>
        )}
        {/* Quantity */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formState.quantity}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        {/* Buttons */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          >
            {holdingId ? 'Update Holding' : 'Add Holding'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default HoldingForm;