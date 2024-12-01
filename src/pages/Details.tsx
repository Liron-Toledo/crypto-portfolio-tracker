import React from 'react';
import { useParams } from 'react-router-dom';

const Details: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto p-4">
      <div>{id}</div>
    </div>
  );
};

export default Details;