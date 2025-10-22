import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { TokenBalance } from './components/features/TokenBalance';
import { OddsBoard } from './components/features/OddsBoard';
import { BettingInterface } from './components/features/BettingInterface';

function App() {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedTeamId] = useState<string>('1c49b913-c0cb-4f01-bc24-8ff800ffa999'); // Test team ID
  const [activeTab, setActiveTab] = useState<'odds' | 'betting' | 'faab' | 'trades'>('odds');

  useEffect(() => {
    // In a real app, you'd get the current week from the API
    // For now, we'll use week 1 since the season is over
    setCurrentWeek(1);
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'odds':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Live Matchup Odds</h2>
            <OddsBoard />
          </div>
        );
      case 'betting':
        return <BettingInterface teamId={selectedTeamId} week={currentWeek} />;
      case 'faab':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">FAAB Predictor</h2>
            <p className="text-gray-600">Coming soon! Strategic waiver wire bidding insights.</p>
          </div>
        );
      case 'trades':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Trade Tracker</h2>
            <p className="text-gray-600">Coming soon! Historical trade analysis and value flow.</p>
          </div>
        );
      default:
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Live Matchup Odds</h2>
            <OddsBoard />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto p-4">
        {/* Token Balance - Always visible */}
        <div className="mb-6">
          <TokenBalance teamId={selectedTeamId} week={currentWeek} />
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            {[
              { id: 'odds', label: 'Live Odds', icon: '📊' },
              { id: 'betting', label: 'Betting', icon: '🎯' },
              { id: 'faab', label: 'FAAB Predictor', icon: '💰' },
              { id: 'trades', label: 'Trade Tracker', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Active Tab Content */}
        {renderActiveTab()}

        {/* Development Notice */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>Development Mode:</strong> Using test team data. Connect your ESPN league for full functionality!
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
