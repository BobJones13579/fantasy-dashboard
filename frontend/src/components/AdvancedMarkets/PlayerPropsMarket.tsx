/**
 * PlayerPropsMarket Component
 * 
 * Displays player prop betting markets for individual player performance
 * including passing yards, rushing yards, receiving yards, touchdowns, etc.
 * 
 * Features:
 * - Individual player performance betting
 * - Multiple prop types (yards, touchdowns, completions, etc.)
 * - Real-time odds updates
 * - Player statistics integration
 * - Betting history for player props
 * 
 * @author Fantasy Football Companion App
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  UserIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/20/solid';

interface PlayerPropsMarketProps {
  leagueId: string;
  userId: string;
  currentWeek: number;
  onPlaceBet: (betData: any) => void;
  tokenBalance: number;
  marketData: any;
  isConnected: boolean;
}

interface PlayerProp {
  id: string;
  playerName: string;
  team: string;
  position: string;
  propType: string;
  overUnder: number;
  overOdds: number;
  underOdds: number;
  lastUpdated: string;
  oddsMovement?: {
    overOdds: number;
    underOdds: number;
    overUnder: number;
  };
  playerStats?: {
    seasonAverage: number;
    lastGame: number;
    last3Games: number;
    projection: number;
  };
}

export const PlayerPropsMarket: React.FC<PlayerPropsMarketProps> = ({
  leagueId,
  userId,
  currentWeek,
  onPlaceBet,
  tokenBalance,
  marketData,
  isConnected
}) => {
  const [selectedProp, setSelectedProp] = useState<PlayerProp | null>(null);
  const [betAmount, setBetAmount] = useState<number>(10);
  const [betSelection, setBetSelection] = useState<'over' | 'under' | null>(null);
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [filterPropType, setFilterPropType] = useState<string>('all');

  // Mock player props data
  const mockPlayerProps: PlayerProp[] = [
    {
      id: 'prop-1',
      playerName: 'Josh Allen',
      team: 'BUF',
      position: 'QB',
      propType: 'Passing Yards',
      overUnder: 275.5,
      overOdds: -110,
      underOdds: -110,
      lastUpdated: new Date().toISOString(),
      oddsMovement: {
        overOdds: -105,
        underOdds: -115,
        overUnder: 270.5
      },
      playerStats: {
        seasonAverage: 285.2,
        lastGame: 312,
        last3Games: 298.7,
        projection: 278.5
      }
    },
    {
      id: 'prop-2',
      playerName: 'Christian McCaffrey',
      team: 'SF',
      position: 'RB',
      propType: 'Rushing Yards',
      overUnder: 85.5,
      overOdds: -115,
      underOdds: -105,
      lastUpdated: new Date().toISOString(),
      playerStats: {
        seasonAverage: 92.1,
        lastGame: 78,
        last3Games: 88.3,
        projection: 87.2
      }
    },
    {
      id: 'prop-3',
      playerName: 'Tyreek Hill',
      team: 'MIA',
      position: 'WR',
      propType: 'Receiving Yards',
      overUnder: 95.5,
      overOdds: -110,
      underOdds: -110,
      lastUpdated: new Date().toISOString(),
      playerStats: {
        seasonAverage: 101.8,
        lastGame: 112,
        last3Games: 98.4,
        projection: 96.7
      }
    },
    {
      id: 'prop-4',
      playerName: 'Travis Kelce',
      team: 'KC',
      position: 'TE',
      propType: 'Receiving Yards',
      overUnder: 65.5,
      overOdds: -105,
      underOdds: -115,
      lastUpdated: new Date().toISOString(),
      playerStats: {
        seasonAverage: 68.9,
        lastGame: 71,
        last3Games: 62.3,
        projection: 66.8
      }
    },
    {
      id: 'prop-5',
      playerName: 'Lamar Jackson',
      team: 'BAL',
      position: 'QB',
      propType: 'Rushing Yards',
      overUnder: 45.5,
      overOdds: -110,
      underOdds: -110,
      lastUpdated: new Date().toISOString(),
      playerStats: {
        seasonAverage: 48.2,
        lastGame: 52,
        last3Games: 44.7,
        projection: 47.1
      }
    }
  ];

  const [playerProps, setPlayerProps] = useState<PlayerProp[]>(mockPlayerProps);

  useEffect(() => {
    if (marketData && marketData.playerProps) {
      setPlayerProps(marketData.playerProps);
    }
  }, [marketData]);

  const filteredProps = playerProps.filter(prop => {
    if (filterPosition !== 'all' && prop.position !== filterPosition) return false;
    if (filterPropType !== 'all' && prop.propType !== filterPropType) return false;
    return true;
  });

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

  const handlePropSelection = (prop: PlayerProp, selection: 'over' | 'under') => {
    setSelectedProp(prop);
    setBetSelection(selection);
  };

  const handlePlaceBet = () => {
    if (selectedProp && betSelection && betAmount <= tokenBalance) {
      const betData = {
        gameId: `prop-${selectedProp.id}`,
        playerName: selectedProp.playerName,
        propType: selectedProp.propType,
        overUnder: selectedProp.overUnder,
        selection: betSelection,
        odds: betSelection === 'over' ? selectedProp.overOdds : selectedProp.underOdds,
        amount: betAmount,
        potentialPayout: calculatePayout(
          betSelection === 'over' ? selectedProp.overOdds : selectedProp.underOdds,
          betAmount
        ),
        betType: 'player_prop'
      };
      
      onPlaceBet(betData);
      setSelectedProp(null);
      setBetSelection(null);
      setBetAmount(10);
    } else {
      alert('Insufficient token balance or invalid bet selection');
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'QB': return 'bg-blue-100 text-blue-800';
      case 'RB': return 'bg-green-100 text-green-800';
      case 'WR': return 'bg-purple-100 text-purple-800';
      case 'TE': return 'bg-orange-100 text-orange-800';
      case 'K': return 'bg-yellow-100 text-yellow-800';
      case 'D/ST': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatColor = (current: number, overUnder: number) => {
    if (current > overUnder) return 'text-green-600';
    if (current < overUnder) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Position:</label>
            <select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Positions</option>
              <option value="QB">QB</option>
              <option value="RB">RB</option>
              <option value="WR">WR</option>
              <option value="TE">TE</option>
              <option value="K">K</option>
              <option value="D/ST">D/ST</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Prop Type:</label>
            <select
              value={filterPropType}
              onChange={(e) => setFilterPropType(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Types</option>
              <option value="Passing Yards">Passing Yards</option>
              <option value="Rushing Yards">Rushing Yards</option>
              <option value="Receiving Yards">Receiving Yards</option>
              <option value="Touchdowns">Touchdowns</option>
              <option value="Completions">Completions</option>
              <option value="Receptions">Receptions</option>
            </select>
          </div>
          
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
        </div>
      </div>

      {/* Player Props Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProps.map((prop) => (
          <div key={prop.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Player Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-8 w-8 text-gray-400" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{prop.playerName}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(prop.position)}`}>
                        {prop.position}
                      </span>
                      <span className="text-sm text-gray-600">{prop.team}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <ClockIcon className="h-4 w-4" />
                  <span>{new Date(prop.lastUpdated).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            {/* Prop Details */}
            <div className="p-6">
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">{prop.propType}</h4>
                <div className="text-center">
                  <span className="text-3xl font-bold text-gray-900">{prop.overUnder}</span>
                  {prop.oddsMovement && (
                    <div className="flex items-center justify-center text-sm text-gray-500 mt-1">
                      {prop.oddsMovement.overUnder > prop.overUnder ? (
                        <ArrowUpIcon className="h-4 w-4 text-green-500" />
                      ) : prop.oddsMovement.overUnder < prop.overUnder ? (
                        <ArrowDownIcon className="h-4 w-4 text-red-500" />
                      ) : null}
                      {prop.oddsMovement.overUnder !== prop.overUnder && (
                        <span className="ml-1">{prop.oddsMovement.overUnder}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Betting Options */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => handlePropSelection(prop, 'over')}
                  className={`p-3 rounded-lg border-2 text-center transition-colors ${
                    selectedProp?.id === prop.id && betSelection === 'over'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900">Over</div>
                  <div className="text-lg font-bold text-blue-600">{formatOdds(prop.overOdds)}</div>
                  {prop.oddsMovement && (
                    <div className="flex items-center justify-center text-xs text-gray-500">
                      {prop.oddsMovement.overOdds > prop.overOdds ? (
                        <ArrowUpIcon className="h-3 w-3 text-green-500" />
                      ) : prop.oddsMovement.overOdds < prop.overOdds ? (
                        <ArrowDownIcon className="h-3 w-3 text-red-500" />
                      ) : null}
                      {prop.oddsMovement.overOdds !== prop.overOdds && formatOdds(prop.oddsMovement.overOdds)}
                    </div>
                  )}
                </button>
                
                <button
                  onClick={() => handlePropSelection(prop, 'under')}
                  className={`p-3 rounded-lg border-2 text-center transition-colors ${
                    selectedProp?.id === prop.id && betSelection === 'under'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900">Under</div>
                  <div className="text-lg font-bold text-blue-600">{formatOdds(prop.underOdds)}</div>
                  {prop.oddsMovement && (
                    <div className="flex items-center justify-center text-xs text-gray-500">
                      {prop.oddsMovement.underOdds > prop.underOdds ? (
                        <ArrowUpIcon className="h-3 w-3 text-green-500" />
                      ) : prop.oddsMovement.underOdds < prop.underOdds ? (
                        <ArrowDownIcon className="h-3 w-3 text-red-500" />
                      ) : null}
                      {prop.oddsMovement.underOdds !== prop.underOdds && formatOdds(prop.oddsMovement.underOdds)}
                    </div>
                  )}
                </button>
              </div>

              {/* Player Stats */}
              {prop.playerStats && (
                <div className="border-t border-gray-200 pt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Player Statistics</h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Season Avg:</span>
                      <span className={getStatColor(prop.playerStats.seasonAverage, prop.overUnder)}>
                        {prop.playerStats.seasonAverage}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Game:</span>
                      <span className={getStatColor(prop.playerStats.lastGame, prop.overUnder)}>
                        {prop.playerStats.lastGame}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last 3 Games:</span>
                      <span className={getStatColor(prop.playerStats.last3Games, prop.overUnder)}>
                        {prop.playerStats.last3Games}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Projection:</span>
                      <span className={getStatColor(prop.playerStats.projection, prop.overUnder)}>
                        {prop.playerStats.projection}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bet Confirmation */}
      {selectedProp && betSelection && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-md">
          <h4 className="font-semibold text-gray-900 mb-3">Confirm Player Prop Bet</h4>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Player:</span> {selectedProp.playerName} ({selectedProp.position})</div>
            <div><span className="font-medium">Prop:</span> {selectedProp.propType}</div>
            <div><span className="font-medium">Selection:</span> {betSelection} {selectedProp.overUnder}</div>
            <div><span className="font-medium">Odds:</span> {formatOdds(betSelection === 'over' ? selectedProp.overOdds : selectedProp.underOdds)}</div>
            <div><span className="font-medium">Amount:</span> {betAmount} tokens</div>
            <div><span className="font-medium">Potential Payout:</span> {calculatePayout(betSelection === 'over' ? selectedProp.overOdds : selectedProp.underOdds, betAmount).toFixed(2)} tokens</div>
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
                setSelectedProp(null);
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
