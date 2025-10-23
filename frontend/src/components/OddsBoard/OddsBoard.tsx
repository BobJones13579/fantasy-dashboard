/**
 * Real-time Odds Board Component
 * Displays live matchup odds with real-time updates
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Panel, Text, Button, FlexRow, FlexSpacer } from '@epam/uui';
import { useWebSocket, OddsUpdateData } from '../../hooks/useWebSocket';
import { OddsDisplay } from './OddsDisplay';

export interface Matchup {
  id: string;
  team1: string;
  team2: string;
  team1Score?: number;
  team2Score?: number;
  team1Odds?: number;
  team2Odds?: number;
  spread?: number;
  total?: number;
  status: 'upcoming' | 'in_progress' | 'completed';
  lastUpdated?: string;
}

export interface OddsBoardProps {
  leagueId: string;
  userId: string;
  matchups: Matchup[];
  onBetPlaced?: (bet: any) => void;
}

export const OddsBoard: React.FC<OddsBoardProps> = ({ 
  leagueId, 
  userId, 
  matchups, 
  onBetPlaced 
}) => {
  const [liveMatchups, setLiveMatchups] = useState<Matchup[]>(matchups);
  const [selectedMatchup, setSelectedMatchup] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // WebSocket connection
  const {
    isConnected,
    connect,
    disconnect,
    subscribeToOdds,
    unsubscribeFromOdds,
    onOddsUpdate,
    onUpsetAlert
  } = useWebSocket({
    serverUrl: 'http://localhost:8000',
    userId,
    leagueId,
    autoConnect: true
  });

  // Handle odds updates
  const handleOddsUpdate = useCallback((data: OddsUpdateData) => {
    console.log('Odds update received:', data);
    
    setLiveMatchups(prevMatchups => 
      prevMatchups.map(matchup => 
        matchup.id === data.matchup_id
          ? {
              ...matchup,
              team1Odds: data.odds.moneyline?.team1_odds,
              team2Odds: data.odds.moneyline?.team2_odds,
              spread: data.odds.spread?.spread,
              total: data.odds.total?.total,
              lastUpdated: data.timestamp
            }
          : matchup
      )
    );
    
    setLastUpdate(data.timestamp);
  }, []);

  // Handle upset alerts
  const handleUpsetAlert = useCallback((data: any) => {
    console.log('Upset alert received:', data);
    // You could show a toast notification here
  }, []);

  // Set up event listeners
  useEffect(() => {
    onOddsUpdate(handleOddsUpdate);
    onUpsetAlert(handleUpsetAlert);
  }, [onOddsUpdate, onUpsetAlert, handleOddsUpdate, handleUpsetAlert]);

  // Subscribe to odds updates for all matchups
  useEffect(() => {
    if (isConnected) {
      matchups.forEach(matchup => {
        subscribeToOdds(matchup.id);
      });
    }

    // Cleanup subscriptions on unmount
    return () => {
      if (isConnected) {
        matchups.forEach(matchup => {
          unsubscribeFromOdds(matchup.id);
        });
      }
    };
  }, [isConnected, matchups, subscribeToOdds, unsubscribeFromOdds]);

  // Handle bet placement
  const handleBetPlaced = useCallback((bet: any) => {
    if (onBetPlaced) {
      onBetPlaced(bet);
    }
  }, [onBetPlaced]);

  // Handle matchup selection
  const handleMatchupSelect = useCallback((matchupId: string) => {
    setSelectedMatchup(selectedMatchup === matchupId ? null : matchupId);
  }, [selectedMatchup]);

  // Format last update time
  const formatLastUpdate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString();
    } catch {
      return 'Unknown';
    }
  };

  return (
    <Panel shadow="medium" margin="24">
      {/* Header */}
      <FlexRow spacing="12" margin="12">
        <Text size="48" font="semibold">Live Matchup Odds</Text>
        <FlexSpacer />
        <div className="flex items-center space-x-2">
          <div 
            className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <Text size="24" color={isConnected ? 'success' : 'error'}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Text>
        </div>
      </FlexRow>

      {/* Connection Status */}
      {!isConnected && (
        <Panel shadow="small" margin="12" padding="12">
          <Text size="24" color="warning">
            WebSocket disconnected. Attempting to reconnect...
          </Text>
          <Button 
            caption="Reconnect" 
            onClick={connect}
            margin="12 0 0 0"
          />
        </Panel>
      )}

      {/* Last Update Info */}
      {lastUpdate && (
        <Panel shadow="small" margin="12" padding="8">
          <Text size="18" color="secondary">
            Last updated: {formatLastUpdate(lastUpdate)}
          </Text>
        </Panel>
      )}

      {/* Matchups */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {liveMatchups.map((matchup) => (
          <div key={matchup.id}>
            <OddsDisplay
              matchup={matchup}
              isSelected={selectedMatchup === matchup.id}
              onSelect={() => handleMatchupSelect(matchup.id)}
              onBetPlaced={handleBetPlaced}
              isConnected={isConnected}
            />
          </div>
        ))}
      </div>

      {/* No Matchups */}
      {liveMatchups.length === 0 && (
        <Panel shadow="small" margin="12" padding="24">
          <Text size="24" color="secondary">
            No matchups available at this time.
          </Text>
        </Panel>
      )}

      {/* Connection Controls */}
      <FlexRow spacing="12" margin="12">
        <Button 
          caption={isConnected ? "Disconnect" : "Connect"} 
          onClick={isConnected ? disconnect : connect}
          color={isConnected ? "secondary" : "primary"}
        />
        <Button 
          caption="Refresh Data" 
          onClick={() => window.location.reload()}
          color="secondary"
        />
      </FlexRow>
    </Panel>
  );
};

export default OddsBoard;
