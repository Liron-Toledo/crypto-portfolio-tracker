import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addHolding, updateHolding } from '../features/holdings/holdingsSlice';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';

interface HoldingFormProps {
  holdingId?: string;
}

const HoldingForm: React.FC<HoldingFormProps> = ({ holdingId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const holding = useSelector((state: RootState) =>
    state.holdings.items.find((item) => item.id === holdingId)
  );

  const [formState, setFormState] = useState({
    name: '',
    symbol: '',
    quantity: '',
  });

  useEffect(() => {
    if (holding) {
      setFormState({
        name: holding.name,
        symbol: holding.symbol,
        quantity: holding.quantity.toString(),
      });
    }
  }, [holding]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (holdingId) {
      dispatch(
        updateHolding({
          id: holdingId,
          ...formState,
          quantity: parseFloat(formState.quantity),
        })
      );
    } else {
      dispatch(
        addHolding({
          id: Date.now().toString(),
          ...formState,
          quantity: parseFloat(formState.quantity),
        })
      );
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
        <label className="block mb-2">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formState.quantity}
          onChange={handleChange}
          className="border px-2 py-1 w-full"
          required
          min="0"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {holdingId ? 'Update Holding' : 'Add Holding'}
      </button>
    </form>
  );
};

export default HoldingForm;