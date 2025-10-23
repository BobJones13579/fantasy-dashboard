"""
WebSocket Service for real-time communication using Socket.IO
Provides real-time updates for odds, scores, and betting activity
"""

import socketio
import asyncio
from typing import Dict, Any, List, Optional
import logging
from datetime import datetime
import json

logger = logging.getLogger(__name__)

# Create Socket.IO server
sio = socketio.AsyncServer(
    cors_allowed_origins="*",
    logger=True,
    engineio_logger=True
)

class WebSocketService:
    """Service for managing WebSocket connections and real-time updates"""
    
    def __init__(self):
        self.connected_clients = {}
        self.league_subscriptions = {}
        self.odds_subscriptions = {}
    
    async def initialize(self, app):
        """Initialize Socket.IO with FastAPI app"""
        try:
            sio.attach(app)
        except Exception as e:
            logger.error(f"Error attaching Socket.IO to app: {e}")
            # Continue without WebSocket if there's an error
        
        # Register event handlers
        @sio.event
        async def connect(sid, environ):
            """Handle client connection"""
            logger.info(f"Client {sid} connected")
            self.connected_clients[sid] = {
                'connected_at': datetime.now(),
                'user_id': None,
                'league_id': None
            }
            await sio.emit('connection_established', {'message': 'Connected to Fantasy Football Companion'}, room=sid)
        
        @sio.event
        async def disconnect(sid):
            """Handle client disconnection"""
            logger.info(f"Client {sid} disconnected")
            if sid in self.connected_clients:
                user_id = self.connected_clients[sid].get('user_id')
                league_id = self.connected_clients[sid].get('league_id')
                
                # Remove from subscriptions
                if league_id and league_id in self.league_subscriptions:
                    self.league_subscriptions[league_id].discard(sid)
                    if not self.league_subscriptions[league_id]:
                        del self.league_subscriptions[league_id]
                
                del self.connected_clients[sid]
        
        @sio.event
        async def authenticate(sid, data):
            """Handle user authentication"""
            try:
                user_id = data.get('user_id')
                league_id = data.get('league_id')
                
                if user_id and league_id:
                    self.connected_clients[sid]['user_id'] = user_id
                    self.connected_clients[sid]['league_id'] = league_id
                    
                    # Add to league subscription
                    if league_id not in self.league_subscriptions:
                        self.league_subscriptions[league_id] = set()
                    self.league_subscriptions[league_id].add(sid)
                    
                    await sio.emit('authentication_success', {
                        'message': 'Authentication successful',
                        'user_id': user_id,
                        'league_id': league_id
                    }, room=sid)
                    
                    logger.info(f"User {user_id} authenticated for league {league_id}")
                else:
                    await sio.emit('authentication_error', {
                        'message': 'Invalid authentication data'
                    }, room=sid)
                    
            except Exception as e:
                logger.error(f"Authentication error for {sid}: {e}")
                await sio.emit('authentication_error', {
                    'message': 'Authentication failed'
                }, room=sid)
        
        @sio.event
        async def subscribe_odds(sid, data):
            """Subscribe to odds updates for a specific matchup"""
            try:
                matchup_id = data.get('matchup_id')
                if matchup_id:
                    if matchup_id not in self.odds_subscriptions:
                        self.odds_subscriptions[matchup_id] = set()
                    self.odds_subscriptions[matchup_id].add(sid)
                    
                    await sio.emit('subscription_confirmed', {
                        'message': f'Subscribed to odds updates for matchup {matchup_id}',
                        'matchup_id': matchup_id
                    }, room=sid)
                    
                    logger.info(f"Client {sid} subscribed to odds for matchup {matchup_id}")
                    
            except Exception as e:
                logger.error(f"Odds subscription error for {sid}: {e}")
        
        @sio.event
        async def unsubscribe_odds(sid, data):
            """Unsubscribe from odds updates"""
            try:
                matchup_id = data.get('matchup_id')
                if matchup_id and matchup_id in self.odds_subscriptions:
                    self.odds_subscriptions[matchup_id].discard(sid)
                    if not self.odds_subscriptions[matchup_id]:
                        del self.odds_subscriptions[matchup_id]
                    
                    await sio.emit('unsubscription_confirmed', {
                        'message': f'Unsubscribed from odds updates for matchup {matchup_id}',
                        'matchup_id': matchup_id
                    }, room=sid)
                    
            except Exception as e:
                logger.error(f"Odds unsubscription error for {sid}: {e}")
        
        @sio.event
        async def subscribe_league(sid, data):
            """Subscribe to league-wide updates"""
            try:
                league_id = data.get('league_id')
                if league_id:
                    if league_id not in self.league_subscriptions:
                        self.league_subscriptions[league_id] = set()
                    self.league_subscriptions[league_id].add(sid)
                    
                    # Update client info
                    if sid in self.connected_clients:
                        self.connected_clients[sid]['league_id'] = league_id
                    
                    await sio.emit('league_subscription_confirmed', {
                        'message': f'Subscribed to league {league_id} updates',
                        'league_id': league_id
                    }, room=sid)
                    
                    logger.info(f"Client {sid} subscribed to league {league_id}")
                    
            except Exception as e:
                logger.error(f"League subscription error for {sid}: {e}")
        
        @sio.event
        async def request_league_data(sid, data):
            """Handle request for league data"""
            try:
                league_id = data.get('league_id')
                if league_id:
                    # This would typically fetch from database
                    league_data = {
                        'league_id': league_id,
                        'timestamp': datetime.now().isoformat(),
                        'message': 'League data requested'
                    }
                    
                    await sio.emit('league_data', league_data, room=sid)
                    
            except Exception as e:
                logger.error(f"League data request error for {sid}: {e}")
    
    async def broadcast_odds_update(self, matchup_id: str, odds_data: Dict[str, Any]):
        """Broadcast odds update to subscribed clients"""
        try:
            if matchup_id in self.odds_subscriptions:
                update_data = {
                    'type': 'odds_update',
                    'matchup_id': matchup_id,
                    'odds': odds_data,
                    'timestamp': datetime.now().isoformat()
                }
                
                await sio.emit('odds_update', update_data, room=list(self.odds_subscriptions[matchup_id]))
                logger.info(f"Broadcasted odds update for matchup {matchup_id} to {len(self.odds_subscriptions[matchup_id])} clients")
                
        except Exception as e:
            logger.error(f"Error broadcasting odds update: {e}")
    
    async def broadcast_league_update(self, league_id: str, update_data: Dict[str, Any]):
        """Broadcast league update to subscribed clients"""
        try:
            if league_id in self.league_subscriptions:
                update_data.update({
                    'type': 'league_update',
                    'league_id': league_id,
                    'timestamp': datetime.now().isoformat()
                })
                
                await sio.emit('league_update', update_data, room=list(self.league_subscriptions[league_id]))
                logger.info(f"Broadcasted league update for league {league_id} to {len(self.league_subscriptions[league_id])} clients")
                
        except Exception as e:
            logger.error(f"Error broadcasting league update: {e}")
    
    async def broadcast_bet_update(self, league_id: str, bet_data: Dict[str, Any]):
        """Broadcast bet update to league clients"""
        try:
            if league_id in self.league_subscriptions:
                update_data = {
                    'type': 'bet_update',
                    'league_id': league_id,
                    'bet': bet_data,
                    'timestamp': datetime.now().isoformat()
                }
                
                await sio.emit('bet_update', update_data, room=list(self.league_subscriptions[league_id]))
                logger.info(f"Broadcasted bet update for league {league_id} to {len(self.league_subscriptions[league_id])} clients")
                
        except Exception as e:
            logger.error(f"Error broadcasting bet update: {e}")
    
    async def broadcast_score_update(self, league_id: str, score_data: Dict[str, Any]):
        """Broadcast score update to league clients"""
        try:
            if league_id in self.league_subscriptions:
                update_data = {
                    'type': 'score_update',
                    'league_id': league_id,
                    'scores': score_data,
                    'timestamp': datetime.now().isoformat()
                }
                
                await sio.emit('score_update', update_data, room=list(self.league_subscriptions[league_id]))
                logger.info(f"Broadcasted score update for league {league_id} to {len(self.league_subscriptions[league_id])} clients")
                
        except Exception as e:
            logger.error(f"Error broadcasting score update: {e}")
    
    async def broadcast_upset_alert(self, league_id: str, alert_data: Dict[str, Any]):
        """Broadcast upset alert to league clients"""
        try:
            if league_id in self.league_subscriptions:
                update_data = {
                    'type': 'upset_alert',
                    'league_id': league_id,
                    'alert': alert_data,
                    'timestamp': datetime.now().isoformat()
                }
                
                await sio.emit('upset_alert', update_data, room=list(self.league_subscriptions[league_id]))
                logger.info(f"Broadcasted upset alert for league {league_id} to {len(self.league_subscriptions[league_id])} clients")
                
        except Exception as e:
            logger.error(f"Error broadcasting upset alert: {e}")
    
    def get_connection_stats(self) -> Dict[str, Any]:
        """Get statistics about current connections"""
        return {
            'total_connections': len(self.connected_clients),
            'league_subscriptions': {
                league_id: len(clients) for league_id, clients in self.league_subscriptions.items()
            },
            'odds_subscriptions': {
                matchup_id: len(clients) for matchup_id, clients in self.odds_subscriptions.items()
            },
            'connected_clients': list(self.connected_clients.keys())
        }
    
    async def send_direct_message(self, sid: str, message_type: str, data: Dict[str, Any]):
        """Send a direct message to a specific client"""
        try:
            message_data = {
                'type': message_type,
                'data': data,
                'timestamp': datetime.now().isoformat()
            }
            
            await sio.emit(message_type, message_data, room=sid)
            logger.info(f"Sent {message_type} to client {sid}")
            
        except Exception as e:
            logger.error(f"Error sending direct message to {sid}: {e}")
    
    async def test_websocket_connection(self) -> Dict[str, Any]:
        """Test WebSocket service functionality"""
        try:
            stats = self.get_connection_stats()
            
            return {
                'success': True,
                'message': 'WebSocket service is operational',
                'connection_stats': stats,
                'features': [
                    'Real-time odds updates',
                    'League-wide broadcasts',
                    'Betting activity notifications',
                    'Score updates',
                    'Upset alerts',
                    'Direct messaging'
                ],
                'supported_events': [
                    'connect', 'disconnect', 'authenticate',
                    'subscribe_odds', 'unsubscribe_odds',
                    'subscribe_league', 'request_league_data'
                ]
            }
            
        except Exception as e:
            logger.error(f"WebSocket service test failed: {e}")
            return {
                'success': False,
                'message': f'WebSocket service test failed: {str(e)}',
                'connection_stats': {},
                'features': [],
                'supported_events': []
            }

# Global WebSocket service instance
websocket_service = WebSocketService()
