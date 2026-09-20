from fastapi import APIRouter
from app.schemas.device import BatteryPredictionResponse
from app.utils.fixtures import get_battery_prediction

router = APIRouter(prefix="/api/devices", tags=["Battery ML"])

@router.post("/{device_id}/battery/predict", response_model=BatteryPredictionResponse)
def predict_battery_degradation(device_id: str):
    """Run battery regression ML model to estimate SOH and remaining cycles."""
    return get_battery_prediction(device_id)
