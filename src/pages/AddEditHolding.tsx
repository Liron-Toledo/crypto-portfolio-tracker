import React from 'react';
import { useParams } from 'react-router-dom';
import HoldingForm from '../components/HoldingForm';

const AddEditHolding: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <HoldingForm holdingId={id} />
    </div>
  );
};

export default AddEditHolding;