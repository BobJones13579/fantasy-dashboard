/**
 * WebSocket Service for real-time communication with the backend
 * Provides real-time updates for odds, scores, and betting activity
 */

import { io, Socket } from 'socket.io-client';

export interface WebSocketMessage {
  type: string;
  data?: any;
  timestamp?: string;
}

export interface OddsUpdateData {
  matchup_id: string;
  odds: any;
  timestamp: string;
}

export interface LeagueUpdateData {
  league_id: string;
  data: any;
  timestamp: string;
}

export interface BetUpdateData {
  league_id: string;
  bet: any;
  timestamp: string;
}

export interface ScoreUpdateData {
  league_id: string;
  scores: any;
  timestamp: string;
}

export interface UpsetAlertData {
  league_id: string;
  alert: any;
  timestamp: string;
}

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectInterval: number = 3000;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.setupEventListeners();
  }

  /**
   * Connect to WebSocket server
   */
  connect(serverUrl: string = 'http://localhost:8000'): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(serverUrl, {
          transports: ['websocket', 'polling'],
          timeout: 10000,
          forceNew: true
        });

        this.socket.on('connect', () => {
          console.log('WebSocket connected:', this.socket?.id);
          this.isConnected = true;
          this.reconnectAttempts = 0;
          resolve();
        });

        this.socket.on('disconnect', (reason) => {
          console.log('WebSocket disconnected:', reason);
          this.isConnected = false;
          this.handleReconnect();
        });

        this.socket.on('connect_error', (error) => {
          console.error('WebSocket connection error:', error);
          reject(error);
        });

        // Setup message handlers
        this.setupMessageHandlers();

      } catch (error) {
        console.error('Error connecting to WebSocket:', error);
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Authenticate with the server
   */
  authenticate(userId: string, leagueId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      this.socket.emit('authenticate', { user_id: userId, league_id: leagueId });

      this.socket.on('authentication_success', () => {
        console.log('Authentication successful');
        resolve();
      });

      this.socket.on('authentication_error', (error: any) => {
        console.error('Authentication failed:', error);
        reject(new Error(error.message || 'Authentication failed'));
      });
    });
  }

  /**
   * Subscribe to odds updates for a specific matchup
   */
  subscribeToOdds(matchupId: string): void {
    if (!this.socket || !this.isConnected) {
      console.warn('WebSocket not connected, cannot subscribe to odds');
      return;
    }

    this.socket.emit('subscribe_odds', { matchup_id: matchupId });
    console.log(`Subscribed to odds updates for matchup ${matchupId}`);
  }

  /**
   * Unsubscribe from odds updates
   */
  unsubscribeFromOdds(matchupId: string): void {
    if (!this.socket || !this.isConnected) {
      console.warn('WebSocket not connected, cannot unsubscribe from odds');
      return;
    }

    this.socket.emit('unsubscribe_odds', { matchup_id: matchupId });
    console.log(`Unsubscribed from odds updates for matchup ${matchupId}`);
  }

  /**
   * Subscribe to league-wide updates
   */
  subscribeToLeague(leagueId: string): void {
    if (!this.socket || !this.isConnected) {
      console.warn('WebSocket not connected, cannot subscribe to league');
      return;
    }

    this.socket.emit('subscribe_league', { league_id: leagueId });
    console.log(`Subscribed to league updates for league ${leagueId}`);
  }

  /**
   * Request league data
   */
  requestLeagueData(leagueId: string): void {
    if (!this.socket || !this.isConnected) {
      console.warn('WebSocket not connected, cannot request league data');
      return;
    }

    this.socket.emit('request_league_data', { league_id: leagueId });
  }

  /**
   * Add event listener
   */
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  /**
   * Remove event listener
   */
  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Get socket ID
   */
  getSocketId(): string | null {
    return this.socket?.id || null;
  }

  private setupEventListeners(): void {
    // Setup reconnection handling
    this.on('disconnect', () => {
      this.handleReconnect();
    });
  }

  private setupMessageHandlers(): void {
    if (!this.socket) return;

    // Connection established
    this.socket.on('connection_established', (data: any) => {
      console.log('Connection established:', data);
      this.emitEvent('connection_established', data);
    });

    // Odds updates
    this.socket.on('odds_update', (data: OddsUpdateData) => {
      console.log('Odds update received:', data);
      this.emitEvent('odds_update', data);
    });

    // League updates
    this.socket.on('league_update', (data: LeagueUpdateData) => {
      console.log('League update received:', data);
      this.emitEvent('league_update', data);
    });

    // Bet updates
    this.socket.on('bet_update', (data: BetUpdateData) => {
      console.log('Bet update received:', data);
      this.emitEvent('bet_update', data);
    });

    // Score updates
    this.socket.on('score_update', (data: ScoreUpdateData) => {
      console.log('Score update received:', data);
      this.emitEvent('score_update', data);
    });

    // Upset alerts
    this.socket.on('upset_alert', (data: UpsetAlertData) => {
      console.log('Upset alert received:', data);
      this.emitEvent('upset_alert', data);
    });

    // Subscription confirmations
    this.socket.on('subscription_confirmed', (data: any) => {
      console.log('Subscription confirmed:', data);
      this.emitEvent('subscription_confirmed', data);
    });

    this.socket.on('unsubscription_confirmed', (data: any) => {
      console.log('Unsubscription confirmed:', data);
      this.emitEvent('unsubscription_confirmed', data);
    });

    this.socket.on('league_subscription_confirmed', (data: any) => {
      console.log('League subscription confirmed:', data);
      this.emitEvent('league_subscription_confirmed', data);
    });

    // League data
    this.socket.on('league_data', (data: any) => {
      console.log('League data received:', data);
      this.emitEvent('league_data', data);
    });
  }

  private emitEvent(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        if (this.socket) {
          this.socket.connect();
        }
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
      this.emitEvent('reconnection_failed', { attempts: this.reconnectAttempts });
    }
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();
export default websocketService;
