import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { FAABRecommendationCard } from './FAABRecommendationCard';
import { FAABMarketIntelligence } from './FAABMarketIntelligence';
import { FAABBiddingHistory } from './FAABBiddingHistory';

interface FAABRecommendation {
  player_id: string;
  player_name: string;
  position: string;
  team: string;
  projected_points: number;
  market_value: number;
  recommended_bid: number;
  confidence_score: number;
  urgency_score: number;
  rationale: string;
  risk_level: 'low' | 'medium' | 'high';
  similar_players: Array<{
    player_name: string;
    position: string;
    bid_amount: number;
    success: boolean;
  }>;
}

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

interface FAABPredictorProps {
  leagueId: string;
  userId: string;
  currentWeek: number;
}

export const FAABPredictor: React.FC<FAABPredictorProps> = ({ 
  leagueId, 
  userId, 
  currentWeek 
}) => {
  const { isConnected, sendMessage, subscribe } = useWebSocket('http://localhost:8000');
  const [activeTab, setActiveTab] = useState<'recommendations' | 'market' | 'history'>('recommendations');
  const [recommendations, setRecommendations] = useState<FAABRecommendation[]>([]);
  const [marketIntelligence, setMarketIntelligence] = useState<FAABMarketIntelligence | null>(null);
  const [biddingHistory, setBiddingHistory] = useState<FAABBiddingHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [positionFilter, setPositionFilter] = useState<string>('ALL');

  useEffect(() => {
    if (isConnected) {
      // Authenticate the client
      sendMessage('authenticate', { user_id: userId, league_id: leagueId });
      // Subscribe to league updates
      sendMessage('subscribe_league', { league_id: leagueId });
    }
  }, [isConnected, leagueId, userId, sendMessage]);

  useEffect(() => {
    // Subscribe to FAAB updates
    const unsubscribe = subscribe('faab_recommendations_updated', (data: any) => {
      console.log('Received FAAB recommendations update:', data);
      if (data.recommendations) {
        setRecommendations(data.recommendations.recommendations || []);
      }
    });

    return () => unsubscribe();
  }, [subscribe]);

  useEffect(() => {
    loadRecommendations();
    loadMarketIntelligence();
    loadBiddingHistory();
  }, [leagueId, currentWeek]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `http://localhost:8000/api/v1/faab-predictor/recommendations?league_id=${leagueId}&week=${currentWeek}&user_id=${userId}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to load recommendations: ${response.statusText}`);
      }
      
      const data = await response.json();
      setRecommendations(data.recommendations || []);
      
    } catch (err) {
      console.error('Error loading FAAB recommendations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const loadMarketIntelligence = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/faab-predictor/market-intelligence?league_id=${leagueId}&week=${currentWeek}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to load market intelligence: ${response.statusText}`);
      }
      
      const data = await response.json();
      setMarketIntelligence(data);
      
    } catch (err) {
      console.error('Error loading market intelligence:', err);
    }
  };

  const loadBiddingHistory = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/faab-predictor/bidding-history?league_id=${leagueId}&weeks_back=16&user_id=${userId}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to load bidding history: ${response.statusText}`);
      }
      
      const data = await response.json();
      setBiddingHistory(data);
      
    } catch (err) {
      console.error('Error loading bidding history:', err);
    }
  };

  const refreshRecommendations = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(
        `http://localhost:8000/api/v1/faab-predictor/refresh-recommendations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            league_id: leagueId,
            week: currentWeek
          })
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to refresh recommendations: ${response.statusText}`);
      }
      
      // Wait a moment for the background task to complete
      setTimeout(() => {
        loadRecommendations();
      }, 2000);
      
    } catch (err) {
      console.error('Error refreshing recommendations:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh recommendations');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecommendations = positionFilter === 'ALL' 
    ? recommendations 
    : recommendations.filter(rec => rec.position === positionFilter);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'recommendations':
        return (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading FAAB recommendations...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
                <button
                  onClick={loadRecommendations}
                  className="mt-2 text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            ) : filteredRecommendations.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredRecommendations.map((recommendation) => (
                  <FAABRecommendationCard
                    key={recommendation.player_id}
                    recommendation={recommendation}
                    onPlaceBid={(bid) => {
                      console.log('Placing FAAB bid:', bid);
                      // Handle bid placement
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                <p>No FAAB recommendations available for this week.</p>
                <button
                  onClick={refreshRecommendations}
                  className="mt-2 text-blue-600 hover:text-blue-800 underline"
                >
                  Refresh recommendations
                </button>
              </div>
            )}
          </div>
        );
        
      case 'market':
        return (
          <FAABMarketIntelligence
            intelligence={marketIntelligence}
            onRefresh={loadMarketIntelligence}
          />
        );
        
      case 'history':
        return (
          <FAABBiddingHistory
            history={biddingHistory}
            onRefresh={loadBiddingHistory}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAAB Predictor</h1>
          <p className="mt-1 text-sm text-gray-600">
            Strategic waiver wire bidding insights and market intelligence
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          {/* Position Filter */}
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Positions</option>
            <option value="QB">QB</option>
            <option value="RB">RB</option>
            <option value="WR">WR</option>
            <option value="TE">TE</option>
            <option value="K">K</option>
            <option value="DEF">DEF</option>
          </select>
          
          {/* Refresh Button */}
          <button
            onClick={refreshRecommendations}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Refreshing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'recommendations', label: 'Recommendations', icon: '🎯' },
            { id: 'market', label: 'Market Intelligence', icon: '📊' },
            { id: 'history', label: 'Bidding History', icon: '📈' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Active Tab Content */}
      {renderActiveTab()}

      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            <strong>Connecting to live updates...</strong> Real-time FAAB recommendations will be available once connected.
          </p>
        </div>
      )}
    </div>
  );
};
