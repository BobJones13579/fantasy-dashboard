import React from 'react';

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

interface FAABRecommendationCardProps {
  recommendation: FAABRecommendation;
  onPlaceBid: (bid: any) => void;
}

export const FAABRecommendationCard: React.FC<FAABRecommendationCardProps> = ({
  recommendation,
  onPlaceBid
}) => {
  const {
    player_name,
    position,
    team,
    projected_points,
    market_value,
    recommended_bid,
    confidence_score,
    urgency_score,
    rationale,
    risk_level,
    similar_players
  } = recommendation;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgencyColor = (urgency: number) => {
    if (urgency >= 0.8) return 'text-red-600 bg-red-100';
    if (urgency >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{player_name}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm text-gray-600">{position}</span>
            <span className="text-gray-300">•</span>
            <span className="text-sm text-gray-600">{team}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-1">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(risk_level)}`}>
            {risk_level.toUpperCase()} RISK
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-600">Recommended Bid</div>
          <div className="text-2xl font-bold text-blue-600">{formatCurrency(recommended_bid)}</div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-600">Market Value</div>
          <div className="text-xl font-semibold text-gray-900">{formatCurrency(market_value)}</div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-600">Projected Points</div>
          <div className="text-xl font-semibold text-gray-900">{projected_points.toFixed(1)}</div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-600">Confidence</div>
          <div className={`text-lg font-semibold ${getConfidenceColor(confidence_score).split(' ')[0]}`}>
            {Math.round(confidence_score * 100)}%
          </div>
        </div>
      </div>

      {/* Urgency Score */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Urgency Score</span>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(urgency_score)}`}>
            {Math.round(urgency_score * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              urgency_score >= 0.8 ? 'bg-red-500' : 
              urgency_score >= 0.6 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${urgency_score * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Rationale */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Rationale</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{rationale}</p>
      </div>

      {/* Similar Players */}
      {similar_players.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Similar Players</h4>
          <div className="space-y-1">
            {similar_players.slice(0, 3).map((player, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="text-gray-600">
                  {player.player_name} ({player.position})
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900">{formatCurrency(player.bid_amount)}</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                    player.success ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                  }`}>
                    {player.success ? 'Won' : 'Lost'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={() => onPlaceBid({
            player_id: recommendation.player_id,
            player_name: player_name,
            recommended_bid: recommended_bid,
            confidence_score: confidence_score
          })}
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          Place Bid: {formatCurrency(recommended_bid)}
        </button>
      </div>
    </div>
  );
};
