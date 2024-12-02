import React from 'react';
import { useParams } from 'react-router-dom';
import HoldingForm from '../components/HoldingForm';

const AddEditHolding: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6 transition-colors duration-300 text-gray-800 dark:text-gray-200">
      <HoldingForm holdingId={id} />
    </div>
  );
};

export default AddEditHolding;