/**
 * BettingAnalytics Component
 * 
 * Provides comprehensive betting analytics and insights including
 * performance metrics, trends, and predictive analytics.
 * 
 * Features:
 * - Performance metrics and KPIs
 * - Betting trends and patterns
 * - ROI analysis
 * - Risk assessment
 * - Predictive insights
 * - Visual charts and graphs
 * 
 * @author Fantasy Football Companion App
 * @version 1.0.0
 */

import React, { useMemo } from 'react';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/20/solid';

interface BettingAnalyticsProps {
  leagueId: string;
  userId: string;
  bettingHistory: any[];
  tokenBalance: number;
}

export const BettingAnalytics: React.FC<BettingAnalyticsProps> = ({
  leagueId,
  userId,
  bettingHistory,
  tokenBalance
}) => {
  // Calculate comprehensive analytics
  const analytics = useMemo(() => {
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
    const roi = totalWagered > 0 ? ((totalWon - totalLost) / totalWagered) * 100 : 0;
    const winRate = totalBets > 0 ? (wonBets / totalBets) * 100 : 0;
    
    // Average bet size
    const avgBetSize = totalBets > 0 ? totalWagered / totalBets : 0;
    
    // Bet type analysis
    const betTypeStats = bettingHistory.reduce((acc, bet) => {
      const type = bet.betType || 'unknown';
      if (!acc[type]) {
        acc[type] = { total: 0, won: 0, amount: 0 };
      }
      acc[type].total++;
      acc[type].amount += bet.amount || 0;
      if (bet.status === 'won') acc[type].won++;
      return acc;
    }, {} as Record<string, { total: number; won: number; amount: number }>);
    
    // Weekly performance
    const weeklyStats = bettingHistory.reduce((acc, bet) => {
      const week = bet.week || 1;
      if (!acc[week]) {
        acc[week] = { total: 0, won: 0, amount: 0, profit: 0 };
      }
      acc[week].total++;
      acc[week].amount += bet.amount || 0;
      if (bet.status === 'won') {
        acc[week].won++;
        acc[week].profit += bet.payout || 0;
      } else if (bet.status === 'lost') {
        acc[week].profit -= bet.amount || 0;
      }
      return acc;
    }, {} as Record<number, { total: number; won: number; amount: number; profit: number }>);
    
    // Recent performance (last 10 bets)
    const recentBets = bettingHistory.slice(0, 10);
    const recentWinRate = recentBets.length > 0 ? 
      (recentBets.filter(bet => bet.status === 'won').length / recentBets.length) * 100 : 0;
    
    // Risk assessment
    const riskLevel = (() => {
      if (avgBetSize > tokenBalance * 0.1) return 'high';
      if (avgBetSize > tokenBalance * 0.05) return 'medium';
      return 'low';
    })();
    
    return {
      totalBets,
      wonBets,
      lostBets,
      pendingBets,
      totalWagered,
      totalWon,
      totalLost,
      netProfit,
      roi,
      winRate,
      avgBetSize,
      betTypeStats,
      weeklyStats,
      recentWinRate,
      riskLevel
    };
  }, [bettingHistory, tokenBalance]);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getROIColor = (roi: number) => {
    if (roi > 10) return 'text-green-600';
    if (roi > 0) return 'text-blue-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Wagered</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalWagered.toLocaleString()}</p>
              <p className="text-xs text-gray-500">tokens</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className={`text-2xl font-bold ${getROIColor(analytics.netProfit)}`}>
                {analytics.netProfit >= 0 ? '+' : ''}{analytics.netProfit.toFixed(0)}
              </p>
              <p className="text-xs text-gray-500">tokens</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">ROI</p>
              <p className={`text-2xl font-bold ${getROIColor(analytics.roi)}`}>
                {analytics.roi.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">return on investment</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <ArrowTrendingDownIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Win Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.winRate.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">overall success rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Betting Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Betting Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Bets</span>
              <span className="font-medium text-gray-900">{analytics.totalBets}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Won Bets</span>
              <span className="font-medium text-green-600">{analytics.wonBets}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Lost Bets</span>
              <span className="font-medium text-red-600">{analytics.lostBets}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending Bets</span>
              <span className="font-medium text-yellow-600">{analytics.pendingBets}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Bet Size</span>
              <span className="font-medium text-gray-900">{analytics.avgBetSize.toFixed(0)} tokens</span>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Risk Level</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(analytics.riskLevel)}`}>
                {analytics.riskLevel.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Current Balance</span>
              <span className="font-medium text-gray-900">{tokenBalance.toLocaleString()} tokens</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Recent Win Rate</span>
              <span className="font-medium text-gray-900">{analytics.recentWinRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Recommended Bet Size</span>
              <span className="font-medium text-gray-900">
                {Math.max(1, Math.floor(tokenBalance * 0.05))} tokens
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bet Type Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bet Type Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bet Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Bets
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Win Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(analytics.betTypeStats).map(([type, stats]: [string, any]) => (
                <tr key={type}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                    {type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stats.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {((stats.won / stats.total) * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stats.amount.toFixed(0)} tokens
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      (stats.won / stats.total) > 0.5 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                    }`}>
                      {(stats.won / stats.total) > 0.5 ? 'Profitable' : 'Loss'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(analytics.weeklyStats).map(([week, stats]: [string, any]) => (
            <div key={week} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-900">Week {week}</h4>
                <span className={`text-sm font-medium ${
                  stats.profit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats.profit >= 0 ? '+' : ''}{stats.profit.toFixed(0)}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Bets:</span>
                  <span>{stats.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Wins:</span>
                  <span>{stats.won}</span>
                </div>
                <div className="flex justify-between">
                  <span>Win Rate:</span>
                  <span>{((stats.won / stats.total) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>{stats.amount.toFixed(0)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights & Recommendations</h3>
        <div className="space-y-4">
          {analytics.roi > 0 && (
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <ArrowTrendingUpIcon className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800">Positive Performance</h4>
                <p className="text-sm text-green-700">
                  You're showing a positive ROI of {analytics.roi.toFixed(1)}%. Consider maintaining your current betting strategy.
                </p>
              </div>
            </div>
          )}
          
          {analytics.riskLevel === 'high' && (
            <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">High Risk Detected</h4>
                <p className="text-sm text-red-700">
                  Your average bet size is high relative to your balance. Consider reducing bet sizes to manage risk better.
                </p>
              </div>
            </div>
          )}
          
          {analytics.recentWinRate < analytics.winRate && (
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
              <ArrowTrendingDownIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Recent Performance Decline</h4>
                <p className="text-sm text-yellow-700">
                  Your recent win rate is lower than your overall average. Consider reviewing your recent betting patterns.
                </p>
              </div>
            </div>
          )}
          
          {analytics.betTypeStats.moneyline && analytics.betTypeStats.moneyline.won / analytics.betTypeStats.moneyline.total > 0.6 && (
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <ChartBarIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800">Moneyline Strength</h4>
                <p className="text-sm text-blue-700">
                  You're performing well on moneyline bets. Consider focusing more on this bet type.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
