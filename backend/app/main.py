from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import tokens, espn
from app.core.config import settings

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

# Include API routes
app.include_router(tokens.router, prefix=f"{settings.API_V1_STR}/tokens", tags=["tokens"])
app.include_router(espn.router, prefix=f"{settings.API_V1_STR}/espn", tags=["espn"])

@app.get("/")
async def root():
    return {"message": "Fantasy Football Companion API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Fantasy Football Companion API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
