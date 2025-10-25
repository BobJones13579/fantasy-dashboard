/**
 * BettingInterface Component
 * 
 * Main betting interface component that provides a comprehensive betting dashboard
 * with real-time odds, betting history, and token management.
 * 
 * Features:
 * - Live odds display with real-time updates
 * - Token-based betting system
 * - Betting history and analytics
 * - Risk management tools
 * - Mobile-first responsive design
 * 
 * @author Fantasy Football Companion App
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { BettingOddsBoard } from './BettingOddsBoard';
import { BettingHistory } from './BettingHistory';
import { TokenBalance } from './TokenBalance';
import { BettingAnalytics } from './BettingAnalytics';
import { RiskManagement } from './RiskManagement';

interface BettingInterfaceProps {
  leagueId: string;
  userId: string;
  currentWeek: number;
}

export const BettingInterface: React.FC<BettingInterfaceProps> = ({ 
  leagueId, 
  userId, 
  currentWeek 
}) => {
  const [activeTab, setActiveTab] = useState<'odds' | 'history' | 'analytics' | 'risk'>('odds');
  const [tokenBalance, setTokenBalance] = useState<number>(1000); // Mock initial balance
  const [bettingHistory, setBettingHistory] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

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
      // Subscribe to league updates for betting
      subscribeToLeague(leagueId);
    } else {
      setIsConnected(false);
    }
  }, [wsConnected, leagueId, subscribeToLeague]);

  useEffect(() => {
    // Subscribe to betting-related events using the WebSocket hook
    const handleBettingUpdate = (data: any) => {
      console.log('Received betting update:', data);
      
      if (data.event === 'bet_placed') {
        // Update token balance
        setTokenBalance(prev => prev - data.bet_amount);
        
        // Add to betting history
        setBettingHistory(prev => [data.bet, ...prev]);
      } else if (data.event === 'bet_resolved') {
        // Update token balance with winnings/losses
        setTokenBalance(prev => prev + (data.payout || 0));
        
        // Update betting history
        setBettingHistory(prev => 
          prev.map(bet => 
            bet.id === data.bet.id ? { ...bet, ...data.bet } : bet
          )
        );
      }
    };

    // Note: Event subscription would be handled by the WebSocket service
    // This is a placeholder for the actual implementation
    return () => {
      // Cleanup would be handled by the WebSocket service
    };
  }, []);

  const handlePlaceBet = async (betData: any) => {
    try {
      // Send bet to backend
      const response = await fetch(`http://localhost:8000/api/v1/enhanced-betting/place-bet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...betData,
          user_id: userId,
          league_id: leagueId,
          week: currentWeek
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to place bet');
      }

      const result = await response.json();
      console.log('Bet placed successfully:', result);
      
      // The WebSocket will handle updating the UI
    } catch (error) {
      console.error('Error placing bet:', error);
      alert('Failed to place bet. Please try again.');
    }
  };

  const tabs = [
    { id: 'odds', label: 'Live Odds', icon: '📊' },
    { id: 'history', label: 'Betting History', icon: '📋' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'risk', label: 'Risk Management', icon: '⚠️' }
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Fantasy Sportsbook</h1>
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
              <TokenBalance balance={tokenBalance} />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'odds' && (
          <BettingOddsBoard
            leagueId={leagueId}
            userId={userId}
            currentWeek={currentWeek}
            onPlaceBet={handlePlaceBet}
            tokenBalance={tokenBalance}
            isConnected={isConnected}
          />
        )}
        
        {activeTab === 'history' && (
          <BettingHistory
            leagueId={leagueId}
            userId={userId}
            bettingHistory={bettingHistory}
          />
        )}
        
        {activeTab === 'analytics' && (
          <BettingAnalytics
            leagueId={leagueId}
            userId={userId}
            bettingHistory={bettingHistory}
            tokenBalance={tokenBalance}
          />
        )}
        
        {activeTab === 'risk' && (
          <RiskManagement
            leagueId={leagueId}
            userId={userId}
            tokenBalance={tokenBalance}
            bettingHistory={bettingHistory}
          />
        )}
      </div>
    </div>
  );
};
