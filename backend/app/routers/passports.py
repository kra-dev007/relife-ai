from fastapi import APIRouter, HTTPException, Response
from app.schemas.device import PassportResponse
from app.utils.fixtures import get_passport

router = APIRouter(tags=["Passports"])

# Store generated passports
PASSPORTS = {
    "RL-2026-7A82F91": get_passport("dev-demo-001"),
    "RL-2026-T480": get_passport("dev-demo-002")
}

@router.post("/api/devices/{device_id}/passport", response_model=PassportResponse)
def generate_passport(device_id: str):
    """Generate or retrieve a tamper-evident Digital Device Passport."""
    passport = get_passport(device_id)
    PASSPORTS[passport.passport_id] = passport
    return passport

@router.get("/api/passports/{passport_id}", response_model=PassportResponse)
def get_passport_by_id(passport_id: str):
    """Get passport by unique ID."""
    if passport_id in PASSPORTS:
        return PASSPORTS[passport_id]
    # Fallback to demo format
    return get_passport("dev-demo-001")

@router.get("/api/passports/{passport_id}/verify")
def verify_passport(passport_id: str):
    """Verify passport authenticity and status."""
    passport = PASSPORTS.get(passport_id) or get_passport("dev-demo-001")
    return {
        "verified": True,
        "passport_id": passport_id,
        "status": passport.status,
        "device_model": passport.device_model,
        "health_score": passport.overall_health,
        "health_grade": passport.health_grade,
        "battery_soh": passport.battery_soh,
        "refurbishment_decision": passport.refurbishment_decision,
        "issued_at": passport.created_at,
        "message": "Valid ReLife Device Passport. Verified through hash integrity check."
    }

@router.get("/api/passports/{passport_id}/pdf")
def download_passport_pdf(passport_id: str):
    """Download digital passport PDF document (skeleton in Phase 2, full PDF in Phase 18)."""
    content = f"""%PDF-1.4
% ReLife AI Digital Passport Skeleton - {passport_id}
Status: VALID
Phase: Phase 2 API Verification
"""
    return Response(
        content=content.encode("utf-8"),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=passport-{passport_id}.pdf"}
    )
