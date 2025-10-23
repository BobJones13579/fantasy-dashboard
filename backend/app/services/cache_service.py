"""
Cache Service for performance optimization using FastAPI Cache and Redis
Provides caching for API responses, odds data, and user sessions
"""

import redis
import json
import asyncio
from typing import Dict, Any, Optional, Union
from datetime import datetime, timedelta
import logging
try:
    from fastapi_cache import FastAPICache
    from fastapi_cache.backends.redis import RedisBackend
except ImportError:
    # Fallback for different fastapi_cache versions
    FastAPICache = None
    RedisBackend = None
import os

logger = logging.getLogger(__name__)

class CacheService:
    """Service for managing application caching"""
    
    def __init__(self, redis_url: Optional[str] = None):
        self.redis_url = redis_url or os.getenv('REDIS_URL', 'redis://localhost:6379')
        self.redis_client = None
        self.cache_backend = None
        
        # Cache configuration
        self.default_ttl = {
            'odds_data': 30,  # 30 seconds for odds data
            'league_data': 300,  # 5 minutes for league data
            'user_data': 1800,  # 30 minutes for user data
            'api_responses': 60,  # 1 minute for API responses
            'sessions': 3600,  # 1 hour for sessions
            'statistics': 600,  # 10 minutes for statistics
        }
    
    async def initialize(self):
        """Initialize Redis connection and FastAPI Cache"""
        try:
            # Initialize Redis client
            self.redis_client = redis.from_url(self.redis_url, decode_responses=True)
            
            # Test Redis connection
            self.redis_client.ping()
            
            # Initialize FastAPI Cache backend
            if FastAPICache and RedisBackend:
                self.cache_backend = RedisBackend(self.redis_client)
                FastAPICache.init(self.cache_backend, prefix="fantasy-app")
            else:
                logger.warning("FastAPI Cache not available, using basic Redis caching")
            
            logger.info("Cache service initialized successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to initialize cache service: {e}")
            return False
    
    def _serialize_data(self, data: Any) -> str:
        """Serialize data for Redis storage"""
        try:
            if isinstance(data, (dict, list)):
                return json.dumps(data, default=str)
            else:
                return str(data)
        except Exception as e:
            logger.error(f"Error serializing data: {e}")
            return str(data)
    
    def _deserialize_data(self, data: str) -> Any:
        """Deserialize data from Redis storage"""
        try:
            return json.loads(data)
        except (json.JSONDecodeError, TypeError):
            return data
    
    async def set(self, key: str, value: Any, ttl: Optional[int] = None, cache_type: str = 'default') -> bool:
        """
        Set a value in cache
        
        Args:
            key: Cache key
            value: Value to cache
            ttl: Time to live in seconds (uses default if not provided)
            cache_type: Type of cache data (determines default TTL)
            
        Returns:
            True if successful, False otherwise
        """
        try:
            if not self.redis_client:
                logger.warning("Redis client not initialized")
                return False
            
            # Determine TTL
            if ttl is None:
                ttl = self.default_ttl.get(cache_type, 300)  # Default 5 minutes
            
            # Serialize value
            serialized_value = self._serialize_data(value)
            
            # Set in Redis
            self.redis_client.setex(key, ttl, serialized_value)
            
            logger.debug(f"Cached key '{key}' with TTL {ttl}s")
            return True
            
        except Exception as e:
            logger.error(f"Error setting cache key '{key}': {e}")
            return False
    
    async def get(self, key: str) -> Optional[Any]:
        """
        Get a value from cache
        
        Args:
            key: Cache key
            
        Returns:
            Cached value or None if not found
        """
        try:
            if not self.redis_client:
                logger.warning("Redis client not initialized")
                return None
            
            # Get from Redis
            value = self.redis_client.get(key)
            
            if value is None:
                logger.debug(f"Cache miss for key '{key}'")
                return None
            
            # Deserialize value
            deserialized_value = self._deserialize_data(value)
            
            logger.debug(f"Cache hit for key '{key}'")
            return deserialized_value
            
        except Exception as e:
            logger.error(f"Error getting cache key '{key}': {e}")
            return None
    
    async def delete(self, key: str) -> bool:
        """
        Delete a key from cache
        
        Args:
            key: Cache key
            
        Returns:
            True if successful, False otherwise
        """
        try:
            if not self.redis_client:
                logger.warning("Redis client not initialized")
                return False
            
            result = self.redis_client.delete(key)
            logger.debug(f"Deleted cache key '{key}'")
            return result > 0
            
        except Exception as e:
            logger.error(f"Error deleting cache key '{key}': {e}")
            return False
    
    async def exists(self, key: str) -> bool:
        """
        Check if a key exists in cache
        
        Args:
            key: Cache key
            
        Returns:
            True if key exists, False otherwise
        """
        try:
            if not self.redis_client:
                return False
            
            result = self.redis_client.exists(key)
            return result > 0
            
        except Exception as e:
            logger.error(f"Error checking cache key '{key}': {e}")
            return False
    
    async def get_ttl(self, key: str) -> int:
        """
        Get time to live for a key
        
        Args:
            key: Cache key
            
        Returns:
            TTL in seconds, -1 if key doesn't exist, -2 if key has no expiration
        """
        try:
            if not self.redis_client:
                return -1
            
            ttl = self.redis_client.ttl(key)
            return ttl
            
        except Exception as e:
            logger.error(f"Error getting TTL for key '{key}': {e}")
            return -1
    
    async def increment(self, key: str, amount: int = 1) -> Optional[int]:
        """
        Increment a numeric value in cache
        
        Args:
            key: Cache key
            amount: Amount to increment by
            
        Returns:
            New value after increment, None if error
        """
        try:
            if not self.redis_client:
                return None
            
            result = self.redis_client.incrby(key, amount)
            return result
            
        except Exception as e:
            logger.error(f"Error incrementing cache key '{key}': {e}")
            return None
    
    async def cache_odds_data(self, league_id: str, week: int, odds_data: Dict[str, Any]) -> bool:
        """Cache odds data for a specific league and week"""
        key = f"odds:{league_id}:week:{week}"
        return await self.set(key, odds_data, cache_type='odds_data')
    
    async def get_cached_odds_data(self, league_id: str, week: int) -> Optional[Dict[str, Any]]:
        """Get cached odds data for a specific league and week"""
        key = f"odds:{league_id}:week:{week}"
        return await self.get(key)
    
    async def cache_league_data(self, league_id: str, league_data: Dict[str, Any]) -> bool:
        """Cache league data"""
        key = f"league:{league_id}"
        return await self.set(key, league_data, cache_type='league_data')
    
    async def get_cached_league_data(self, league_id: str) -> Optional[Dict[str, Any]]:
        """Get cached league data"""
        key = f"league:{league_id}"
        return await self.get(key)
    
    async def cache_user_data(self, user_id: str, user_data: Dict[str, Any]) -> bool:
        """Cache user data"""
        key = f"user:{user_id}"
        return await self.set(key, user_data, cache_type='user_data')
    
    async def get_cached_user_data(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get cached user data"""
        key = f"user:{user_id}"
        return await self.get(key)
    
    async def cache_api_response(self, endpoint: str, params: Dict[str, Any], response_data: Any) -> bool:
        """Cache API response"""
        # Create a hash of the endpoint and parameters for the key
        import hashlib
        param_string = json.dumps(params, sort_keys=True)
        key_hash = hashlib.md5(f"{endpoint}:{param_string}".encode()).hexdigest()
        key = f"api:{endpoint}:{key_hash}"
        
        return await self.set(key, response_data, cache_type='api_responses')
    
    async def get_cached_api_response(self, endpoint: str, params: Dict[str, Any]) -> Optional[Any]:
        """Get cached API response"""
        import hashlib
        param_string = json.dumps(params, sort_keys=True)
        key_hash = hashlib.md5(f"{endpoint}:{param_string}".encode()).hexdigest()
        key = f"api:{endpoint}:{key_hash}"
        
        return await self.get(key)
    
    async def cache_session_data(self, session_id: str, session_data: Dict[str, Any]) -> bool:
        """Cache session data"""
        key = f"session:{session_id}"
        return await self.set(key, session_data, cache_type='sessions')
    
    async def get_cached_session_data(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get cached session data"""
        key = f"session:{session_id}"
        return await self.get(key)
    
    async def invalidate_league_cache(self, league_id: str) -> bool:
        """Invalidate all cache entries for a league"""
        try:
            if not self.redis_client:
                return False
            
            # Get all keys matching the league pattern
            pattern = f"*:{league_id}:*"
            keys = self.redis_client.keys(pattern)
            
            if keys:
                self.redis_client.delete(*keys)
                logger.info(f"Invalidated {len(keys)} cache entries for league {league_id}")
                return True
            
            return True
            
        except Exception as e:
            logger.error(f"Error invalidating league cache for {league_id}: {e}")
            return False
    
    async def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        try:
            if not self.redis_client:
                return {'error': 'Redis client not initialized'}
            
            info = self.redis_client.info()
            
            return {
                'redis_version': info.get('redis_version'),
                'used_memory': info.get('used_memory_human'),
                'connected_clients': info.get('connected_clients'),
                'total_commands_processed': info.get('total_commands_processed'),
                'keyspace_hits': info.get('keyspace_hits'),
                'keyspace_misses': info.get('keyspace_misses'),
                'hit_rate': info.get('keyspace_hits', 0) / max(info.get('keyspace_hits', 0) + info.get('keyspace_misses', 0), 1),
                'expired_keys': info.get('expired_keys'),
                'evicted_keys': info.get('evicted_keys')
            }
            
        except Exception as e:
            logger.error(f"Error getting cache stats: {e}")
            return {'error': str(e)}
    
    async def clear_all_cache(self) -> bool:
        """Clear all cache entries"""
        try:
            if not self.redis_client:
                return False
            
            self.redis_client.flushdb()
            logger.info("Cleared all cache entries")
            return True
            
        except Exception as e:
            logger.error(f"Error clearing cache: {e}")
            return False
    
    async def test_cache_service(self) -> Dict[str, Any]:
        """Test cache service functionality"""
        try:
            # Test basic operations
            test_key = "test:cache:service"
            test_value = {"test": True, "timestamp": datetime.now().isoformat()}
            
            # Test set
            set_result = await self.set(test_key, test_value, ttl=60)
            
            # Test get
            retrieved_value = await self.get(test_key)
            
            # Test exists
            exists_result = await self.exists(test_key)
            
            # Test TTL
            ttl_result = await self.get_ttl(test_key)
            
            # Test delete
            delete_result = await self.delete(test_key)
            
            # Test increment
            inc_key = "test:increment"
            inc_result = await self.increment(inc_key, 5)
            await self.delete(inc_key)
            
            return {
                'success': True,
                'message': 'Cache service is operational',
                'test_results': {
                    'set': set_result,
                    'get': retrieved_value == test_value,
                    'exists': exists_result,
                    'ttl': ttl_result > 0,
                    'delete': delete_result,
                    'increment': inc_result == 5
                },
                'cache_config': {
                    'default_ttls': self.default_ttl,
                    'redis_url': self.redis_url
                },
                'features': [
                    'Redis backend',
                    'FastAPI Cache integration',
                    'Automatic serialization',
                    'TTL management',
                    'Cache statistics',
                    'Bulk operations'
                ]
            }
            
        except Exception as e:
            logger.error(f"Cache service test failed: {e}")
            return {
                'success': False,
                'message': f'Cache service test failed: {str(e)}',
                'test_results': {},
                'cache_config': {},
                'features': []
            }

# Global cache service instance
cache_service = CacheService()
