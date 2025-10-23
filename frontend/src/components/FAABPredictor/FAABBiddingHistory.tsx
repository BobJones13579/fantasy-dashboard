import React, { useState } from 'react';

interface FAABBiddingHistory {
  league_id: string;
  weeks_back: number;
  bidding_history: Array<{
    id: string;
    player_name: string;
    position: string;
    amount: number;
    user_id: string;
    week: number;
    success: boolean;
    timestamp: string;
  }>;
  statistics: {
    total_bids: number;
    average_bid: number;
    total_spent: number;
    position_distribution: Record<string, number>;
    bid_range: {
      min: number;
      max: number;
    };
  };
  league_profile: {
    average_bid_size: number;
    bid_frequency: number;
    position_preferences: Record<string, number>;
    budget_utilization: number;
    market_efficiency: number;
  };
  timestamp: string;
}

interface FAABBiddingHistoryProps {
  history: FAABBiddingHistory | null;
  onRefresh: () => void;
}

export const FAABBiddingHistory: React.FC<FAABBiddingHistoryProps> = ({
  history,
  onRefresh
}) => {
  const [selectedWeek, setSelectedWeek] = useState<string>('ALL');
  const [selectedPosition, setSelectedPosition] = useState<string>('ALL');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!history) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading bidding history...</p>
        <button
          onClick={onRefresh}
          className="mt-4 text-blue-600 hover:text-blue-800 underline"
        >
          Refresh
        </button>
      </div>
    );
  }

  // Filter bidding history
  const filteredHistory = history.bidding_history.filter(bid => {
    const weekMatch = selectedWeek === 'ALL' || bid.week.toString() === selectedWeek;
    const positionMatch = selectedPosition === 'ALL' || bid.position === selectedPosition;
    return weekMatch && positionMatch;
  });

  // Get unique weeks for filter
  const uniqueWeeks = Array.from(new Set(history.bidding_history.map(bid => bid.week))).sort((a, b) => b - a);
  
  // Get unique positions for filter
  const uniquePositions = Array.from(new Set(history.bidding_history.map(bid => bid.position))).sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Bidding History</h2>
          <p className="text-sm text-gray-600">
            Last {history.weeks_back} weeks • League {history.league_id}
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

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Week</label>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Weeks</option>
              {uniqueWeeks.map(week => (
                <option key={week} value={week.toString()}>Week {week}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Positions</option>
              {uniquePositions.map(position => (
                <option key={position} value={position}>{position}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="text-sm text-gray-600">Total Bids</div>
          <div className="text-2xl font-bold text-gray-900">{history.statistics.total_bids}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="text-sm text-gray-600">Average Bid</div>
          <div className="text-2xl font-bold text-blue-600">{formatCurrency(history.statistics.average_bid)}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="text-sm text-gray-600">Total Spent</div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(history.statistics.total_spent)}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="text-sm text-gray-600">Bid Range</div>
          <div className="text-lg font-semibold text-gray-900">
            {formatCurrency(history.statistics.bid_range.min)} - {formatCurrency(history.statistics.bid_range.max)}
          </div>
        </div>
      </div>

      {/* League Profile */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">League Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(history.league_profile.average_bid_size)}</div>
            <div className="text-sm text-gray-600">Avg Bid Size</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{history.league_profile.bid_frequency.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Bids/Week/Team</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{Math.round(history.league_profile.budget_utilization * 100)}%</div>
            <div className="text-sm text-gray-600">Budget Utilization</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{Math.round(history.league_profile.market_efficiency * 100)}%</div>
            <div className="text-sm text-gray-600">Market Efficiency</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{Object.keys(history.league_profile.position_preferences).length}</div>
            <div className="text-sm text-gray-600">Active Positions</div>
          </div>
        </div>
      </div>

      {/* Position Distribution */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Position Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(history.statistics.position_distribution).map(([position, count]) => (
            <div key={position} className="text-center">
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600">{position}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bidding History Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Bids ({filteredHistory.length})
          </h3>
        </div>
        
        {filteredHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bid Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Week
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Result
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHistory.slice(0, 50).map((bid) => (
                  <tr key={bid.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{bid.player_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {bid.position}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(bid.amount)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Week {bid.week}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        bid.success 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {bid.success ? 'Won' : 'Lost'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(bid.timestamp)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            <p>No bidding history found for the selected filters.</p>
          </div>
        )}
      </div>

      {/* Last Updated */}
      <div className="text-xs text-gray-500 text-center">
        Last updated: {new Date(history.timestamp).toLocaleString()}
      </div>
    </div>
  );
};
