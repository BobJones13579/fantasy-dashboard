/**
 * BettingHistory Component
 * 
 * Displays comprehensive betting history with filtering, sorting,
 * and detailed bet information including results and payouts.
 * 
 * Features:
 * - Complete betting history display
 * - Filter by bet type, status, date range
 * - Sort by various criteria
 * - Detailed bet information
 * - Win/loss statistics
 * - Export functionality
 * 
 * @author Fantasy Football Companion App
 * @version 1.0.0
 */

import React, { useState, useMemo } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/20/solid';

interface BettingHistoryProps {
  leagueId: string;
  userId: string;
  bettingHistory: any[];
}

interface FilterOptions {
  betType: string;
  status: string;
  dateRange: string;
}

interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export const BettingHistory: React.FC<BettingHistoryProps> = ({
  leagueId,
  userId,
  bettingHistory
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    betType: 'all',
    status: 'all',
    dateRange: 'all'
  });
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: 'date',
    direction: 'desc'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalBets = bettingHistory.length;
    const wonBets = bettingHistory.filter(bet => bet.status === 'won').length;
    const lostBets = bettingHistory.filter(bet => bet.status === 'lost').length;
    const pendingBets = bettingHistory.filter(bet => bet.status === 'pending').length;
    const totalWagered = bettingHistory.reduce((sum, bet) => sum + (bet.amount || 0), 0);
    const totalWon = bettingHistory
      .filter(bet => bet.status === 'won')
      .reduce((sum, bet) => sum + (bet.payout || 0), 0);
    const totalLost = bettingHistory
      .filter(bet => bet.status === 'lost')
      .reduce((sum, bet) => sum + (bet.amount || 0), 0);
    const netProfit = totalWon - totalLost;
    const winRate = totalBets > 0 ? (wonBets / totalBets) * 100 : 0;

    return {
      totalBets,
      wonBets,
      lostBets,
      pendingBets,
      totalWagered,
      totalWon,
      totalLost,
      netProfit,
      winRate
    };
  }, [bettingHistory]);

  // Filter and sort betting history
  const filteredHistory = useMemo(() => {
    let filtered = bettingHistory;

    // Apply filters
    if (filters.betType !== 'all') {
      filtered = filtered.filter(bet => bet.betType === filters.betType);
    }
    if (filters.status !== 'all') {
      filtered = filtered.filter(bet => bet.status === filters.status);
    }
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const days = parseInt(filters.dateRange);
      const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(bet => new Date(bet.date) >= cutoffDate);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortOptions.field];
      let bValue = b[sortOptions.field];

      if (sortOptions.field === 'date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOptions.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [bettingHistory, filters, sortOptions]);

  const handleSort = (field: string) => {
    setSortOptions(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'won':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'lost':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won':
        return 'text-green-600 bg-green-50';
      case 'lost':
        return 'text-red-600 bg-red-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatOdds = (odds: number): string => {
    return odds > 0 ? `+${odds}` : `${odds}`;
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bets</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Win Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.winRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className={`text-2xl font-bold ${stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.netProfit >= 0 ? '+' : ''}{stats.netProfit.toFixed(0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingBets}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Betting History</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <FunnelIcon className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bet Type</label>
              <select
                value={filters.betType}
                onChange={(e) => setFilters(prev => ({ ...prev, betType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="moneyline">Moneyline</option>
                <option value="spread">Spread</option>
                <option value="total">Total</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Time</option>
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Betting History Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  onClick={() => handleSort('date')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    {sortOptions.field === 'date' && (
                      sortOptions.direction === 'asc' ? 
                        <ArrowUpIcon className="h-4 w-4" /> : 
                        <ArrowDownIcon className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Game
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Odds
                </th>
                <th
                  onClick={() => handleSort('amount')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-1">
                    <span>Amount</span>
                    {sortOptions.field === 'amount' && (
                      sortOptions.direction === 'asc' ? 
                        <ArrowUpIcon className="h-4 w-4" /> : 
                        <ArrowDownIcon className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payout
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No betting history found
                  </td>
                </tr>
              ) : (
                filteredHistory.map((bet, index) => (
                  <tr key={bet.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(bet.date || bet.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{bet.awayTeam} @ {bet.homeTeam}</div>
                        <div className="text-gray-500 text-xs">Week {bet.week}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium capitalize">{bet.selection}</div>
                        <div className="text-gray-500 text-xs capitalize">{bet.betType}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatOdds(bet.odds)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bet.amount} tokens
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(bet.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bet.status)}`}>
                          {bet.status.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bet.status === 'won' && bet.payout ? (
                        <span className="text-green-600 font-medium">
                          +{bet.payout} tokens
                        </span>
                      ) : bet.status === 'lost' ? (
                        <span className="text-red-600 font-medium">
                          -{bet.amount} tokens
                        </span>
                      ) : (
                        <span className="text-gray-500">
                          {bet.potentialPayout ? `+${bet.potentialPayout.toFixed(0)}` : 'Pending'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
