import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa'; // Icons for toggle

const Header: React.FC = () => {
  // State to manage dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  // On component mount, check localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      // If no preference saved, check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          CryptoTracker
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            to="/add"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300"
          >
            Add Holding
          </Link>
          {/* Dark/Light Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="focus:outline-none text-gray-800 dark:text-gray-200"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;