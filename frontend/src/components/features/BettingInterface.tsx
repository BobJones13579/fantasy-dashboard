import React, { useState, useEffect } from 'react';

interface BettingInterfaceProps {
  teamId: string;
  week?: number;
}

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
}

interface BetFormData {
  bet_type: 'moneyline' | 'spread' | 'total';
  bet_selection: string;
  bet_amount: number;
  odds: number;
  bet_value?: number;
  description: string;
}

export const BettingInterface: React.FC<BettingInterfaceProps> = ({ teamId, week = 1 }) => {
  const [odds, setOdds] = useState<MatchupOdds[]>([]);
  const [selectedMatchup, setSelectedMatchup] = useState<MatchupOdds | null>(null);
  const [betForm, setBetForm] = useState<BetFormData>({
    bet_type: 'moneyline',
    bet_selection: '',
    bet_amount: 10,
    odds: -110,
    bet_value: undefined,
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [betting, setBetting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchOdds = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/v1/odds/matchups/${week}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch odds');
        }
        
        const oddsData = await response.json();
        setOdds(oddsData);
        
        if (oddsData.length > 0) {
          setSelectedMatchup(oddsData[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchOdds();
  }, [week]);

  const handleBetTypeChange = (betType: 'moneyline' | 'spread' | 'total') => {
    setBetForm(prev => ({
      ...prev,
      bet_type: betType,
      bet_selection: '',
      bet_value: undefined
    }));
  };

  const handleBetSelection = (selection: string, odds: number, betValue?: number) => {
    setBetForm(prev => ({
      ...prev,
      bet_selection: selection,
      odds: odds,
      bet_value: betValue,
      description: `${prev.bet_type} bet on ${selection}${betValue ? ` (${betValue})` : ''}`
    }));
  };

  const handlePlaceBet = async () => {
    if (!selectedMatchup || !betForm.bet_selection) {
      setError('Please select a bet option');
      return;
    }

    try {
      setBetting(true);
      setError(null);
      setSuccess(null);

      const betData = {
        team_id: teamId,
        week: week,
        bet_type: betForm.bet_type,
        bet_amount: betForm.bet_amount,
        odds: betForm.odds,
        matchup_id: `${selectedMatchup.home_team.id}-${selectedMatchup.away_team.id}-${week}`,
        bet_selection: betForm.bet_selection,
        bet_value: betForm.bet_value,
        description: betForm.description
      };

      const response = await fetch('http://localhost:8000/api/v1/betting/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(betData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to place bet');
      }

      const result = await response.json();
      setSuccess(`Bet placed successfully! Potential payout: ${result.potential_payout} tokens`);
      
      // Reset form
      setBetForm(prev => ({
        ...prev,
        bet_amount: 10,
        bet_selection: '',
        description: ''
      }));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setBetting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error && !odds.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Place Your Bets</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Place Your Bets</h2>
      
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-600">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {selectedMatchup && (
        <div className="space-y-6">
          {/* Matchup Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Matchup
            </label>
            <select
              value={odds.findIndex(m => m === selectedMatchup)}
              onChange={(e) => setSelectedMatchup(odds[Number(e.target.value)])}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              {odds.map((matchup, index) => (
                <option key={index} value={index}>
                  {matchup.away_team.name} @ {matchup.home_team.name}
                </option>
              ))}
            </select>
          </div>

          {/* Bet Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bet Type
            </label>
            <div className="flex space-x-4">
              {['moneyline', 'spread', 'total'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleBetTypeChange(type as any)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    betForm.bet_type === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Bet Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Your Bet
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {betForm.bet_type === 'moneyline' && (
                <>
                  <button
                    onClick={() => handleBetSelection('home', selectedMatchup.home_team.moneyline)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      betForm.bet_selection === 'home'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-semibold">{selectedMatchup.home_team.name}</div>
                    <div className="text-sm text-gray-600">
                      {selectedMatchup.home_team.moneyline > 0 ? '+' : ''}{selectedMatchup.home_team.moneyline}
                    </div>
                  </button>
                  <button
                    onClick={() => handleBetSelection('away', selectedMatchup.away_team.moneyline)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      betForm.bet_selection === 'away'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-semibold">{selectedMatchup.away_team.name}</div>
                    <div className="text-sm text-gray-600">
                      {selectedMatchup.away_team.moneyline > 0 ? '+' : ''}{selectedMatchup.away_team.moneyline}
                    </div>
                  </button>
                </>
              )}

              {betForm.bet_type === 'spread' && (
                <>
                  <button
                    onClick={() => handleBetSelection('home', -110, selectedMatchup.home_team.spread)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      betForm.bet_selection === 'home'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-semibold">{selectedMatchup.home_team.name}</div>
                    <div className="text-sm text-gray-600">
                      {selectedMatchup.home_team.spread > 0 ? '+' : ''}{selectedMatchup.home_team.spread}
                    </div>
                  </button>
                  <button
                    onClick={() => handleBetSelection('away', -110, selectedMatchup.away_team.spread)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      betForm.bet_selection === 'away'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-semibold">{selectedMatchup.away_team.name}</div>
                    <div className="text-sm text-gray-600">
                      {selectedMatchup.away_team.spread > 0 ? '+' : ''}{selectedMatchup.away_team.spread}
                    </div>
                  </button>
                </>
              )}

              {betForm.bet_type === 'total' && (
                <>
                  <button
                    onClick={() => handleBetSelection('over', selectedMatchup.over_odds, selectedMatchup.total)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      betForm.bet_selection === 'over'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-semibold">Over {selectedMatchup.total}</div>
                    <div className="text-sm text-gray-600">
                      {selectedMatchup.over_odds > 0 ? '+' : ''}{selectedMatchup.over_odds}
                    </div>
                  </button>
                  <button
                    onClick={() => handleBetSelection('under', selectedMatchup.under_odds, selectedMatchup.total)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      betForm.bet_selection === 'under'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-semibold">Under {selectedMatchup.total}</div>
                    <div className="text-sm text-gray-600">
                      {selectedMatchup.under_odds > 0 ? '+' : ''}{selectedMatchup.under_odds}
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bet Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bet Amount (Tokens)
            </label>
            <div className="flex space-x-2">
              {[10, 25, 50, 100].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBetForm(prev => ({ ...prev, bet_amount: amount }))}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    betForm.bet_amount === amount
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {amount}
                </button>
              ))}
              <input
                type="number"
                min="1"
                value={betForm.bet_amount}
                onChange={(e) => setBetForm(prev => ({ ...prev, bet_amount: Number(e.target.value) }))}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="Custom amount"
              />
            </div>
          </div>

          {/* Place Bet Button */}
          <button
            onClick={handlePlaceBet}
            disabled={betting || !betForm.bet_selection}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-md transition-colors"
          >
            {betting ? 'Placing Bet...' : 'Place Bet'}
          </button>
        </div>
      )}
    </div>
  );
};
