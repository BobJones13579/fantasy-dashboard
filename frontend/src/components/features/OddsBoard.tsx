import React, { useState, useEffect } from 'react';
import { MatchupCard } from './MatchupCard';

interface Matchup {
  id: string;
  week: number;
  home_team: {
    id: number;
    name: string;
    win_probability: number;
    moneyline: number;
    spread: number;
    projected_score: number;
  };
  away_team: {
    id: number;
    name: string;
    win_probability: number;
    moneyline: number;
    spread: number;
    projected_score: number;
  };
  total: number;
  over_odds: number;
  under_odds: number;
  last_updated: string;
}

export const OddsBoard: React.FC = () => {
  const [matchups, setMatchups] = useState<Matchup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatchups = async () => {
    try {
      setError(null);
      const response = await fetch('http://localhost:8000/api/v1/odds/matchups/1');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch matchups: ${response.statusText}`);
      }
      
      const data = await response.json();
      setMatchups(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchups();
    
    // Set up auto-refresh every 30 seconds as specified in documentation
    const interval = setInterval(fetchMatchups, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error loading matchups: {error}</p>
        <button 
          onClick={fetchMatchups}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {matchups.map(matchup => (
        <MatchupCard key={matchup.id} matchup={matchup} />
      ))}
    </div>
  );
};
