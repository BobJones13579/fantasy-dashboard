/**
 * TeamTotalsMarket Component
 * 
 * Displays team total betting markets for team performance metrics
 * including total points, total yards, total touchdowns, etc.
 * 
 * Features:
 * - Team total points betting
 * - Team total yards betting
 * - Team total touchdowns betting
 * - Team performance metrics
 * - Real-time odds updates
 * - Historical team data integration
 * 
 * @author Fantasy Football Companion App
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BuildingOfficeIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/20/solid';

interface TeamTotalsMarketProps {
  leagueId: string;
  userId: string;
  currentWeek: number;
  onPlaceBet: (betData: any) => void;
  tokenBalance: number;
  marketData: any;
  isConnected: boolean;
}

interface TeamTotal {
  id: string;
  teamName: string;
  teamAbbr: string;
  opponent: string;
  gameDate: string;
  totalType: string;
  overUnder: number;
  overOdds: number;
  underOdds: number;
  lastUpdated: string;
  oddsMovement?: {
    overOdds: number;
    underOdds: number;
    overUnder: number;
  };
  teamStats?: {
    seasonAverage: number;
    lastGame: number;
    last3Games: number;
    homeAway: 'home' | 'away';
    weather?: string;
  };
}

export const TeamTotalsMarket: React.FC<TeamTotalsMarketProps> = ({
  leagueId,
  userId,
  currentWeek,
  onPlaceBet,
  tokenBalance,
  marketData,
  isConnected
}) => {
  const [selectedTotal, setSelectedTotal] = useState<TeamTotal | null>(null);
  const [betAmount, setBetAmount] = useState<number>(10);
  const [betSelection, setBetSelection] = useState<'over' | 'under' | null>(null);
  const [filterTotalType, setFilterTotalType] = useState<string>('all');

  // Mock team totals data
  const mockTeamTotals: TeamTotal[] = [
    {
      id: 'total-1',
      teamName: 'Kansas City Chiefs',
      teamAbbr: 'KC',
      opponent: 'Buffalo Bills',
      gameDate: '2024-01-21T20:00:00Z',
      totalType: 'Total Points',
      overUnder: 28.5,
      overOdds: -110,
      underOdds: -110,
      lastUpdated: new Date().toISOString(),
      oddsMovement: {
        overOdds: -105,
        underOdds: -115,
        overUnder: 29.0
      },
      teamStats: {
        seasonAverage: 28.7,
        lastGame: 31,
        last3Games: 26.3,
        homeAway: 'home'
      }
    },
    {
      id: 'total-2',
      teamName: 'Buffalo Bills',
      teamAbbr: 'BUF',
      opponent: 'Kansas City Chiefs',
      gameDate: '2024-01-21T20:00:00Z',
      totalType: 'Total Points',
      overUnder: 24.5,
      overOdds: -115,
      underOdds: -105,
      lastUpdated: new Date().toISOString(),
      teamStats: {
        seasonAverage: 25.2,
        lastGame: 27,
        last3Games: 24.7,
        homeAway: 'away'
      }
    },
    {
      id: 'total-3',
      teamName: 'Kansas City Chiefs',
      teamAbbr: 'KC',
      opponent: 'Buffalo Bills',
      gameDate: '2024-01-21T20:00:00Z',
      totalType: 'Total Yards',
      overUnder: 385.5,
      overOdds: -110,
      underOdds: -110,
      lastUpdated: new Date().toISOString(),
      teamStats: {
        seasonAverage: 378.9,
        lastGame: 412,
        last3Games: 365.3,
        homeAway: 'home'
      }
    },
    {
      id: 'total-4',
      teamName: 'Buffalo Bills',
      teamAbbr: 'BUF',
      opponent: 'Kansas City Chiefs',
      gameDate: '2024-01-21T20:00:00Z',
      totalType: 'Total Yards',
      overUnder: 365.5,
      overOdds: -105,
      underOdds: -115,
      lastUpdated: new Date().toISOString(),
      teamStats: {
        seasonAverage: 372.4,
        lastGame: 389,
        last3Games: 358.7,
        homeAway: 'away'
      }
    },
    {
      id: 'total-5',
      teamName: 'Kansas City Chiefs',
      teamAbbr: 'KC',
      opponent: 'Buffalo Bills',
      gameDate: '2024-01-21T20:00:00Z',
      totalType: 'Total Touchdowns',
      overUnder: 2.5,
      overOdds: -120,
      underOdds: +100,
      lastUpdated: new Date().toISOString(),
      teamStats: {
        seasonAverage: 2.8,
        lastGame: 3,
        last3Games: 2.3,
        homeAway: 'home'
      }
    }
  ];

  const [teamTotals, setTeamTotals] = useState<TeamTotal[]>(mockTeamTotals);

  useEffect(() => {
    if (marketData && marketData.teamTotals) {
      setTeamTotals(marketData.teamTotals);
    }
  }, [marketData]);

  const filteredTotals = teamTotals.filter(total => {
    if (filterTotalType !== 'all' && total.totalType !== filterTotalType) return false;
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

  const handleTotalSelection = (total: TeamTotal, selection: 'over' | 'under') => {
    setSelectedTotal(total);
    setBetSelection(selection);
  };

  const handlePlaceBet = () => {
    if (selectedTotal && betSelection && betAmount <= tokenBalance) {
      const betData = {
        gameId: `team-total-${selectedTotal.id}`,
        teamName: selectedTotal.teamName,
        opponent: selectedTotal.opponent,
        totalType: selectedTotal.totalType,
        overUnder: selectedTotal.overUnder,
        selection: betSelection,
        odds: betSelection === 'over' ? selectedTotal.overOdds : selectedTotal.underOdds,
        amount: betAmount,
        potentialPayout: calculatePayout(
          betSelection === 'over' ? selectedTotal.overOdds : selectedTotal.underOdds,
          betAmount
        ),
        betType: 'team_total'
      };
      
      onPlaceBet(betData);
      setSelectedTotal(null);
      setBetSelection(null);
      setBetAmount(10);
    } else {
      alert('Insufficient token balance or invalid bet selection');
    }
  };

  const getStatColor = (current: number, overUnder: number) => {
    if (current > overUnder) return 'text-green-600';
    if (current < overUnder) return 'text-red-600';
    return 'text-gray-600';
  };

  const getTotalTypeColor = (type: string) => {
    switch (type) {
      case 'Total Points':
        return 'bg-blue-100 text-blue-800';
      case 'Total Yards':
        return 'bg-green-100 text-green-800';
      case 'Total Touchdowns':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Total Type:</label>
            <select
              value={filterTotalType}
              onChange={(e) => setFilterTotalType(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Types</option>
              <option value="Total Points">Total Points</option>
              <option value="Total Yards">Total Yards</option>
              <option value="Total Touchdowns">Total Touchdowns</option>
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
          
          <div className="text-sm text-gray-600">
            Balance: {tokenBalance.toLocaleString()} tokens
          </div>
        </div>
      </div>

      {/* Team Totals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTotals.map((total) => (
          <div key={total.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Team Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <BuildingOfficeIcon className="h-8 w-8 text-gray-400" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{total.teamName}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">vs {total.opponent}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTotalTypeColor(total.totalType)}`}>
                        {total.totalType}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <ClockIcon className="h-4 w-4" />
                  <span>{new Date(total.lastUpdated).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            {/* Total Details */}
            <div className="p-6">
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">{total.totalType}</h4>
                <div className="text-center">
                  <span className="text-3xl font-bold text-gray-900">{total.overUnder}</span>
                  {total.oddsMovement && (
                    <div className="flex items-center justify-center text-sm text-gray-500 mt-1">
                      {total.oddsMovement.overUnder > total.overUnder ? (
                        <ArrowUpIcon className="h-4 w-4 text-green-500" />
                      ) : total.oddsMovement.overUnder < total.overUnder ? (
                        <ArrowDownIcon className="h-4 w-4 text-red-500" />
                      ) : null}
                      {total.oddsMovement.overUnder !== total.overUnder && (
                        <span className="ml-1">{total.oddsMovement.overUnder}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Betting Options */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => handleTotalSelection(total, 'over')}
                  className={`p-3 rounded-lg border-2 text-center transition-colors ${
                    selectedTotal?.id === total.id && betSelection === 'over'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900">Over</div>
                  <div className="text-lg font-bold text-blue-600">{formatOdds(total.overOdds)}</div>
                  {total.oddsMovement && (
                    <div className="flex items-center justify-center text-xs text-gray-500">
                      {total.oddsMovement.overOdds > total.overOdds ? (
                        <ArrowUpIcon className="h-3 w-3 text-green-500" />
                      ) : total.oddsMovement.overOdds < total.overOdds ? (
                        <ArrowDownIcon className="h-3 w-3 text-red-500" />
                      ) : null}
                      {total.oddsMovement.overOdds !== total.overOdds && formatOdds(total.oddsMovement.overOdds)}
                    </div>
                  )}
                </button>
                
                <button
                  onClick={() => handleTotalSelection(total, 'under')}
                  className={`p-3 rounded-lg border-2 text-center transition-colors ${
                    selectedTotal?.id === total.id && betSelection === 'under'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900">Under</div>
                  <div className="text-lg font-bold text-blue-600">{formatOdds(total.underOdds)}</div>
                  {total.oddsMovement && (
                    <div className="flex items-center justify-center text-xs text-gray-500">
                      {total.oddsMovement.underOdds > total.underOdds ? (
                        <ArrowUpIcon className="h-3 w-3 text-green-500" />
                      ) : total.oddsMovement.underOdds < total.underOdds ? (
                        <ArrowDownIcon className="h-3 w-3 text-red-500" />
                      ) : null}
                      {total.oddsMovement.underOdds !== total.underOdds && formatOdds(total.oddsMovement.underOdds)}
                    </div>
                  )}
                </button>
              </div>

              {/* Team Stats */}
              {total.teamStats && (
                <div className="border-t border-gray-200 pt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Team Statistics</h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Season Avg:</span>
                      <span className={getStatColor(total.teamStats.seasonAverage, total.overUnder)}>
                        {total.teamStats.seasonAverage}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Game:</span>
                      <span className={getStatColor(total.teamStats.lastGame, total.overUnder)}>
                        {total.teamStats.lastGame}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last 3 Games:</span>
                      <span className={getStatColor(total.teamStats.last3Games, total.overUnder)}>
                        {total.teamStats.last3Games}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Home/Away:</span>
                      <span className="text-gray-900 capitalize">{total.teamStats.homeAway}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bet Confirmation */}
      {selectedTotal && betSelection && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-md">
          <h4 className="font-semibold text-gray-900 mb-3">Confirm Team Total Bet</h4>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Team:</span> {selectedTotal.teamName}</div>
            <div><span className="font-medium">Total Type:</span> {selectedTotal.totalType}</div>
            <div><span className="font-medium">Selection:</span> {betSelection} {selectedTotal.overUnder}</div>
            <div><span className="font-medium">Odds:</span> {formatOdds(betSelection === 'over' ? selectedTotal.overOdds : selectedTotal.underOdds)}</div>
            <div><span className="font-medium">Amount:</span> {betAmount} tokens</div>
            <div><span className="font-medium">Potential Payout:</span> {calculatePayout(betSelection === 'over' ? selectedTotal.overOdds : selectedTotal.underOdds, betAmount).toFixed(2)} tokens</div>
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
                setSelectedTotal(null);
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
