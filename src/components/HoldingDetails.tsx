import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useFetchCryptoHistory } from '../hooks/useFetchCryptoData';

interface HoldingDetailsProps {
  holdingId: string;
}

const HoldingDetails: React.FC<HoldingDetailsProps> = ({ holdingId }) => {
  const holding = useSelector((state: RootState) =>
    state.holdings.items.find((item) => item.id === holdingId)
  );

  const { data, isLoading, error } = useFetchCryptoHistory(holding?.coinGeckoId);
  
  if (!holding) {
    return <div>Holding not found.</div>;
  }

  if (isLoading) {
    return <div>Loading chart...</div>;
  }

  if (error) {
    return <div>Error loading chart: {error.message}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{holding.name} Details</h2>
      {data && data.length > 0 ? (
        <LineChart width={600} height={300} data={data}>
          <XAxis dataKey="date" />
          <YAxis dataKey="price" />
          <Tooltip />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="price" stroke="#8884d8" />
        </LineChart>
      ) : (
        <div>No data available for chart.</div>
      )}
    </div>
  );
};

export default HoldingDetails;