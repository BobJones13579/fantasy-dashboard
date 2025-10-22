import React from 'react';

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

interface MatchupCardProps {
  matchup: Matchup;
}

export const MatchupCard: React.FC<MatchupCardProps> = ({ matchup }) => {
  const formatMoneyline = (odds: number) => {
    return odds > 0 ? `+${odds}` : odds.toString();
  };

  const formatProbability = (prob: number) => {
    return `${(prob * 100).toFixed(1)}%`;
  };

  const formatSpread = (spread: number) => {
    return spread > 0 ? `+${spread}` : spread.toString();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <div className="text-center flex-1">
          <h3 className="font-semibold text-lg mb-2">{matchup.away_team.name}</h3>
          <p className="text-sm text-gray-600 mb-1">Win Prob: {formatProbability(matchup.away_team.win_probability)}</p>
          <p className="text-sm text-gray-600 mb-1">Odds: {formatMoneyline(matchup.away_team.moneyline)}</p>
          <p className="text-sm text-gray-600 mb-1">Spread: {formatSpread(matchup.away_team.spread)}</p>
          <p className="text-xs text-gray-500">Proj: {matchup.away_team.projected_score.toFixed(1)}</p>
        </div>
        
        <div className="text-center mx-4">
          <p className="text-lg font-bold text-gray-700">VS</p>
          <p className="text-sm text-gray-600 mt-2">Week {matchup.week}</p>
          <p className="text-sm text-gray-600">Total: {matchup.total}</p>
          <p className="text-xs text-gray-500 mt-1">
            O: {formatMoneyline(matchup.over_odds)} / U: {formatMoneyline(matchup.under_odds)}
          </p>
        </div>
        
        <div className="text-center flex-1">
          <h3 className="font-semibold text-lg mb-2">{matchup.home_team.name}</h3>
          <p className="text-sm text-gray-600 mb-1">Win Prob: {formatProbability(matchup.home_team.win_probability)}</p>
          <p className="text-sm text-gray-600 mb-1">Odds: {formatMoneyline(matchup.home_team.moneyline)}</p>
          <p className="text-sm text-gray-600 mb-1">Spread: {formatSpread(matchup.home_team.spread)}</p>
          <p className="text-xs text-gray-500">Proj: {matchup.home_team.projected_score.toFixed(1)}</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          Last updated: {new Date(matchup.last_updated).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};
