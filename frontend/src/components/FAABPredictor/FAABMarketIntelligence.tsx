import React from 'react';

interface FAABMarketIntelligence {
  league_id: string;
  week: number;
  market_intelligence: {
    position_trends: Record<string, {
      total_bids: number;
      average_bid: number;
      max_bid: number;
      trend: string;
    }>;
    budget_trends: {
      weekly_spending: Record<string, number>;
      average_weekly_spending: number;
      trend: string;
    };
    timing_patterns: {
      average_bid_time: string;
      peak_bidding_hours: string[];
      early_bidders: number;
    };
    market_insights: string[];
    league_efficiency: number;
    recommendations: string[];
  };
  timestamp: string;
}

interface FAABMarketIntelligenceProps {
  intelligence: FAABMarketIntelligence | null;
  onRefresh: () => void;
}

export const FAABMarketIntelligence: React.FC<FAABMarketIntelligenceProps> = ({
  intelligence,
  onRefresh
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 0.8) return 'text-green-600 bg-green-100';
    if (efficiency >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  if (!intelligence) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading market intelligence...</p>
        <button
          onClick={onRefresh}
          className="mt-4 text-blue-600 hover:text-blue-800 underline"
        >
          Refresh
        </button>
      </div>
    );
  }

  const { market_intelligence } = intelligence;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Market Intelligence</h2>
          <p className="text-sm text-gray-600">
            Week {intelligence.week} • League {intelligence.league_id}
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* League Efficiency Score */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">League Efficiency Score</h3>
        <div className="flex items-center space-x-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEfficiencyColor(market_intelligence.league_efficiency)}`}>
            {Math.round(market_intelligence.league_efficiency * 100)}% Efficient
          </div>
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  market_intelligence.league_efficiency >= 0.8 ? 'bg-green-500' : 
                  market_intelligence.league_efficiency >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${market_intelligence.league_efficiency * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Insights */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Insights</h3>
        <div className="space-y-3">
          {market_intelligence.market_insights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              </div>
              <p className="text-sm text-gray-700">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Position Trends */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Position Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(market_intelligence.position_trends).map(([position, trends]) => (
            <div key={position} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{position}</h4>
                <span className="text-sm">{getTrendIcon(trends.trend)}</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Bids:</span>
                  <span className="font-medium">{trends.total_bids}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Bid:</span>
                  <span className="font-medium">{formatCurrency(trends.average_bid)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Bid:</span>
                  <span className="font-medium">{formatCurrency(trends.max_bid)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Trends */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Weekly Spending</h4>
            <div className="space-y-2">
              {Object.entries(market_intelligence.budget_trends.weekly_spending).map(([week, spending]) => (
                <div key={week} className="flex justify-between text-sm">
                  <span className="text-gray-600">Week {week}:</span>
                  <span className="font-medium">{formatCurrency(spending)}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Weekly:</span>
                <span className="font-medium">{formatCurrency(market_intelligence.budget_trends.average_weekly_spending)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trend:</span>
                <span className="font-medium flex items-center">
                  {getTrendIcon(market_intelligence.budget_trends.trend)}
                  <span className="ml-1 capitalize">{market_intelligence.budget_trends.trend}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timing Patterns */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Timing Patterns</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Average Bid Time</h4>
            <p className="text-sm text-gray-600">{market_intelligence.timing_patterns.average_bid_time}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Peak Hours</h4>
            <div className="space-y-1">
              {market_intelligence.timing_patterns.peak_bidding_hours.map((hour, index) => (
                <p key={index} className="text-sm text-gray-600">{hour}</p>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Early Bidders</h4>
            <p className="text-sm text-gray-600">{market_intelligence.timing_patterns.early_bidders} teams</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Recommendations</h3>
        <div className="space-y-3">
          {market_intelligence.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              </div>
              <p className="text-sm text-gray-700">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-xs text-gray-500 text-center">
        Last updated: {new Date(intelligence.timestamp).toLocaleString()}
      </div>
    </div>
  );
};
