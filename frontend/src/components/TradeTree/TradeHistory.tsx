/**
 * TradeHistory Component
 * 
 * Displays a comprehensive history of all trades with filtering,
 * sorting, and detailed trade information.
 * 
 * Features:
 * - Chronological trade history
 * - Filtering by team, date, status
 * - Sorting by various criteria
 * - Detailed trade information
 * - Export functionality
 * 
 * @author Fantasy Football Companion App
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { 
  ArrowPathIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  ClockIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  ShareIcon
} from '@heroicons/react/20/solid';

interface TradeData {
  id: string;
  date: string;
  teams: {
    team1: {
      id: string;
      name: string;
      players: string[];
      picks: string[];
    };
    team2: {
      id: string;
      name: string;
      players: string[];
      picks: string[];
    };
  };
  value: {
    team1_value: number;
    team2_value: number;
    fair_value: number;
    winner: 'team1' | 'team2' | 'fair';
  };
  roi?: {
    team1_roi: number;
    team2_roi: number;
  };
  status: 'completed' | 'pending' | 'cancelled';
}

interface TradeHistoryProps {
  tradeData: TradeData[];
  onSelectTrade: (trade: TradeData) => void;
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({
  tradeData,
  onSelectTrade
}) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'cancelled'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'value' | 'roi'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedTrades = tradeData
    .filter(trade => filter === 'all' || trade.status === filter)
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'value':
          comparison = (a.value.team1_value + a.value.team2_value) - (b.value.team1_value + b.value.team2_value);
          break;
        case 'roi':
          const aROI = a.roi ? (a.roi.team1_roi + a.roi.team2_roi) / 2 : 0;
          const bROI = b.roi ? (b.roi.team1_roi + b.roi.team2_roi) / 2 : 0;
          comparison = aROI - bROI;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getWinnerColor = (winner: string) => {
    switch (winner) {
      case 'team1':
        return 'text-blue-600';
      case 'team2':
        return 'text-red-600';
      case 'fair':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Sorting */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Filter */}
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Trades</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date">Date</option>
              <option value="value">Value</option>
              <option value="roi">ROI</option>
            </select>
          </div>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
          >
            {sortOrder === 'asc' ? (
              <ArrowUpIcon className="h-4 w-4" />
            ) : (
              <ArrowDownIcon className="h-4 w-4" />
            )}
            <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
          </button>

          {/* Results Count */}
          <div className="ml-auto text-sm text-gray-600">
            {filteredAndSortedTrades.length} of {tradeData.length} trades
          </div>
        </div>
      </div>

      {/* Trade List */}
      <div className="space-y-4">
        {filteredAndSortedTrades.map((trade, index) => (
          <div
            key={trade.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelectTrade(trade)}
          >
            {/* Trade Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold">
                  #{index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Trade #{trade.id.split('-')[1]}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4" />
                    <span>{formatDate(trade.date)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(trade.status)}`}>
                  {trade.status}
                </span>
                <div className="flex items-center space-x-1">
                  <EyeIcon className="h-4 w-4 text-gray-400" />
                  <ShareIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Trade Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Team 1 */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <h4 className="font-medium text-gray-900">{trade.teams.team1.name}</h4>
                </div>
                
                {/* Players */}
                {trade.teams.team1.players.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Players</div>
                    <div className="space-y-1">
                      {trade.teams.team1.players.map((player, playerIndex) => (
                        <div key={playerIndex} className="text-sm text-gray-700 pl-3">
                          • {player}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Picks */}
                {trade.teams.team1.picks.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Draft Picks</div>
                    <div className="space-y-1">
                      {trade.teams.team1.picks.map((pick, pickIndex) => (
                        <div key={pickIndex} className="text-sm text-gray-700 pl-3">
                          • {pick}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Value and ROI */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Value:</span>
                    <span className="font-semibold text-gray-900">{trade.value.team1_value}</span>
                  </div>
                  {trade.roi && (
                    <div className={`flex items-center justify-between text-sm ${
                      trade.roi.team1_roi > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <span>ROI:</span>
                      <span className="font-semibold">
                        {trade.roi.team1_roi > 0 ? '+' : ''}{trade.roi.team1_roi.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* VS Divider */}
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-400 mb-2">VS</div>
                  <div className={`text-sm font-medium ${getWinnerColor(trade.value.winner)}`}>
                    Winner: {trade.value.winner}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Fair Value: {trade.value.fair_value}
                  </div>
                </div>
              </div>

              {/* Team 2 */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <h4 className="font-medium text-gray-900">{trade.teams.team2.name}</h4>
                </div>
                
                {/* Players */}
                {trade.teams.team2.players.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Players</div>
                    <div className="space-y-1">
                      {trade.teams.team2.players.map((player, playerIndex) => (
                        <div key={playerIndex} className="text-sm text-gray-700 pl-3">
                          • {player}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Picks */}
                {trade.teams.team2.picks.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Draft Picks</div>
                    <div className="space-y-1">
                      {trade.teams.team2.picks.map((pick, pickIndex) => (
                        <div key={pickIndex} className="text-sm text-gray-700 pl-3">
                          • {pick}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Value and ROI */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Value:</span>
                    <span className="font-semibold text-gray-900">{trade.value.team2_value}</span>
                  </div>
                  {trade.roi && (
                    <div className={`flex items-center justify-between text-sm ${
                      trade.roi.team2_roi > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <span>ROI:</span>
                      <span className="font-semibold">
                        {trade.roi.team2_roi > 0 ? '+' : ''}{trade.roi.team2_roi.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedTrades.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <ArrowPathIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No trades found</h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? 'No trades have been recorded for this league yet.'
              : `No ${filter} trades found.`
            }
          </p>
        </div>
      )}
    </div>
  );
};
