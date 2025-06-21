import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="relative inline-flex h-8 w-14 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      aria-label="Toggle dark mode"
    >
      <div
        className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white dark:bg-gray-800 shadow-md transform transition-transform duration-300 flex items-center justify-center ${
          isDarkMode ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        {isDarkMode ? (
          <Moon className="h-3 w-3 text-blue-400" />
        ) : (
          <Sun className="h-3 w-3 text-yellow-500" />
        )}
      </div>
      <div className="flex w-full justify-between px-2">
        <Sun className={`h-3 w-3 transition-opacity duration-300 ${isDarkMode ? 'opacity-40' : 'opacity-100'} text-yellow-500`} />
        <Moon className={`h-3 w-3 transition-opacity duration-300 ${isDarkMode ? 'opacity-100' : 'opacity-40'} text-blue-400`} />
      </div>
    </button>
  );
};

export default DarkModeToggle;