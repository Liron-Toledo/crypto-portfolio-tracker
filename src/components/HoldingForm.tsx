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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-4">
      <div className="mb-4">
        <label className="block mb-2">Cryptocurrency Name</label>
        <input
          type="text"
          name="name"
          value={formState.name}
          onChange={handleChange}
          className="border px-2 py-1 w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Symbol</label>
        <input
          type="text"
          name="symbol"
          value={formState.symbol}
          onChange={handleChange}
          className="border px-2 py-1 w-full"
          required
        />
      </div>
      <div className="mb-4">
    <label className="block mb-2">Cryptocurrency</label>
    {isCoinListLoading ? (
      <p>Loading coin list...</p>
    ) : (
      <select
        name="coinGeckoId"
        value={formState.coinGeckoId}
        onChange={handleChange}
        className="border px-2 py-1 w-full"
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
      <div className="mb-4">
        <label className="block mb-2">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formState.quantity}
          onChange={handleChange}
          className="border px-2 py-1 w-full"
          required
          min="0.00000001"
          step="any"
          onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Quantity must be positive')}
          onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {holdingId ? 'Update Holding' : 'Add Holding'}
      </button>
    </form>
  );
};

export default HoldingForm;