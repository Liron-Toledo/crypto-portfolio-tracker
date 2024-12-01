import React from 'react';
import { useParams } from 'react-router-dom';
import HoldingDetails from '../components/HoldingDetails';

const Details: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto p-4">
      <HoldingDetails holdingId={id!} />
    </div>
  );
};

export default Details;