from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime, timezone
import hashlib
import uuid

from app.schemas.device import DeviceCreate, DeviceResponse
from app.utils.fixtures import MOCK_DEVICES

router = APIRouter(prefix="/api/devices", tags=["Devices"])

@router.post("/register", response_model=DeviceResponse)
def register_device(payload: DeviceCreate):
    """Register a new device for diagnostics."""
    device_id = f"dev-{uuid.uuid4().hex[:8]}"
    serial_hash = payload.serial_hash or hashlib.sha256(f"{payload.manufacturer}-{payload.model}-{device_id}".encode()).hexdigest()[:16]
    
    device = DeviceResponse(
        id=device_id,
        manufacturer=payload.manufacturer,
        model=payload.model,
        cpu=payload.cpu,
        ram_gb=payload.ram_gb,
        storage_gb=payload.storage_gb,
        storage_type=payload.storage_type,
        os=payload.os,
        serial_hash=serial_hash,
        registered_at=datetime.now(timezone.utc).isoformat(),
        status="registered",
        is_demo=payload.is_demo
    )
    MOCK_DEVICES[device_id] = device
    return device

@router.get("", response_model=List[DeviceResponse])
def list_devices():
    """List all registered and demo devices."""
    return list(MOCK_DEVICES.values())

@router.get("/{device_id}", response_model=DeviceResponse)
def get_device(device_id: str):
    """Retrieve details for a specific device."""
    if device_id in MOCK_DEVICES:
        return MOCK_DEVICES[device_id]
    raise HTTPException(status_code=404, detail="Device not found")
