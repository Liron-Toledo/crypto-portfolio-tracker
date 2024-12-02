import React from 'react';
import { useParams } from 'react-router-dom';
import HoldingDetails from '../components/HoldingDetails';

const Details: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-300">
      <HoldingDetails holdingId={id!} />
    </div>
  );
};

export default Details;