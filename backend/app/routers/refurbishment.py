from fastapi import APIRouter
from app.schemas.device import RefurbishmentResponse
from app.utils.fixtures import get_refurbishment_decision

router = APIRouter(prefix="/api/devices", tags=["Refurbishment Engine"])

@router.post("/{device_id}/refurbishment", response_model=RefurbishmentResponse)
def evaluate_refurbishment(device_id: str):
    """Compute Refurbish vs Recycle vs Salvage decision matrix."""
    return get_refurbishment_decision(device_id)
