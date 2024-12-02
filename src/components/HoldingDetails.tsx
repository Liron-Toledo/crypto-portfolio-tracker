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
import { FaArrowLeft } from 'react-icons/fa';

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
    return (
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Holding not found.</h2>
        <Link
          to="/"
          className="flex items-center text-blue-500 hover:underline"
        >
          <FaArrowLeft className="mr-2" /> Back to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto bg-white px-4 py-2 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-left">
        {holding.name} Details
      </h2>
      <div className="mb-6 space-y-2">
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
        
        {/* Timeframe Buttons for Desktop */}
        <div className="hidden md:flex space-x-2 mt-2">
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
              className={`px-3 py-1 rounded ${
                timeframe === option.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              } transition`}
            >
              {option.label}
            </button>
          ))}
        </div>
        
        {/* Timeframe Dropdown for Mobile */}
        <div className="md:hidden mt-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1">1D</option>
            <option value="7">7D</option>
            <option value="30">1M</option>
            <option value="90">3M</option>
            <option value="365">1Y</option>
          </select>
        </div>
      </div>
      {/* Chart */}
      {isLoading ? (
        <div className="flex justify-center items-center">
          <span className="text-gray-600">Loading chart...</span>
        </div>
      ) : error ? (
        <div className="text-red-500">
          Error loading chart: {error.message}
        </div>
      ) : data && data.length > 0 ? (
        <div className="w-full h-64 md:h-96">
          <ResponsiveContainer>
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis dataKey="price" />
              <Tooltip />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="price" stroke="#3182ce" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-gray-600">No data available for chart.</div>
      )}
      {/* Back Link */}
      <div className="mt-6">
        <Link
          to="/"
          className="flex items-center text-blue-500 hover:underline"
        >
          <FaArrowLeft className="mr-2" /> Back to Portfolio
        </Link>
      </div>
    </div>
  );
};

export default HoldingDetails;