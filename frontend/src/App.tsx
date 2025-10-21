import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Fantasy Football Companion</h1>
          <p className="text-blue-100">Your ultimate fantasy football betting platform</p>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome to Fantasy Football Companion!</h2>
          <p className="text-gray-600 mb-4">
            This is your ultimate fantasy football companion app with betting-style odds, 
            strategic analytics, and social competition features.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800">Live Odds Board</h3>
              <p className="text-green-600 text-sm">Real-time matchup odds and probabilities</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800">FAAB Predictor</h3>
              <p className="text-blue-600 text-sm">Strategic waiver wire bidding insights</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800">Trade Tracker</h3>
              <p className="text-purple-600 text-sm">Historical trade analysis and value flow</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> This is a development version. Connect your ESPN league to get started!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
