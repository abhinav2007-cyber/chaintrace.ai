"""
ChainTrace AI — FastAPI Backend Entry Point
"""
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from app.database import create_db_and_tables
from app.routers import cases, evidence, copilot, campaigns


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(
    title="ChainTrace AI",
    description="AI-Powered Crypto Crime Investigation & Evidence Fusion",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow frontend origin
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:3001,https://chaintrace-ai.vercel.app"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(cases.router)
app.include_router(evidence.router)
app.include_router(copilot.router)
app.include_router(campaigns.router)


@app.get("/")
def health():
    return {
        "service": "ChainTrace AI Backend",
        "status": "operational",
        "version": "1.0.0",
        "disclaimer": "Prototype for investigative assistance. AI outputs require human verification.",
    }


@app.get("/health")
def health_check():
    return {"status": "ok"}
