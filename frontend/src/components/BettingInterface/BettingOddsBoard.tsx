/**
 * BettingOddsBoard Component
 * 
 * Displays live betting odds with real-time updates and betting functionality.
 * Integrates with the free odds service to provide comprehensive odds data.
 * 
 * Features:
 * - Real-time odds updates via WebSocket
 * - Multiple bet types (moneyline, spread, total)
 * - Token-based betting system
 * - Odds movement tracking
 * - Mobile-responsive design
 * 
 * @author Fantasy Football Companion App
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { ArrowUpIcon, ArrowDownIcon, ClockIcon } from '@heroicons/react/20/solid';

interface BettingOddsBoardProps {
  leagueId: string;
  userId: string;
  currentWeek: number;
  onPlaceBet: (betData: any) => void;
  tokenBalance: number;
  isConnected: boolean;
}

interface OddsData {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeOdds: number;
  awayOdds: number;
  spread: number;
  total: number;
  status: 'upcoming' | 'live' | 'final';
  lastUpdated: string;
  oddsMovement?: {
    homeOdds: number;
    awayOdds: number;
    spread: number;
    total: number;
  };
}

export const BettingOddsBoard: React.FC<BettingOddsBoardProps> = ({
  leagueId,
  userId,
  currentWeek,
  onPlaceBet,
  tokenBalance,
  isConnected
}) => {
  const [oddsData, setOddsData] = useState<OddsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBet, setSelectedBet] = useState<any>(null);
  const [betAmount, setBetAmount] = useState<number>(10);
  const [betType, setBetType] = useState<'moneyline' | 'spread' | 'total'>('moneyline');

  // WebSocket for real-time updates
  const { sendMessage, subscribe } = useWebSocket('http://localhost:8000');

  useEffect(() => {
    fetchOddsData();
  }, [currentWeek]);

  useEffect(() => {
    // Subscribe to odds updates
    const unsubscribe = subscribe('odds_update', (data: any) => {
      console.log('Received odds update:', data);
      setOddsData(prevData => 
        prevData.map(odds => 
          odds.id === data.id ? { ...odds, ...data, lastUpdated: new Date().toISOString() } : odds
        )
      );
    });

    return () => unsubscribe();
  }, [subscribe]);

  const fetchOddsData = async () => {
    try {
      setLoading(true);
      
      // Try free odds service first
      const response = await fetch(`http://localhost:8000/api/v1/free-odds/nfl-odds?week=${currentWeek}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch odds data');
      }
      
      const result = await response.json();
      
      if (result.success && result.odds_data) {
        // Transform the data to our format
        const transformedOdds = transformOddsData(result.odds_data);
        setOddsData(transformedOdds);
      } else {
        // Fallback to mock data
        setOddsData(getMockOddsData());
      }
    } catch (error) {
      console.error('Error fetching odds:', error);
      // Use mock data as fallback
      setOddsData(getMockOddsData());
    } finally {
      setLoading(false);
    }
  };

  const transformOddsData = (data: any): OddsData[] => {
    // Transform API data to our format
    if (data.source === 'mock_data') {
      return data.data.games || [];
    }
    
    // Transform from various API sources
    return data.data.games?.map((game: any) => ({
      id: game.id || `game-${Math.random()}`,
      homeTeam: game.home_team || game.homeTeam || 'Home Team',
      awayTeam: game.away_team || game.awayTeam || 'Away Team',
      homeOdds: game.homeOdds || game.home_odds || -110,
      awayOdds: game.awayOdds || game.away_odds || -110,
      spread: game.spread || 0,
      total: game.total || 45,
      status: game.status || 'upcoming',
      lastUpdated: new Date().toISOString()
    })) || [];
  };

  const getMockOddsData = (): OddsData[] => [
    {
      id: 'mock-1',
      homeTeam: 'Kansas City Chiefs',
      awayTeam: 'Buffalo Bills',
      homeOdds: -150,
      awayOdds: +130,
      spread: -3.5,
      total: 51.5,
      status: 'upcoming',
      lastUpdated: new Date().toISOString(),
      oddsMovement: {
        homeOdds: -140,
        awayOdds: +120,
        spread: -3.0,
        total: 52.0
      }
    },
    {
      id: 'mock-2',
      homeTeam: 'Los Angeles Rams',
      awayTeam: 'San Francisco 49ers',
      homeOdds: +110,
      awayOdds: -130,
      spread: 2.5,
      total: 47.0,
      status: 'upcoming',
      lastUpdated: new Date().toISOString(),
      oddsMovement: {
        homeOdds: +105,
        awayOdds: -125,
        spread: 2.0,
        total: 46.5
      }
    },
    {
      id: 'mock-3',
      homeTeam: 'Dallas Cowboys',
      awayTeam: 'Philadelphia Eagles',
      homeOdds: -120,
      awayOdds: +100,
      spread: -1.5,
      total: 49.5,
      status: 'live',
      lastUpdated: new Date().toISOString()
    }
  ];

  const formatOdds = (odds: number): string => {
    return odds > 0 ? `+${odds}` : `${odds}`;
  };

  const calculatePayout = (odds: number, amount: number): number => {
    if (odds > 0) {
      return amount + (amount * odds / 100);
    } else {
      return amount + (amount * 100 / Math.abs(odds));
    }
  };

  const handleBetSelection = (game: OddsData, selection: 'home' | 'away', betType: 'moneyline' | 'spread' | 'total') => {
    const betData = {
      gameId: game.id,
      homeTeam: game.homeTeam,
      awayTeam: game.awayTeam,
      betType,
      selection,
      odds: selection === 'home' ? game.homeOdds : game.awayOdds,
      spread: betType === 'spread' ? game.spread : null,
      total: betType === 'total' ? game.total : null,
      amount: betAmount,
      potentialPayout: calculatePayout(selection === 'home' ? game.homeOdds : game.awayOdds, betAmount)
    };
    
    setSelectedBet(betData);
  };

  const handlePlaceBet = () => {
    if (selectedBet && betAmount <= tokenBalance) {
      onPlaceBet(selectedBet);
      setSelectedBet(null);
      setBetAmount(10);
    } else {
      alert('Insufficient token balance or invalid bet selection');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading odds data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Betting Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Bet Amount:</label>
            <input
              type="number"
              min="1"
              max={tokenBalance}
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className="w-20 px-3 py-1 border border-gray-300 rounded-md text-sm"
            />
            <span className="text-sm text-gray-500">tokens</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Bet Type:</label>
            <select
              value={betType}
              onChange={(e) => setBetType(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="moneyline">Moneyline</option>
              <option value="spread">Spread</option>
              <option value="total">Total</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-600">
            Balance: {tokenBalance} tokens
          </div>
        </div>
      </div>

      {/* Odds Display */}
      <div className="space-y-4">
        {oddsData.map((game) => (
          <div key={game.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Game Header */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold text-gray-900">
                    {game.awayTeam} @ {game.homeTeam}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    game.status === 'live' ? 'bg-red-100 text-red-800' :
                    game.status === 'final' ? 'bg-gray-100 text-gray-600' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {game.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <ClockIcon className="h-4 w-4" />
                  <span>Updated: {new Date(game.lastUpdated).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            {/* Betting Options */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Moneyline */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Moneyline</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleBetSelection(game, 'away', 'moneyline')}
                      className={`p-3 rounded-lg border-2 text-center transition-colors ${
                        selectedBet?.gameId === game.id && selectedBet?.selection === 'away' && selectedBet?.betType === 'moneyline'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-900">{game.awayTeam}</div>
                      <div className="text-lg font-bold text-blue-600">{formatOdds(game.awayOdds)}</div>
                      {game.oddsMovement && (
                        <div className="flex items-center justify-center text-xs text-gray-500">
                          {game.oddsMovement.awayOdds > game.awayOdds ? (
                            <ArrowUpIcon className="h-3 w-3 text-green-500" />
                          ) : game.oddsMovement.awayOdds < game.awayOdds ? (
                            <ArrowDownIcon className="h-3 w-3 text-red-500" />
                          ) : null}
                          {game.oddsMovement.awayOdds !== game.awayOdds && formatOdds(game.oddsMovement.awayOdds)}
                        </div>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleBetSelection(game, 'home', 'moneyline')}
                      className={`p-3 rounded-lg border-2 text-center transition-colors ${
                        selectedBet?.gameId === game.id && selectedBet?.selection === 'home' && selectedBet?.betType === 'moneyline'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-900">{game.homeTeam}</div>
                      <div className="text-lg font-bold text-blue-600">{formatOdds(game.homeOdds)}</div>
                      {game.oddsMovement && (
                        <div className="flex items-center justify-center text-xs text-gray-500">
                          {game.oddsMovement.homeOdds > game.homeOdds ? (
                            <ArrowUpIcon className="h-3 w-3 text-green-500" />
                          ) : game.oddsMovement.homeOdds < game.homeOdds ? (
                            <ArrowDownIcon className="h-3 w-3 text-red-500" />
                          ) : null}
                          {game.oddsMovement.homeOdds !== game.homeOdds && formatOdds(game.oddsMovement.homeOdds)}
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Spread */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Spread</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleBetSelection(game, 'away', 'spread')}
                      className={`p-3 rounded-lg border-2 text-center transition-colors ${
                        selectedBet?.gameId === game.id && selectedBet?.selection === 'away' && selectedBet?.betType === 'spread'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-900">{game.awayTeam}</div>
                      <div className="text-lg font-bold text-blue-600">
                        {game.spread > 0 ? `+${game.spread}` : game.spread}
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleBetSelection(game, 'home', 'spread')}
                      className={`p-3 rounded-lg border-2 text-center transition-colors ${
                        selectedBet?.gameId === game.id && selectedBet?.selection === 'home' && selectedBet?.betType === 'spread'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-900">{game.homeTeam}</div>
                      <div className="text-lg font-bold text-blue-600">
                        {game.spread > 0 ? `-${game.spread}` : `+${Math.abs(game.spread)}`}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Total</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleBetSelection(game, 'away', 'total')}
                      className={`p-3 rounded-lg border-2 text-center transition-colors ${
                        selectedBet?.gameId === game.id && selectedBet?.selection === 'away' && selectedBet?.betType === 'total'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-900">Over</div>
                      <div className="text-lg font-bold text-blue-600">{game.total}</div>
                    </button>
                    
                    <button
                      onClick={() => handleBetSelection(game, 'home', 'total')}
                      className={`p-3 rounded-lg border-2 text-center transition-colors ${
                        selectedBet?.gameId === game.id && selectedBet?.selection === 'home' && selectedBet?.betType === 'total'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-900">Under</div>
                      <div className="text-lg font-bold text-blue-600">{game.total}</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bet Confirmation */}
      {selectedBet && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-md">
          <h4 className="font-semibold text-gray-900 mb-3">Confirm Bet</h4>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Game:</span> {selectedBet.awayTeam} @ {selectedBet.homeTeam}</div>
            <div><span className="font-medium">Bet:</span> {selectedBet.selection} ({selectedBet.betType})</div>
            <div><span className="font-medium">Odds:</span> {formatOdds(selectedBet.odds)}</div>
            <div><span className="font-medium">Amount:</span> {selectedBet.amount} tokens</div>
            <div><span className="font-medium">Potential Payout:</span> {selectedBet.potentialPayout.toFixed(2)} tokens</div>
          </div>
          <div className="flex space-x-3 mt-4">
            <button
              onClick={handlePlaceBet}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Place Bet
            </button>
            <button
              onClick={() => setSelectedBet(null)}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
