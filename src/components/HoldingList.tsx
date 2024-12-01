import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Link } from 'react-router-dom';

const HoldingsList: React.FC = () => {
  const holdings = useSelector((state: RootState) => state.holdings.items);

  return (
    <div>
      <Link
        to="/add"
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Add Holding
      </Link>
      <table className="min-w-full bg-white">
        {/* Table headers */}
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
        {/* Table body */}
        <tbody>
          {holdings.map((holding) => (
            <tr key={holding.id}>
              <td className="py-2">{holding.name}</td>
              <td>{holding.symbol}</td>
              <td>{holding.quantity}</td>
              <td>{/* Display current price */}</td>
              <td>{/* Display total value */}</td>
              <td>
                <Link
                  to={`/details/${holding.id}`}
                  className="text-blue-500 mr-2"
                >
                  Details
                </Link>
                <Link
                  to={`/edit/${holding.id}`}
                  className="text-green-500 mr-2"
                >
                  Edit
                </Link>
                {/* Add delete action */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HoldingsList;