import React from 'react';
import HoldingsList from '../components/HoldingList'

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-blue-600">
            CryptoTracker
          </a>
          <div>
            <a
              href="/add"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Holding
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">
          My Crypto Portfolio
        </h1>
        <HoldingsList />
      </main>
    </div>
  );
};

export default Home;