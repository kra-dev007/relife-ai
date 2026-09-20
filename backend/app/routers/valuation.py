from fastapi import APIRouter
from app.schemas.device import ValuationResponse
from app.utils.fixtures import get_valuation

router = APIRouter(prefix="/api/devices", tags=["Valuation"])

@router.post("/{device_id}/valuation", response_model=ValuationResponse)
def estimate_fair_market_value(device_id: str):
    """Calculate fair market valuation range based on component conditions."""
    return get_valuation(device_id)
