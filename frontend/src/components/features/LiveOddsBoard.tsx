import React, { useState, useEffect } from 'react';

interface MatchupOdds {
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

interface LiveOddsBoardProps {
  week?: number;
}

export const LiveOddsBoard: React.FC<LiveOddsBoardProps> = ({ week }) => {
  const [odds, setOdds] = useState<MatchupOdds[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState(week || 1);

  useEffect(() => {
    const fetchOdds = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const url = week 
          ? `http://localhost:8000/api/v1/odds/matchups/${selectedWeek}`
          : `http://localhost:8000/api/v1/odds/matchups?week=${selectedWeek}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch odds: ${response.statusText}`);
        }
        
        const oddsData = await response.json();
        setOdds(oddsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchOdds();
  }, [selectedWeek, week]);

  const formatMoneyline = (odds: number) => {
    return odds > 0 ? `+${odds}` : odds.toString();
  };

  const formatProbability = (prob: number) => {
    return `${(prob * 100).toFixed(1)}%`;
  };

  const formatSpread = (spread: number) => {
    return spread > 0 ? `+${spread}` : spread.toString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Live Matchup Odds</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Live Matchup Odds</h2>
        <div className="flex items-center space-x-2">
          <label htmlFor="week-select" className="text-sm font-medium text-gray-700">
            Week:
          </label>
          <select
            id="week-select"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(Number(e.target.value))}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            {Array.from({ length: 18 }, (_, i) => i + 1).map((w) => (
              <option key={w} value={w}>Week {w}</option>
            ))}
          </select>
        </div>
      </div>

      {odds.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No odds data available for Week {selectedWeek}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {odds.map((matchup, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-3">
                <div className="text-sm text-gray-500">
                  Week {matchup.week} • Last updated: {new Date(matchup.last_updated).toLocaleTimeString()}
                </div>
                <div className="text-sm font-medium text-gray-700">
                  Total: {matchup.total}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Home Team */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-blue-800">{matchup.home_team.name}</h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">HOME</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Win Probability</div>
                      <div className="font-semibold text-blue-700">
                        {formatProbability(matchup.home_team.win_probability)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Moneyline</div>
                      <div className="font-semibold text-blue-700">
                        {formatMoneyline(matchup.home_team.moneyline)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Spread</div>
                      <div className="font-semibold text-blue-700">
                        {formatSpread(matchup.home_team.spread)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Projected</div>
                      <div className="font-semibold text-blue-700">
                        {matchup.home_team.projected_score.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Away Team */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-green-800">{matchup.away_team.name}</h3>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">AWAY</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Win Probability</div>
                      <div className="font-semibold text-green-700">
                        {formatProbability(matchup.away_team.win_probability)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Moneyline</div>
                      <div className="font-semibold text-green-700">
                        {formatMoneyline(matchup.away_team.moneyline)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Spread</div>
                      <div className="font-semibold text-green-700">
                        {formatSpread(matchup.away_team.spread)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Projected</div>
                      <div className="font-semibold text-green-700">
                        {matchup.away_team.projected_score.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Over/Under */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-center space-x-8 text-sm">
                  <div className="text-center">
                    <div className="text-gray-600">Over {matchup.total}</div>
                    <div className="font-semibold text-gray-700">{formatMoneyline(matchup.over_odds)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600">Under {matchup.total}</div>
                    <div className="font-semibold text-gray-700">{formatMoneyline(matchup.under_odds)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
