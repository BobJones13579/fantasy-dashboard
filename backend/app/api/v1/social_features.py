"""
Social Features API Endpoints

Handles social features including leaderboards, competitions,
achievements, community features, and member profiles.

@author Fantasy Football Companion App
@version 1.0.0
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Dict, Any, List, Optional
import logging
from datetime import datetime, timedelta
from app.services.cache_service import cache_service
from app.services.websocket_service import websocket_service

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/leaderboards", response_model=Dict[str, Any])
async def get_leaderboards(
    league_id: str,
    week: Optional[int] = Query(None, description="Specific week for leaderboards"),
    period: Optional[str] = Query("weekly", description="Period: weekly or season")
):
    """
    Get leaderboards for a league.
    """
    try:
        cache_key = f"leaderboards:{league_id}:{week}:{period}"
        cached_data = await cache_service.get(cache_key)
        
        if cached_data:
            logger.info(f"Serving leaderboards from cache for key: {cache_key}")
            return cached_data
        
        # Mock leaderboard data - in production, this would come from database
        mock_leaderboards = {
            "league_id": league_id,
            "week": week or 10,
            "period": period,
            "weekly": [
                {
                    "rank": 1,
                    "user_id": "user-1",
                    "username": "FantasyKing",
                    "tokens": 1250,
                    "change": "+150",
                    "weekly_wins": 8,
                    "weekly_losses": 2,
                    "win_rate": 80,
                    "streak": 5
                },
                {
                    "rank": 2,
                    "user_id": "user-2",
                    "username": "BetMaster",
                    "tokens": 1180,
                    "change": "+120",
                    "weekly_wins": 7,
                    "weekly_losses": 3,
                    "win_rate": 70,
                    "streak": 3
                },
                {
                    "rank": 3,
                    "user_id": "user-3",
                    "username": "OddsHunter",
                    "tokens": 1150,
                    "change": "+100",
                    "weekly_wins": 6,
                    "weekly_losses": 4,
                    "win_rate": 60,
                    "streak": 2
                }
            ],
            "season": [
                {
                    "rank": 1,
                    "user_id": "user-1",
                    "username": "FantasyKing",
                    "tokens": 8500,
                    "change": "+1200",
                    "season_wins": 68,
                    "season_losses": 32,
                    "win_rate": 68,
                    "streak": 5
                },
                {
                    "rank": 2,
                    "user_id": "user-2",
                    "username": "BetMaster",
                    "tokens": 8200,
                    "change": "+1100",
                    "season_wins": 65,
                    "season_losses": 35,
                    "win_rate": 65,
                    "streak": 3
                },
                {
                    "rank": 3,
                    "user_id": "user-3",
                    "username": "OddsHunter",
                    "tokens": 7950,
                    "change": "+950",
                    "season_wins": 62,
                    "season_losses": 38,
                    "win_rate": 62,
                    "streak": 2
                }
            ],
            "generated_at": datetime.now().isoformat()
        }
        
        # Cache the results
        await cache_service.set(cache_key, mock_leaderboards, cache_type="statistics")
        
        return mock_leaderboards
        
    except Exception as e:
        logger.error(f"Error fetching leaderboards: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching leaderboards: {str(e)}"
        )

@router.get("/competitions", response_model=List[Dict[str, Any]])
async def get_competitions(
    league_id: str,
    status: Optional[str] = Query(None, description="Filter by competition status"),
    competition_type: Optional[str] = Query(None, description="Filter by competition type")
):
    """
    Get competitions for a league.
    """
    try:
        cache_key = f"competitions:{league_id}:{status}:{competition_type}"
        cached_data = await cache_service.get(cache_key)
        
        if cached_data:
            logger.info(f"Serving competitions from cache for key: {cache_key}")
            return cached_data
        
        # Mock competitions data
        mock_competitions = [
            {
                "id": "comp-1",
                "name": "Weekly High Roller",
                "type": "weekly",
                "description": "Compete for the highest token count this week",
                "prize": 500,
                "participants": 12,
                "max_participants": 12,
                "status": "active",
                "start_date": datetime.now().isoformat(),
                "end_date": (datetime.now() + timedelta(days=7)).isoformat(),
                "rules": [
                    "Must place at least 5 bets during the week",
                    "Highest token balance at end of week wins",
                    "Ties broken by win percentage"
                ],
                "leader": {
                    "username": "FantasyKing",
                    "tokens": 1250
                }
            },
            {
                "id": "comp-2",
                "name": "Season Champion",
                "type": "season",
                "description": "Season-long competition for the ultimate champion",
                "prize": 2000,
                "participants": 12,
                "max_participants": 12,
                "status": "active",
                "start_date": "2024-01-01T00:00:00Z",
                "end_date": "2024-02-11T23:59:59Z",
                "rules": [
                    "Accumulate tokens throughout the entire season",
                    "Highest total token count at season end wins",
                    "Participation in at least 80% of weekly competitions required"
                ],
                "leader": {
                    "username": "BetMaster",
                    "tokens": 8200
                }
            },
            {
                "id": "comp-3",
                "name": "Risk Taker Challenge",
                "type": "special",
                "description": "Special competition for high-risk, high-reward bets",
                "prize": 750,
                "participants": 8,
                "max_participants": 10,
                "status": "upcoming",
                "start_date": (datetime.now() + timedelta(days=1)).isoformat(),
                "end_date": (datetime.now() + timedelta(days=8)).isoformat(),
                "rules": [
                    "Only bets with odds +200 or higher count",
                    "Minimum bet amount of 100 tokens",
                    "Highest return percentage wins"
                ],
                "leader": None
            }
        ]
        
        # Filter competitions if needed
        if status:
            mock_competitions = [comp for comp in mock_competitions if comp["status"] == status]
        if competition_type:
            mock_competitions = [comp for comp in mock_competitions if comp["type"] == competition_type]
        
        # Cache the results
        await cache_service.set(cache_key, mock_competitions, cache_type="api_responses")
        
        return mock_competitions
        
    except Exception as e:
        logger.error(f"Error fetching competitions: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching competitions: {str(e)}"
        )

@router.get("/achievements", response_model=List[Dict[str, Any]])
async def get_achievements(
    league_id: str,
    user_id: Optional[str] = Query(None, description="Filter by user ID"),
    category: Optional[str] = Query(None, description="Filter by achievement category")
):
    """
    Get achievements for a league or specific user.
    """
    try:
        cache_key = f"achievements:{league_id}:{user_id}:{category}"
        cached_data = await cache_service.get(cache_key)
        
        if cached_data:
            logger.info(f"Serving achievements from cache for key: {cache_key}")
            return cached_data
        
        # Mock achievements data
        mock_achievements = [
            {
                "id": "ach-1",
                "name": "First Bet",
                "description": "Place your first bet",
                "icon": "🎯",
                "category": "betting",
                "rarity": "common",
                "unlocked": True,
                "unlocked_at": "2024-01-01T10:00:00Z",
                "progress": None,
                "target": None,
                "points": 10,
                "reward": {
                    "tokens": 50,
                    "badge": "First Bet",
                    "title": "Rookie"
                }
            },
            {
                "id": "ach-2",
                "name": "Big Winner",
                "description": "Win a bet with 500+ tokens",
                "icon": "💰",
                "category": "betting",
                "rarity": "rare",
                "unlocked": True,
                "unlocked_at": "2024-01-05T15:30:00Z",
                "progress": None,
                "target": None,
                "points": 25,
                "reward": {
                    "tokens": 100,
                    "badge": "Big Winner",
                    "title": "High Roller"
                }
            },
            {
                "id": "ach-3",
                "name": "Risk Taker",
                "description": "Place 10 risky bets",
                "icon": "🎲",
                "category": "performance",
                "rarity": "epic",
                "unlocked": False,
                "unlocked_at": None,
                "progress": 7,
                "target": 10,
                "points": 50,
                "reward": {
                    "tokens": 200,
                    "badge": "Risk Taker",
                    "title": "Gambler"
                }
            },
            {
                "id": "ach-4",
                "name": "Community Helper",
                "description": "Help 5 new members",
                "icon": "🤝",
                "category": "social",
                "rarity": "rare",
                "unlocked": False,
                "unlocked_at": None,
                "progress": 3,
                "target": 5,
                "points": 30,
                "reward": {
                    "tokens": 150,
                    "badge": "Community Helper",
                    "title": "Mentor"
                }
            }
        ]
        
        # Filter achievements if needed
        if category:
            mock_achievements = [ach for ach in mock_achievements if ach["category"] == category]
        
        # Cache the results
        await cache_service.set(cache_key, mock_achievements, cache_type="api_responses")
        
        return mock_achievements
        
    except Exception as e:
        logger.error(f"Error fetching achievements: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching achievements: {str(e)}"
        )

@router.get("/community", response_model=Dict[str, Any])
async def get_community_data(
    league_id: str,
    week: Optional[int] = Query(None, description="Specific week for community data")
):
    """
    Get community data including popular picks and recent activity.
    """
    try:
        cache_key = f"community:{league_id}:{week}"
        cached_data = await cache_service.get(cache_key)
        
        if cached_data:
            logger.info(f"Serving community data from cache for key: {cache_key}")
            return cached_data
        
        # Mock community data
        mock_community_data = {
            "league_id": league_id,
            "week": week or 10,
            "popular_picks": [
                {
                    "player": "Josh Allen",
                    "team": "BUF",
                    "bet_type": "Fantasy Points Over",
                    "confidence": 85,
                    "bet_count": 23,
                    "odds": -110,
                    "trend": "up"
                },
                {
                    "player": "Christian McCaffrey",
                    "team": "SF",
                    "bet_type": "Rushing Yards Over",
                    "confidence": 78,
                    "bet_count": 18,
                    "odds": -105,
                    "trend": "stable"
                },
                {
                    "player": "Tyreek Hill",
                    "team": "MIA",
                    "bet_type": "Receiving Yards Over",
                    "confidence": 72,
                    "bet_count": 15,
                    "odds": -115,
                    "trend": "down"
                }
            ],
            "recent_activity": [
                {
                    "user": "FantasyKing",
                    "action": "won a bet",
                    "details": "Josh Allen Over 24.5 Fantasy Points",
                    "time": "2 minutes ago",
                    "type": "bet"
                },
                {
                    "user": "BetMaster",
                    "action": "placed a bet",
                    "details": "McCaffrey Over 95.5 Rushing Yards",
                    "time": "5 minutes ago",
                    "type": "bet"
                },
                {
                    "user": "OddsHunter",
                    "action": "achieved",
                    "details": "Risk Taker badge",
                    "time": "10 minutes ago",
                    "type": "achievement"
                },
                {
                    "user": "League Admin",
                    "action": "announced",
                    "details": "Weekly Competition Starting Soon",
                    "time": "1 hour ago",
                    "type": "announcement"
                }
            ],
            "generated_at": datetime.now().isoformat()
        }
        
        # Cache the results
        await cache_service.set(cache_key, mock_community_data, cache_type="api_responses")
        
        return mock_community_data
        
    except Exception as e:
        logger.error(f"Error fetching community data: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching community data: {str(e)}"
        )

@router.get("/member-profiles", response_model=List[Dict[str, Any]])
async def get_member_profiles(
    league_id: str,
    sort_by: Optional[str] = Query("rank", description="Sort by: rank, tokens, win_rate, name")
):
    """
    Get member profiles for a league.
    """
    try:
        cache_key = f"member_profiles:{league_id}:{sort_by}"
        cached_data = await cache_service.get(cache_key)
        
        if cached_data:
            logger.info(f"Serving member profiles from cache for key: {cache_key}")
            return cached_data
        
        # Mock member profiles data
        mock_profiles = [
            {
                "id": "user-1",
                "username": "FantasyKing",
                "title": "League Champion",
                "badges": ["🏆", "🔥", "⭐"],
                "stats": {
                    "total_bets": 156,
                    "win_rate": 68,
                    "total_tokens": 1250,
                    "weekly_change": 150,
                    "season_change": 1200,
                    "streak": 5,
                    "achievements": 12,
                    "rank": 1
                },
                "recent_activity": [
                    "Won Josh Allen Over bet",
                    "Achieved Big Winner badge",
                    "Joined Weekly Competition"
                ],
                "favorite_bets": ["Player Props", "Fantasy Points", "Team Totals"],
                "join_date": "2023-08-01",
                "last_active": "2 minutes ago"
            },
            {
                "id": "user-2",
                "username": "BetMaster",
                "title": "Risk Taker",
                "badges": ["🎯", "💎"],
                "stats": {
                    "total_bets": 142,
                    "win_rate": 62,
                    "total_tokens": 1180,
                    "weekly_change": 120,
                    "season_change": 1100,
                    "streak": 3,
                    "achievements": 9,
                    "rank": 2
                },
                "recent_activity": [
                    "Placed McCaffrey Over bet",
                    "Won Custom Matchup",
                    "Shared betting strategy"
                ],
                "favorite_bets": ["Custom Matchups", "Player Props", "Advanced Markets"],
                "join_date": "2023-08-15",
                "last_active": "5 minutes ago"
            }
        ]
        
        # Sort profiles if needed
        if sort_by == "tokens":
            mock_profiles.sort(key=lambda x: x["stats"]["total_tokens"], reverse=True)
        elif sort_by == "win_rate":
            mock_profiles.sort(key=lambda x: x["stats"]["win_rate"], reverse=True)
        elif sort_by == "name":
            mock_profiles.sort(key=lambda x: x["username"])
        # Default is rank (already sorted)
        
        # Cache the results
        await cache_service.set(cache_key, mock_profiles, cache_type="api_responses")
        
        return mock_profiles
        
    except Exception as e:
        logger.error(f"Error fetching member profiles: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching member profiles: {str(e)}"
        )

@router.post("/join-competition", response_model=Dict[str, Any])
async def join_competition(
    competition_id: str,
    user_id: str = Query(..., description="User ID joining the competition"),
    league_id: str = Query(..., description="League ID")
):
    """
    Join a competition.
    """
    try:
        # In a real implementation, this would:
        # 1. Validate competition exists and is joinable
        # 2. Check if user is already in the competition
        # 3. Add user to competition participants
        # 4. Update competition statistics
        
        # Mock response
        response = {
            "success": True,
            "message": f"Successfully joined competition {competition_id}",
            "competition_id": competition_id,
            "user_id": user_id,
            "league_id": league_id,
            "joined_at": datetime.now().isoformat()
        }
        
        # Broadcast competition join to league
        await websocket_service.broadcast_league_update(
            league_id,
            {
                "event": "competition_joined",
                "competition_id": competition_id,
                "user_id": user_id,
                "timestamp": datetime.now().isoformat()
            }
        )
        
        # Invalidate relevant cache entries
        await cache_service.invalidate_league_cache(league_id)
        
        logger.info(f"User {user_id} joined competition {competition_id} in league {league_id}")
        
        return response
        
    except Exception as e:
        logger.error(f"Error joining competition: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error joining competition: {str(e)}"
        )

@router.get("/test-service", response_model=Dict[str, Any])
async def test_social_features_service():
    """
    Test the social features service functionality.
    """
    try:
        return {
            "success": True,
            "message": "Social Features service is operational",
            "features": [
                "Leaderboards with weekly and season rankings",
                "Competitions with prizes and participation tracking",
                "Achievement system with badges and rewards",
                "Community features with popular picks and activity",
                "Member profiles with statistics and social interaction",
                "Real-time updates via WebSocket integration"
            ],
            "supported_endpoints": [
                "leaderboards",
                "competitions",
                "achievements",
                "community",
                "member-profiles",
                "join-competition"
            ],
            "test_timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error testing social features service: {e}")
        return {
            "success": False,
            "message": f"Social Features service test failed: {str(e)}",
            "features": [],
            "supported_endpoints": [],
            "test_timestamp": datetime.now().isoformat()
        }
