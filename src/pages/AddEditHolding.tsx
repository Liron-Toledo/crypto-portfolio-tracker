import React from 'react';
import { useParams } from 'react-router-dom';
import HoldingForm from '../components/HoldingForm';

const AddEditHolding: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto p-4">
      <HoldingForm holdingId={id} />
    </div>
  );
};

export default AddEditHolding;