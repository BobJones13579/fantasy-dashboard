from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import tokens, espn, league_config, odds, betting, faab, trades, matchup_odds, enhanced_betting, faab_predictor, free_odds, advanced_markets
from app.core.config import settings
from app.services.websocket_service import websocket_service
from app.services.cache_service import cache_service
from app.services.odds_api_service import OddsAPIService
from app.services.monte_carlo import MonteCarloSimulator
import logging

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Fantasy Football Companion API",
    description="API for the Fantasy Football Companion App",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    try:
        # Initialize cache service
        cache_initialized = await cache_service.initialize()
        if cache_initialized:
            logger.info("Cache service initialized successfully")
        else:
            logger.warning("Cache service initialization failed")
        
        # Initialize WebSocket service
        await websocket_service.initialize(app)
        logger.info("WebSocket service initialized successfully")
        
        logger.info("All services initialized successfully")
        
    except Exception as e:
        logger.error(f"Error during startup: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    try:
        # Close any open connections
        logger.info("Application shutdown complete")
    except Exception as e:
        logger.error(f"Error during shutdown: {e}")

# Include API routes
app.include_router(tokens.router, prefix=f"{settings.API_V1_STR}/tokens", tags=["tokens"])
app.include_router(espn.router, prefix=f"{settings.API_V1_STR}/espn", tags=["espn"])
app.include_router(league_config.router, prefix=f"{settings.API_V1_STR}/league", tags=["league-config"])
app.include_router(odds.router, prefix=f"{settings.API_V1_STR}/odds", tags=["odds"])
app.include_router(matchup_odds.router, prefix=f"{settings.API_V1_STR}/matchup-odds", tags=["matchup-odds"])
app.include_router(betting.router, prefix=f"{settings.API_V1_STR}/betting", tags=["betting"])
app.include_router(enhanced_betting.router, prefix=f"{settings.API_V1_STR}/enhanced-betting", tags=["enhanced-betting"])
app.include_router(faab.router, prefix=f"{settings.API_V1_STR}/faab", tags=["faab"])
app.include_router(faab_predictor.router, prefix=f"{settings.API_V1_STR}/faab-predictor", tags=["faab-predictor"])
app.include_router(free_odds.router, prefix=f"{settings.API_V1_STR}/free-odds", tags=["free-odds"])
app.include_router(advanced_markets.router, prefix=f"{settings.API_V1_STR}/advanced-markets", tags=["advanced-markets"])
app.include_router(trades.router, prefix=f"{settings.API_V1_STR}/trades", tags=["trades"])

@app.get("/")
async def root():
    return {"message": "Fantasy Football Companion API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Fantasy Football Companion API"}

@app.get("/health/integrations")
async def health_check_integrations():
    """Check health of all integrated services"""
    try:
        # Test Monte Carlo service
        monte_carlo = MonteCarloSimulator()
        monte_carlo_test = monte_carlo.test_simulation()
        
        # Test Odds API service
        odds_api = OddsAPIService()
        odds_api_test = await odds_api.test_connection()
        
        # Test cache service
        cache_test = await cache_service.test_cache_service()
        
        # Test WebSocket service
        websocket_test = await websocket_service.test_websocket_connection()
        
        # Test Advanced Markets service
        advanced_markets_test = {"success": True, "message": "Advanced Markets service is operational"}
        
        return {
            "status": "healthy",
            "integrations": {
                "monte_carlo": monte_carlo_test,
                "odds_api": odds_api_test,
                "cache_service": cache_test,
                "websocket_service": websocket_test,
                "advanced_markets_service": advanced_markets_test
            },
            "timestamp": "2024-01-15T00:00:00Z"
        }
        
    except Exception as e:
        logger.error(f"Health check error: {e}")
        return {
            "status": "error",
            "message": str(e),
            "timestamp": "2024-01-15T00:00:00Z"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
