/**
 * TradeInsights Component
 * 
 * Provides trade insights and pattern analysis including
 * market trends, trade patterns, and strategic recommendations.
 * 
 * Features:
 * - Trade pattern analysis
 * - Market trend identification
 * - Strategic recommendations
 * - Trade timing insights
 * - League-specific analytics
 * 
 * @author Fantasy Football Companion App
 * @version 1.0.0
 */

import React from 'react';
import { 
  LightBulbIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  StarIcon,
  ExclamationTriangleIcon
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

interface TradeInsightsProps {
  tradeData: TradeData[];
  leagueId: string;
}

export const TradeInsights: React.FC<TradeInsightsProps> = ({
  tradeData,
  leagueId
}) => {
  const getTradePatterns = () => {
    const completedTrades = tradeData.filter(trade => trade.status === 'completed');
    
    // Analyze trade frequency
    const tradesByMonth: { [key: string]: number } = {};
    completedTrades.forEach(trade => {
      const month = new Date(trade.date).toISOString().substring(0, 7);
      tradesByMonth[month] = (tradesByMonth[month] || 0) + 1;
    });
    
    // Analyze position patterns
    const positionPatterns: { [key: string]: number } = {};
    completedTrades.forEach(trade => {
      [...trade.teams.team1.players, ...trade.teams.team2.players].forEach(player => {
        // Simple position detection (in real app, would use player data)
        const position = player.includes('QB') ? 'QB' :
                        player.includes('RB') ? 'RB' :
                        player.includes('WR') ? 'WR' :
                        player.includes('TE') ? 'TE' :
                        player.includes('K') ? 'K' : 'Other';
        positionPatterns[position] = (positionPatterns[position] || 0) + 1;
      });
    });
    
    return {
      tradesByMonth,
      positionPatterns,
      totalTrades: completedTrades.length,
      avgTradesPerMonth: Object.values(tradesByMonth).length > 0 ? 
        Object.values(tradesByMonth).reduce((sum, count) => sum + count, 0) / Object.values(tradesByMonth).length : 0
    };
  };

  const getMarketTrends = () => {
    const completedTrades = tradeData.filter(trade => trade.status === 'completed');
    
    // Analyze value trends
    const valueTrends = completedTrades.map(trade => ({
      date: new Date(trade.date),
      totalValue: trade.value.team1_value + trade.value.team2_value,
      avgValue: (trade.value.team1_value + trade.value.team2_value) / 2
    })).sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Calculate trend direction
    let trendDirection = 'stable';
    if (valueTrends.length >= 2) {
      const recent = valueTrends.slice(-3);
      const older = valueTrends.slice(0, 3);
      const recentAvg = recent.reduce((sum, t) => sum + t.avgValue, 0) / recent.length;
      const olderAvg = older.reduce((sum, t) => sum + t.avgValue, 0) / older.length;
      
      if (recentAvg > olderAvg * 1.1) trendDirection = 'up';
      else if (recentAvg < olderAvg * 0.9) trendDirection = 'down';
    }
    
    return {
      valueTrends,
      trendDirection,
      currentAvgValue: valueTrends.length > 0 ? valueTrends[valueTrends.length - 1].avgValue : 0,
      peakValue: valueTrends.length > 0 ? Math.max(...valueTrends.map(t => t.totalValue)) : 0
    };
  };

  const getStrategicRecommendations = () => {
    const patterns = getTradePatterns();
    const trends = getMarketTrends();
    
    const recommendations = [];
    
    // Trade frequency recommendation
    if (patterns.avgTradesPerMonth < 2) {
      recommendations.push({
        type: 'frequency',
        icon: ArrowPathIcon,
        title: 'Increase Trade Activity',
        description: 'Your league has low trade activity. Consider being more aggressive in trade negotiations.',
        priority: 'medium',
        color: 'blue'
      });
    }
    
    // Value trend recommendation
    if (trends.trendDirection === 'up') {
      recommendations.push({
        type: 'value',
        icon: ArrowTrendingUpIcon,
        title: 'High Market Values',
        description: 'Trade values are trending upward. Consider selling high on your assets.',
        priority: 'high',
        color: 'green'
      });
    } else if (trends.trendDirection === 'down') {
      recommendations.push({
        type: 'value',
        icon: ArrowTrendingDownIcon,
        title: 'Low Market Values',
        description: 'Trade values are trending downward. This might be a good time to buy low.',
        priority: 'high',
        color: 'red'
      });
    }
    
    // Position analysis
    const topPosition = Object.entries(patterns.positionPatterns).reduce((a, b) => 
      patterns.positionPatterns[a[0]] > patterns.positionPatterns[b[0]] ? a : b, ['', 0]
    );
    
    if (topPosition[0]) {
      recommendations.push({
        type: 'position',
        icon: ChartBarIcon,
        title: `${topPosition[0]} Market Activity`,
        description: `${topPosition[0]} players are being traded most frequently. Monitor this position closely.`,
        priority: 'low',
        color: 'purple'
      });
    }
    
    return recommendations;
  };

  const patterns = getTradePatterns();
  const trends = getMarketTrends();
  const recommendations = getStrategicRecommendations();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return ExclamationTriangleIcon;
      case 'medium': return StarIcon;
      case 'low': return LightBulbIcon;
      default: return LightBulbIcon;
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ArrowPathIcon className="h-5 w-5 text-blue-500" />
            <h4 className="font-medium text-gray-900">Trade Activity</h4>
          </div>
          <div className="text-2xl font-bold text-blue-600">{patterns.totalTrades}</div>
          <div className="text-sm text-gray-600">Total trades</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
            <h4 className="font-medium text-gray-900">Market Trend</h4>
          </div>
          <div className="text-2xl font-bold text-green-600 capitalize">{trends.trendDirection}</div>
          <div className="text-sm text-gray-600">Value direction</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CurrencyDollarIcon className="h-5 w-5 text-purple-500" />
            <h4 className="font-medium text-gray-900">Avg Value</h4>
          </div>
          <div className="text-2xl font-bold text-purple-600">{trends.currentAvgValue.toFixed(1)}</div>
          <div className="text-sm text-gray-600">Current market</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrophyIcon className="h-5 w-5 text-yellow-500" />
            <h4 className="font-medium text-gray-900">Peak Value</h4>
          </div>
          <div className="text-2xl font-bold text-yellow-600">{trends.peakValue}</div>
          <div className="text-sm text-gray-600">Highest trade</div>
        </div>
      </div>

      {/* Trade Patterns */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trade Patterns Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Position Distribution */}
          <div>
            <h5 className="font-medium text-gray-900 mb-3">Position Distribution</h5>
            <div className="space-y-2">
              {Object.entries(patterns.positionPatterns).map(([position, count]) => (
                <div key={position} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{position}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(count / Math.max(...Object.values(patterns.positionPatterns))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Activity */}
          <div>
            <h5 className="font-medium text-gray-900 mb-3">Monthly Activity</h5>
            <div className="space-y-2">
              {Object.entries(patterns.tradesByMonth).map(([month, count]) => (
                <div key={month} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{month}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(count / Math.max(...Object.values(patterns.tradesByMonth))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategic Recommendations</h3>
        
        <div className="space-y-4">
          {recommendations.map((rec, index) => {
            const Icon = rec.icon;
            const PriorityIcon = getPriorityIcon(rec.priority);
            
            return (
              <div key={index} className={`rounded-lg border p-4 ${getPriorityColor(rec.priority)}`}>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h5 className="font-medium text-gray-900">{rec.title}</h5>
                      <PriorityIcon className={`h-4 w-4 ${
                        rec.priority === 'high' ? 'text-red-500' :
                        rec.priority === 'medium' ? 'text-yellow-500' :
                        'text-blue-500'
                      }`} />
                    </div>
                    <p className="text-sm text-gray-700">{rec.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
          
          {recommendations.length === 0 && (
            <div className="text-center py-8">
              <LightBulbIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No specific recommendations</h4>
              <p className="text-gray-600">Your league's trading patterns appear to be well-balanced.</p>
            </div>
          )}
        </div>
      </div>

      {/* Market Insights */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h5 className="font-medium text-gray-900">Current Market Conditions</h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Market Trend</span>
                <span className={`text-sm font-medium capitalize ${
                  trends.trendDirection === 'up' ? 'text-green-600' :
                  trends.trendDirection === 'down' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {trends.trendDirection}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Trade Value</span>
                <span className="text-sm font-medium text-gray-900">{trends.currentAvgValue.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Peak Trade Value</span>
                <span className="text-sm font-medium text-gray-900">{trends.peakValue}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="font-medium text-gray-900">League Activity</h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Trades</span>
                <span className="text-sm font-medium text-gray-900">{patterns.totalTrades}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Trades/Month</span>
                <span className="text-sm font-medium text-gray-900">{patterns.avgTradesPerMonth.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Most Active Position</span>
                <span className="text-sm font-medium text-gray-900">
                  {Object.entries(patterns.positionPatterns).reduce((a, b) => 
                    patterns.positionPatterns[a[0]] > patterns.positionPatterns[b[0]] ? a : b, ['N/A', 0]
                  )[0]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
