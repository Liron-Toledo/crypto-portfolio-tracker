import React from 'react';
import HoldingsList from '../components/HoldingList';
import Header from '../components/Header';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200 transition-colors duration-300">
          My Crypto Portfolio
        </h1>
        <HoldingsList />
      </main>
    </div>
  );
};

export default Home;