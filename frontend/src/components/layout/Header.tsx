import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Fantasy Football Companion</h1>
          <p className="text-blue-100 text-sm">Your ultimate fantasy football betting platform</p>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="#odds" className="hover:text-blue-200 transition-colors">Live Odds</a>
          <a href="#betting" className="hover:text-blue-200 transition-colors">Betting</a>
          <a href="#faab" className="hover:text-blue-200 transition-colors">FAAB Predictor</a>
          <a href="#trades" className="hover:text-blue-200 transition-colors">Trade Tracker</a>
        </nav>
        <div className="flex items-center space-x-4">
          <div className="bg-blue-500 px-3 py-1 rounded-full text-sm">
            League TB12
          </div>
          <button className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded transition-colors">
            Settings
          </button>
        </div>
      </div>
    </header>
  );
};
