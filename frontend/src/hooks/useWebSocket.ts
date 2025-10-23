/**
 * React hook for WebSocket functionality
 * Provides real-time communication with the backend
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import websocketService, { 
  OddsUpdateData, 
  LeagueUpdateData, 
  BetUpdateData, 
  ScoreUpdateData, 
  UpsetAlertData 
} from '../services/websocket';

export interface UseWebSocketOptions {
  serverUrl?: string;
  userId?: string;
  leagueId?: string;
  autoConnect?: boolean;
}

export interface UseWebSocketReturn {
  isConnected: boolean;
  socketId: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  authenticate: (userId: string, leagueId: string) => Promise<void>;
  subscribeToOdds: (matchupId: string) => void;
  unsubscribeFromOdds: (matchupId: string) => void;
  subscribeToLeague: (leagueId: string) => void;
  requestLeagueData: (leagueId: string) => void;
  // Event handlers
  onOddsUpdate: (callback: (data: OddsUpdateData) => void) => void;
  onLeagueUpdate: (callback: (data: LeagueUpdateData) => void) => void;
  onBetUpdate: (callback: (data: BetUpdateData) => void) => void;
  onScoreUpdate: (callback: (data: ScoreUpdateData) => void) => void;
  onUpsetAlert: (callback: (data: UpsetAlertData) => void) => void;
  onConnectionEstablished: (callback: (data: any) => void) => void;
  onReconnectionFailed: (callback: (data: any) => void) => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}): UseWebSocketReturn => {
  const {
    serverUrl = 'http://localhost:8000',
    userId,
    leagueId,
    autoConnect = true
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState<string | null>(null);
  const eventListenersRef = useRef<Map<string, Function[]>>(new Map());

  // Connect to WebSocket
  const connect = useCallback(async () => {
    try {
      await websocketService.connect(serverUrl);
      setIsConnected(true);
      setSocketId(websocketService.getSocketId());
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setIsConnected(false);
      setSocketId(null);
    }
  }, [serverUrl]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    websocketService.disconnect();
    setIsConnected(false);
    setSocketId(null);
  }, []);

  // Authenticate with server
  const authenticate = useCallback(async (authUserId: string, authLeagueId: string) => {
    try {
      await websocketService.authenticate(authUserId, authLeagueId);
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  }, []);

  // Subscribe to odds updates
  const subscribeToOdds = useCallback((matchupId: string) => {
    websocketService.subscribeToOdds(matchupId);
  }, []);

  // Unsubscribe from odds updates
  const unsubscribeFromOdds = useCallback((matchupId: string) => {
    websocketService.unsubscribeFromOdds(matchupId);
  }, []);

  // Subscribe to league updates
  const subscribeToLeague = useCallback((leagueId: string) => {
    websocketService.subscribeToLeague(leagueId);
  }, []);

  // Request league data
  const requestLeagueData = useCallback((leagueId: string) => {
    websocketService.requestLeagueData(leagueId);
  }, []);

  // Event handler helpers
  const onOddsUpdate = useCallback((callback: (data: OddsUpdateData) => void) => {
    websocketService.on('odds_update', callback);
  }, []);

  const onLeagueUpdate = useCallback((callback: (data: LeagueUpdateData) => void) => {
    websocketService.on('league_update', callback);
  }, []);

  const onBetUpdate = useCallback((callback: (data: BetUpdateData) => void) => {
    websocketService.on('bet_update', callback);
  }, []);

  const onScoreUpdate = useCallback((callback: (data: ScoreUpdateData) => void) => {
    websocketService.on('score_update', callback);
  }, []);

  const onUpsetAlert = useCallback((callback: (data: UpsetAlertData) => void) => {
    websocketService.on('upset_alert', callback);
  }, []);

  const onConnectionEstablished = useCallback((callback: (data: any) => void) => {
    websocketService.on('connection_established', callback);
  }, []);

  const onReconnectionFailed = useCallback((callback: (data: any) => void) => {
    websocketService.on('reconnection_failed', callback);
  }, []);

  // Auto-connect effect
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // Auto-authenticate effect
  useEffect(() => {
    if (isConnected && userId && leagueId) {
      authenticate(userId, leagueId).catch(error => {
        console.error('Auto-authentication failed:', error);
      });
    }
  }, [isConnected, userId, leagueId, authenticate]);

  // Update connection status
  useEffect(() => {
    const updateConnectionStatus = () => {
      setIsConnected(websocketService.getConnectionStatus());
      setSocketId(websocketService.getSocketId());
    };

    // Set up connection status listeners
    const connectionListener = () => {
      updateConnectionStatus();
    };

    const disconnectListener = () => {
      updateConnectionStatus();
    };

    websocketService.on('connection_established', connectionListener);
    websocketService.on('disconnect', disconnectListener);

    // Initial status update
    updateConnectionStatus();

    return () => {
      websocketService.off('connection_established', connectionListener);
      websocketService.off('disconnect', disconnectListener);
    };
  }, []);

  return {
    isConnected,
    socketId,
    connect,
    disconnect,
    authenticate,
    subscribeToOdds,
    unsubscribeFromOdds,
    subscribeToLeague,
    requestLeagueData,
    onOddsUpdate,
    onLeagueUpdate,
    onBetUpdate,
    onScoreUpdate,
    onUpsetAlert,
    onConnectionEstablished,
    onReconnectionFailed
  };
};

export default useWebSocket;
