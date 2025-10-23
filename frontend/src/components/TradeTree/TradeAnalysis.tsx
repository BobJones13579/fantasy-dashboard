/**
 * TradeAnalysis Component
 * 
 * Provides detailed trade analysis including ROI tracking,
 * value calculations, and trade grades.
 * 
 * Features:
 * - Trade ROI tracking and analysis
 * - Value calculation and fairness assessment
 * - Trade grades and reviews
 * - Long-term performance tracking
 * - Trade pattern analysis
 * 
 * @author Fantasy Football Companion App
 * @version 1.0.0
 */

import React from 'react';
import { 
  ChartBarIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  StarIcon,
  ArrowPathIcon,
  ClockIcon
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

interface TradeAnalysisProps {
  tradeData: TradeData[];
  selectedTrade: TradeData | null;
}

export const TradeAnalysis: React.FC<TradeAnalysisProps> = ({
  tradeData,
  selectedTrade
}) => {
  const getTradeGrade = (roi: number) => {
    if (roi >= 20) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-100' };
    if (roi >= 15) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' };
    if (roi >= 10) return { grade: 'A-', color: 'text-green-600', bg: 'bg-green-100' };
    if (roi >= 5) return { grade: 'B+', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (roi >= 0) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (roi >= -5) return { grade: 'B-', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (roi >= -10) return { grade: 'C+', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (roi >= -15) return { grade: 'C', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { grade: 'D', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getOverallLeagueStats = () => {
    const completedTrades = tradeData.filter(trade => trade.status === 'completed');
    const totalValue = completedTrades.reduce((sum, trade) => sum + trade.value.team1_value + trade.value.team2_value, 0);
    const avgValue = completedTrades.length > 0 ? totalValue / (completedTrades.length * 2) : 0;
    
    const team1Wins = completedTrades.filter(trade => trade.value.winner === 'team1').length;
    const team2Wins = completedTrades.filter(trade => trade.value.winner === 'team2').length;
    const fairTrades = completedTrades.filter(trade => trade.value.winner === 'fair').length;
    
    return {
      totalTrades: completedTrades.length,
      totalValue,
      avgValue,
      team1Wins,
      team2Wins,
      fairTrades
    };
  };

  const getTopPerformers = () => {
    const teamStats: { [key: string]: { name: string; trades: number; totalROI: number; avgROI: number } } = {};
    
    tradeData.forEach(trade => {
      if (trade.roi) {
        // Team 1
        if (!teamStats[trade.teams.team1.id]) {
          teamStats[trade.teams.team1.id] = {
            name: trade.teams.team1.name,
            trades: 0,
            totalROI: 0,
            avgROI: 0
          };
        }
        teamStats[trade.teams.team1.id].trades += 1;
        teamStats[trade.teams.team1.id].totalROI += trade.roi.team1_roi;
        
        // Team 2
        if (!teamStats[trade.teams.team2.id]) {
          teamStats[trade.teams.team2.id] = {
            name: trade.teams.team2.name,
            trades: 0,
            totalROI: 0,
            avgROI: 0
          };
        }
        teamStats[trade.teams.team2.id].trades += 1;
        teamStats[trade.teams.team2.id].totalROI += trade.roi.team2_roi;
      }
    });
    
    // Calculate average ROI
    Object.values(teamStats).forEach(team => {
      team.avgROI = team.totalROI / team.trades;
    });
    
    return Object.values(teamStats).sort((a, b) => b.avgROI - a.avgROI);
  };

  const stats = getOverallLeagueStats();
  const topPerformers = getTopPerformers();

  return (
    <div className="space-y-6">
      {/* Selected Trade Analysis */}
      {selectedTrade && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Trade Analysis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Team 1 Analysis */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">{selectedTrade.teams.team1.name}</h4>
              
              {selectedTrade.roi && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">ROI</span>
                    <div className={`flex items-center space-x-2 ${
                      selectedTrade.roi.team1_roi > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedTrade.roi.team1_roi > 0 ? (
                        <TrendingUpIcon className="h-4 w-4" />
                      ) : (
                        <TrendingDownIcon className="h-4 w-4" />
                      )}
                      <span className="font-semibold">
                        {selectedTrade.roi.team1_roi > 0 ? '+' : ''}{selectedTrade.roi.team1_roi.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Grade</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTradeGrade(selectedTrade.roi.team1_roi).bg} ${getTradeGrade(selectedTrade.roi.team1_roi).color}`}>
                      {getTradeGrade(selectedTrade.roi.team1_roi).grade}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Value Received</span>
                    <span className="font-semibold text-gray-900">{selectedTrade.value.team1_value}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Team 2 Analysis */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">{selectedTrade.teams.team2.name}</h4>
              
              {selectedTrade.roi && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">ROI</span>
                    <div className={`flex items-center space-x-2 ${
                      selectedTrade.roi.team2_roi > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedTrade.roi.team2_roi > 0 ? (
                        <TrendingUpIcon className="h-4 w-4" />
                      ) : (
                        <TrendingDownIcon className="h-4 w-4" />
                      )}
                      <span className="font-semibold">
                        {selectedTrade.roi.team2_roi > 0 ? '+' : ''}{selectedTrade.roi.team2_roi.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Grade</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTradeGrade(selectedTrade.roi.team2_roi).bg} ${getTradeGrade(selectedTrade.roi.team2_roi).color}`}>
                      {getTradeGrade(selectedTrade.roi.team2_roi).grade}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Value Received</span>
                    <span className="font-semibold text-gray-900">{selectedTrade.value.team2_value}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Trade Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h5 className="font-medium text-gray-900 mb-3">Trade Summary</h5>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-600">Fair Value</div>
                <div className="text-lg font-semibold text-gray-900">{selectedTrade.value.fair_value}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Winner</div>
                <div className="text-lg font-semibold text-gray-900 capitalize">{selectedTrade.value.winner}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Date</div>
                <div className="text-lg font-semibold text-gray-900">
                  {new Date(selectedTrade.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* League Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">League Trade Overview</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalTrades}</div>
            <div className="text-sm text-gray-600">Total Trades</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.totalValue}</div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.avgValue.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Avg Value</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.fairTrades}</div>
            <div className="text-sm text-gray-600">Fair Trades</div>
          </div>
        </div>

        {/* Trade Distribution */}
        <div className="mb-6">
          <h5 className="font-medium text-gray-900 mb-3">Trade Distribution</h5>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-600">{stats.team1Wins}</div>
              <div className="text-sm text-gray-600">Team 1 Wins</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold text-green-600">{stats.fairTrades}</div>
              <div className="text-sm text-gray-600">Fair Trades</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-lg font-semibold text-red-600">{stats.team2Wins}</div>
              <div className="text-sm text-gray-600">Team 2 Wins</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Trade Performers</h3>
        
        <div className="space-y-3">
          {topPerformers.slice(0, 5).map((team, index) => (
            <div key={team.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{team.name}</div>
                  <div className="text-sm text-gray-600">{team.trades} trades</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-semibold ${team.avgROI > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {team.avgROI > 0 ? '+' : ''}{team.avgROI.toFixed(1)}% avg ROI
                </div>
                <div className="text-sm text-gray-600">
                  {getTradeGrade(team.avgROI).grade} grade
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trade Insights */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trade Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <ChartBarIcon className="h-5 w-5 text-blue-500" />
              <h5 className="font-medium text-gray-900">Most Active Trader</h5>
            </div>
            <p className="text-sm text-gray-600">
              {topPerformers.length > 0 ? topPerformers[0].name : 'N/A'} with {topPerformers.length > 0 ? topPerformers[0].trades : 0} trades
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrophyIcon className="h-5 w-5 text-green-500" />
              <h5 className="font-medium text-gray-900">Best ROI</h5>
            </div>
            <p className="text-sm text-gray-600">
              {topPerformers.length > 0 ? topPerformers[0].name : 'N/A'} with {topPerformers.length > 0 ? topPerformers[0].avgROI.toFixed(1) : 0}% average ROI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
