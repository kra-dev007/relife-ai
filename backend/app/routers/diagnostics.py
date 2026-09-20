from fastapi import APIRouter, HTTPException
from app.schemas.device import DiagnosticRunResult
from app.utils.fixtures import get_diagnostic_result, MOCK_DEVICES

router = APIRouter(prefix="/api/devices", tags=["Diagnostics"])

@router.post("/{device_id}/diagnostics", response_model=DiagnosticRunResult)
def trigger_diagnostics(device_id: str):
    """Trigger a fresh hardware diagnostic run on the device."""
    if device_id not in MOCK_DEVICES:
        # Auto-create if not found to allow smooth testing
        pass
    result = get_diagnostic_result(device_id)
    if device_id in MOCK_DEVICES:
        MOCK_DEVICES[device_id].health_score = result.overall_score
        MOCK_DEVICES[device_id].health_grade = result.health_grade
        MOCK_DEVICES[device_id].status = "diagnosed"
        MOCK_DEVICES[device_id].last_diagnostic_at = result.timestamp
    return result

@router.get("/{device_id}/diagnostics", response_model=DiagnosticRunResult)
def get_diagnostics(device_id: str):
    """Get the latest diagnostic run result for a device."""
    return get_diagnostic_result(device_id)
