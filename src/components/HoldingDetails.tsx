import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { useFetchCryptoHistory } from '../hooks/useFetchCryptoData';
import { Link } from 'react-router-dom';

interface HoldingDetailsProps {
  holdingId: string;
}

const HoldingDetails: React.FC<HoldingDetailsProps> = ({ holdingId }) => {
  const holding = useSelector((state: RootState) =>
    state.holdings.items.find((item) => item.id === holdingId)
  );

  const [timeframe, setTimeframe] = useState('7'); // Default timeframe is 7 days

  const { data, isLoading, error } = useFetchCryptoHistory(
    holding?.coinGeckoId,
    timeframe
  );

  if (!holding) {
    return <div>Holding not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">{holding.name} Details</h2>
      <div className="mb-6">
        <p>
          <strong>Symbol:</strong> {holding.symbol.toUpperCase()}
        </p>
        <p>
          <strong>Quantity:</strong> {holding.quantity}
        </p>
      </div>
      {/* Timeframe Controls */}
      <div className="mb-4">
        <span className="font-semibold mr-2">Select Timeframe:</span>
        {[
          { label: '1D', value: '1' },
          { label: '7D', value: '7' },
          { label: '1M', value: '30' },
          { label: '3M', value: '90' },
          { label: '1Y', value: '365' },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setTimeframe(option.value)}
            className={`px-3 py-1 mr-2 rounded ${
              timeframe === option.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {isLoading ? (
        <div>Loading chart...</div>
      ) : error ? (
        <div>Error loading chart: {error.message}</div>
      ) : data && data.length > 0 ? (
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis dataKey="price" />
              <Tooltip />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="price" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div>No data available for chart.</div>
      )}
      <div className="mt-6">
        <Link to="/" className="text-blue-500 hover:underline">
          &larr; Back to Portfolio
        </Link>
      </div>
    </div>
  );
};

export default HoldingDetails;