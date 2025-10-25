/**
 * AdvancedMarkets Component
 * 
 * Provides advanced betting markets including player props, custom matchups,
 * and specialized fantasy football betting options.
 * 
 * Features:
 * - Player prop betting (passing yards, rushing yards, etc.)
 * - Custom matchup creation
 * - Player performance betting
 * - Team total betting
 * - Specialized fantasy markets
 * - Advanced analytics integration
 * 
 * @author Fantasy Football Companion App
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { PlayerPropsMarket } from './PlayerPropsMarket';
import { CustomMatchups } from './CustomMatchups';
import { TeamTotalsMarket } from './TeamTotalsMarket';
import { FantasyMarkets } from './FantasyMarkets';

interface AdvancedMarketsProps {
  leagueId: string;
  userId: string;
  currentWeek: number;
  onPlaceBet: (betData: any) => void;
  tokenBalance: number;
}

export const AdvancedMarkets: React.FC<AdvancedMarketsProps> = ({
  leagueId,
  userId,
  currentWeek,
  onPlaceBet,
  tokenBalance
}) => {
  const [activeTab, setActiveTab] = useState<'player-props' | 'custom-matchups' | 'team-totals' | 'fantasy-markets'>('player-props');
  const [isConnected, setIsConnected] = useState(false);
  const [marketData, setMarketData] = useState<any>({});

  // WebSocket connection for real-time updates
  const { isConnected: wsConnected, authenticate, subscribeToLeague } = useWebSocket({
    serverUrl: 'http://localhost:8000',
    userId,
    leagueId,
    autoConnect: true
  });

  useEffect(() => {
    if (wsConnected) {
      setIsConnected(true);
      // Subscribe to league updates for advanced markets
      subscribeToLeague(leagueId);
    } else {
      setIsConnected(false);
    }
  }, [wsConnected, leagueId, subscribeToLeague]);

  useEffect(() => {
    // Subscribe to market updates using the WebSocket hook
    const handleMarketUpdate = (data: any) => {
      console.log('Received market update:', data);
      setMarketData((prev: any) => ({ ...prev, [data.marketType]: data.data }));
    };

    // Note: Event subscription would be handled by the WebSocket service
    // This is a placeholder for the actual implementation
    return () => {
      // Cleanup would be handled by the WebSocket service
    };
  }, []);

  const tabs = [
    { id: 'player-props', label: 'Player Props', icon: '🏈', description: 'Individual player performance betting' },
    { id: 'custom-matchups', label: 'Custom Matchups', icon: '⚔️', description: 'Create custom head-to-head matchups' },
    { id: 'team-totals', label: 'Team Totals', icon: '📊', description: 'Team total points and performance betting' },
    { id: 'fantasy-markets', label: 'Fantasy Markets', icon: '🎯', description: 'Fantasy-specific betting markets' }
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Advanced Markets</h1>
              <p className="text-sm text-gray-600">League {leagueId} • Week {currentWeek}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Live' : 'Offline'}
                </span>
              </div>
              
              {/* Token Balance */}
              <div className="inline-flex items-center px-4 py-2 rounded-lg border bg-green-50 border-green-200">
                <span className="text-sm font-medium text-gray-700">Balance:</span>
                <span className="text-lg font-bold text-green-600 ml-2">
                  {tokenBalance.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 ml-1">tokens</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Descriptions */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <p className="text-sm text-gray-600">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'player-props' && (
          <PlayerPropsMarket
            leagueId={leagueId}
            userId={userId}
            currentWeek={currentWeek}
            onPlaceBet={onPlaceBet}
            tokenBalance={tokenBalance}
            marketData={marketData.playerProps}
            isConnected={isConnected}
          />
        )}
        
        {activeTab === 'custom-matchups' && (
          <CustomMatchups
            leagueId={leagueId}
            userId={userId}
            currentWeek={currentWeek}
            onPlaceBet={onPlaceBet}
            tokenBalance={tokenBalance}
            marketData={marketData.customMatchups}
            isConnected={isConnected}
          />
        )}
        
        {activeTab === 'team-totals' && (
          <TeamTotalsMarket
            leagueId={leagueId}
            userId={userId}
            currentWeek={currentWeek}
            onPlaceBet={onPlaceBet}
            tokenBalance={tokenBalance}
            marketData={marketData.teamTotals}
            isConnected={isConnected}
          />
        )}
        
        {activeTab === 'fantasy-markets' && (
          <FantasyMarkets
            leagueId={leagueId}
            userId={userId}
            currentWeek={currentWeek}
            onPlaceBet={onPlaceBet}
            tokenBalance={tokenBalance}
            marketData={marketData.fantasyMarkets}
            isConnected={isConnected}
          />
        )}
      </div>
    </div>
  );
};
