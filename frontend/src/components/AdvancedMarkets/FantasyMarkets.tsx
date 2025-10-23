/**
 * FantasyMarkets Component
 * 
 * Displays fantasy-specific betting markets including fantasy points,
 * positional battles, and fantasy performance metrics.
 * 
 * Features:
 * - Fantasy points betting
 * - Positional performance betting
 * - Fantasy team vs team betting
 * - Fantasy player props
 * - League-specific fantasy markets
 * 
 * @author Fantasy Football Companion App
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { 
  StarIcon,
  TrophyIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/20/solid';

interface FantasyMarketsProps {
  leagueId: string;
  userId: string;
  currentWeek: number;
  onPlaceBet: (betData: any) => void;
  tokenBalance: number;
  marketData: any;
  isConnected: boolean;
}

interface FantasyMarket {
  id: string;
  title: string;
  type: 'fantasy_points' | 'positional_battle' | 'team_vs_team' | 'player_prop';
  participant1: {
    name: string;
    type: 'player' | 'team' | 'position';
    fantasyPoints?: number;
    stats?: any;
  };
  participant2?: {
    name: string;
    type: 'player' | 'team' | 'position';
    fantasyPoints?: number;
    stats?: any;
  };
  overUnder?: number;
  overOdds?: number;
  underOdds?: number;
  odds?: {
    participant1: number;
    participant2: number;
  };
  lastUpdated: string;
  status: 'active' | 'completed' | 'cancelled';
}

export const FantasyMarkets: React.FC<FantasyMarketsProps> = ({
  leagueId,
  userId,
  currentWeek,
  onPlaceBet,
  tokenBalance,
  marketData,
  isConnected
}) => {
  const [selectedMarket, setSelectedMarket] = useState<FantasyMarket | null>(null);
  const [betAmount, setBetAmount] = useState<number>(10);
  const [betSelection, setBetSelection] = useState<string | null>(null);

  // Mock fantasy markets data
  const mockFantasyMarkets: FantasyMarket[] = [
    {
      id: 'fantasy-1',
      title: 'Josh Allen Fantasy Points',
      type: 'fantasy_points',
      participant1: {
        name: 'Josh Allen',
        type: 'player',
        fantasyPoints: 25.8,
        stats: { passingYards: 285, passingTDs: 2, rushingYards: 42, rushingTDs: 1 }
      },
      overUnder: 24.5,
      overOdds: -110,
      underOdds: -110,
      lastUpdated: new Date().toISOString(),
      status: 'active'
    },
    {
      id: 'fantasy-2',
      title: 'Top RB1: McCaffrey vs Ekeler',
      type: 'positional_battle',
      participant1: {
        name: 'Christian McCaffrey',
        type: 'player',
        fantasyPoints: 28.4,
        stats: { rushingYards: 95, rushingTDs: 1, receivingYards: 45, receivingTDs: 1 }
      },
      participant2: {
        name: 'Austin Ekeler',
        type: 'player',
        fantasyPoints: 26.2,
        stats: { rushingYards: 78, rushingTDs: 1, receivingYards: 52, receivingTDs: 1 }
      },
      odds: { participant1: -115, participant2: -105 },
      lastUpdated: new Date().toISOString(),
      status: 'active'
    },
    {
      id: 'fantasy-3',
      title: 'Team Fantasy Points: Chiefs vs Bills',
      type: 'team_vs_team',
      participant1: {
        name: 'Kansas City Chiefs',
        type: 'team',
        fantasyPoints: 145.2,
        stats: { totalYards: 385, totalTDs: 3, turnovers: 1 }
      },
      participant2: {
        name: 'Buffalo Bills',
        type: 'team',
        fantasyPoints: 138.7,
        stats: { totalYards: 372, totalTDs: 2, turnovers: 2 }
      },
      odds: { participant1: -110, participant2: -110 },
      lastUpdated: new Date().toISOString(),
      status: 'active'
    },
    {
      id: 'fantasy-4',
      title: 'Tyreek Hill Receiving Yards',
      type: 'fantasy_points',
      participant1: {
        name: 'Tyreek Hill',
        type: 'player',
        fantasyPoints: 18.7,
        stats: { receivingYards: 95, receivingTDs: 1, receptions: 7 }
      },
      overUnder: 95.5,
      overOdds: -105,
      underOdds: -115,
      lastUpdated: new Date().toISOString(),
      status: 'active'
    }
  ];

  const [fantasyMarkets, setFantasyMarkets] = useState<FantasyMarket[]>(mockFantasyMarkets);

  useEffect(() => {
    if (marketData && marketData.fantasyMarkets) {
      setFantasyMarkets(marketData.fantasyMarkets);
    }
  }, [marketData]);

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

  const handleMarketSelection = (market: FantasyMarket, selection: string) => {
    setSelectedMarket(market);
    setBetSelection(selection);
  };

  const handlePlaceBet = () => {
    if (selectedMarket && betSelection && betAmount <= tokenBalance) {
      let odds = 0;
      let participant = '';
      
      if (selectedMarket.type === 'fantasy_points') {
        odds = betSelection === 'over' ? selectedMarket.overOdds! : selectedMarket.underOdds!;
        participant = `${selectedMarket.participant1.name} ${betSelection} ${selectedMarket.overUnder}`;
      } else {
        odds = betSelection === 'participant1' ? selectedMarket.odds!.participant1 : selectedMarket.odds!.participant2;
        participant = betSelection === 'participant1' ? selectedMarket.participant1.name : selectedMarket.participant2!.name;
      }

      const betData = {
        gameId: `fantasy-${selectedMarket.id}`,
        marketTitle: selectedMarket.title,
        marketType: selectedMarket.type,
        participant,
        selection: betSelection,
        odds,
        amount: betAmount,
        potentialPayout: calculatePayout(odds, betAmount),
        betType: 'fantasy_market'
      };
      
      onPlaceBet(betData);
      setSelectedMarket(null);
      setBetSelection(null);
      setBetAmount(10);
    } else {
      alert('Insufficient token balance or invalid bet selection');
    }
  };

  const getMarketTypeIcon = (type: string) => {
    switch (type) {
      case 'fantasy_points':
        return <StarIcon className="h-5 w-5 text-yellow-600" />;
      case 'positional_battle':
        return <TrophyIcon className="h-5 w-5 text-blue-600" />;
      case 'team_vs_team':
        return <ChartBarIcon className="h-5 w-5 text-green-600" />;
      case 'player_prop':
        return <StarIcon className="h-5 w-5 text-purple-600" />;
      default:
        return <StarIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getMarketTypeColor = (type: string) => {
    switch (type) {
      case 'fantasy_points':
        return 'bg-yellow-50 border-yellow-200';
      case 'positional_battle':
        return 'bg-blue-50 border-blue-200';
      case 'team_vs_team':
        return 'bg-green-50 border-green-200';
      case 'player_prop':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Fantasy Markets</h2>
          <p className="text-sm text-gray-600">Fantasy-specific betting markets and performance props</p>
        </div>
      </div>

      {/* Betting Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
          <span className="text-sm text-gray-600">
            Balance: {tokenBalance.toLocaleString()} tokens
          </span>
        </div>
      </div>

      {/* Fantasy Markets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {fantasyMarkets.map((market) => (
          <div key={market.id} className={`bg-white rounded-lg shadow-sm border overflow-hidden ${getMarketTypeColor(market.type)}`}>
            {/* Market Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  {getMarketTypeIcon(market.type)}
                  <div>
                    <h3 className="font-semibold text-gray-900">{market.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500 capitalize">
                        {market.type.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        market.status === 'active' ? 'bg-green-100 text-green-800' :
                        market.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {market.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <ClockIcon className="h-4 w-4" />
                  <span>{new Date(market.lastUpdated).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            {/* Market Details */}
            <div className="p-6">
              {market.type === 'fantasy_points' ? (
                /* Fantasy Points Market */
                <div>
                  <div className="text-center mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">{market.participant1.name}</h4>
                    <div className="text-3xl font-bold text-gray-900">{market.overUnder}</div>
                    <p className="text-sm text-gray-600">Fantasy Points</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleMarketSelection(market, 'over')}
                      disabled={market.status !== 'active'}
                      className={`py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                        market.status !== 'active'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : selectedMarket?.id === market.id && betSelection === 'over'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                      }`}
                    >
                      <div className="text-lg font-bold">{formatOdds(market.overOdds!)}</div>
                      <div className="text-xs">Over</div>
                    </button>
                    
                    <button
                      onClick={() => handleMarketSelection(market, 'under')}
                      disabled={market.status !== 'active'}
                      className={`py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                        market.status !== 'active'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : selectedMarket?.id === market.id && betSelection === 'under'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                      }`}
                    >
                      <div className="text-lg font-bold">{formatOdds(market.underOdds!)}</div>
                      <div className="text-xs">Under</div>
                    </button>
                  </div>
                  
                  {/* Player Stats */}
                  {market.participant1.stats && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Recent Stats</h5>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        {Object.entries(market.participant1.stats).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span>{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Head-to-Head Market */
                <div className="grid grid-cols-2 gap-4">
                  {/* Participant 1 */}
                  <div className="text-center">
                    <div className="mb-2">
                      <h4 className="font-medium text-gray-900">{market.participant1.name}</h4>
                      <p className="text-sm text-gray-600 capitalize">{market.participant1.type}</p>
                    </div>
                    
                    {market.participant1.fantasyPoints && (
                      <div className="mb-4">
                        <div className="text-2xl font-bold text-gray-900">{market.participant1.fantasyPoints}</div>
                        <p className="text-xs text-gray-600">Fantasy Points</p>
                      </div>
                    )}
                    
                    <button
                      onClick={() => handleMarketSelection(market, 'participant1')}
                      disabled={market.status !== 'active'}
                      className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        market.status !== 'active'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : selectedMarket?.id === market.id && betSelection === 'participant1'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                      }`}
                    >
                      <div className="text-lg font-bold">{formatOdds(market.odds!.participant1)}</div>
                      <div className="text-xs">Bet</div>
                    </button>
                  </div>

                  {/* VS Divider */}
                  <div className="flex items-center justify-center">
                    <div className="text-2xl font-bold text-gray-400">VS</div>
                  </div>

                  {/* Participant 2 */}
                  <div className="text-center">
                    <div className="mb-2">
                      <h4 className="font-medium text-gray-900">{market.participant2!.name}</h4>
                      <p className="text-sm text-gray-600 capitalize">{market.participant2!.type}</p>
                    </div>
                    
                    {market.participant2!.fantasyPoints && (
                      <div className="mb-4">
                        <div className="text-2xl font-bold text-gray-900">{market.participant2!.fantasyPoints}</div>
                        <p className="text-xs text-gray-600">Fantasy Points</p>
                      </div>
                    )}
                    
                    <button
                      onClick={() => handleMarketSelection(market, 'participant2')}
                      disabled={market.status !== 'active'}
                      className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        market.status !== 'active'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : selectedMarket?.id === market.id && betSelection === 'participant2'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                      }`}
                    >
                      <div className="text-lg font-bold">{formatOdds(market.odds!.participant2)}</div>
                      <div className="text-xs">Bet</div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bet Confirmation */}
      {selectedMarket && betSelection && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-md">
          <h4 className="font-semibold text-gray-900 mb-3">Confirm Fantasy Market Bet</h4>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Market:</span> {selectedMarket.title}</div>
            <div><span className="font-medium">Selection:</span> {betSelection}</div>
            <div><span className="font-medium">Amount:</span> {betAmount} tokens</div>
            <div><span className="font-medium">Potential Payout:</span> {
              selectedMarket.type === 'fantasy_points' 
                ? calculatePayout(betSelection === 'over' ? selectedMarket.overOdds! : selectedMarket.underOdds!, betAmount).toFixed(2)
                : calculatePayout(betSelection === 'participant1' ? selectedMarket.odds!.participant1 : selectedMarket.odds!.participant2, betAmount).toFixed(2)
            } tokens</div>
          </div>
          <div className="flex space-x-3 mt-4">
            <button
              onClick={handlePlaceBet}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Place Bet
            </button>
            <button
              onClick={() => {
                setSelectedMarket(null);
                setBetSelection(null);
              }}
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
