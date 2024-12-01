import React from 'react';
import HoldingsList from '../components/HoldingList';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Crypto Portfolio</h1>
      <HoldingsList />
    </div>
  );
};

export default Home;