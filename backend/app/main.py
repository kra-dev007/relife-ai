from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import devices, diagnostics, battery, valuation, refurbishment, passports

app = FastAPI(
    title=settings.app_name,
    description="Intelligent Hardware Diagnostics, Battery Degradation ML, and Digital Refurbishment Passport System.",
    version=settings.version,
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Modular Routers
app.include_router(devices.router)
app.include_router(diagnostics.router)
app.include_router(battery.router)
app.include_router(valuation.router)
app.include_router(refurbishment.router)
app.include_router(passports.router)


@app.get("/")
def root():
    return {
        "message": f"Welcome to {settings.app_name}",
        "tagline": settings.app_tagline,
        "docs_url": "/docs",
        "health_check": "/api/health",
        "endpoints": [
            "/api/devices",
            "/api/devices/register",
            "/api/devices/{id}/diagnostics",
            "/api/devices/{id}/battery/predict",
            "/api/devices/{id}/valuation",
            "/api/devices/{id}/refurbishment",
            "/api/devices/{id}/passport",
            "/api/passports/{id}",
            "/api/passports/{id}/verify",
        ]
    }


@app.get("/api/health")
def health_check():
    """Phase 1 & 2 System Health Check Endpoint."""
    return {
        "status": "healthy",
        "service": "ReLife AI Backend",
        "tagline": settings.app_tagline,
        "version": settings.version,
        "environment": settings.environment,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "phase": "PHASE 2: Frontend/backend connection & full routing",
    }

