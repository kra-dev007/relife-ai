from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- Device Inventory Schemas ---
class DeviceBase(BaseModel):
    manufacturer: str = Field(..., example="Dell")
    model: str = Field(..., example="Latitude 7490")
    cpu: str = Field(..., example="Intel Core i7-8650U @ 1.90GHz")
    ram_gb: float = Field(..., example=16.0)
    storage_gb: float = Field(..., example=512.0)
    storage_type: str = Field(default="SSD", example="NVMe SSD")
    os: str = Field(..., example="Windows 11 Pro")
    is_demo: bool = Field(default=False)

class DeviceCreate(DeviceBase):
    serial_hash: Optional[str] = Field(None, description="SHA-256 hash of hardware serial")

class DeviceResponse(DeviceBase):
    id: str
    serial_hash: str
    registered_at: str
    health_score: Optional[int] = None
    health_grade: Optional[str] = None
    status: str = "registered"
    last_diagnostic_at: Optional[str] = None

# --- Diagnostics Schemas ---
class CpuDiagnostic(BaseModel):
    cpu_score: int
    peak_temperature: Optional[float] = None
    thermal_throttling_detected: bool = False
    duration_seconds: float = 3.0
    utilization_percent: float

class RamDiagnostic(BaseModel):
    ram_score: int
    total_gb: float
    available_gb: float
    status: str  # "pass" | "warning" | "error"

class StorageDiagnostic(BaseModel):
    storage_score: int
    drive_model: Optional[str] = None
    capacity_gb: float
    filesystem: str
    smart_status: Optional[str] = "SMART health unavailable"

class ThermalDiagnostic(BaseModel):
    baseline_temp: Optional[float] = None
    peak_temp: Optional[float] = None
    thermal_status: str = "normal"  # "normal" | "warning" | "critical"
    confidence: float = 0.85

class DisplayDiagnostic(BaseModel):
    display_score: int = 100
    user_confirmed_defects: bool = False
    notes: Optional[str] = "No user-reported defects"

class ComponentEvidence(BaseModel):
    component: str
    status: str
    confidence: float
    notes: str

class DiagnosticRunResult(BaseModel):
    run_id: str
    device_id: str
    timestamp: str
    cpu: CpuDiagnostic
    ram: RamDiagnostic
    storage: StorageDiagnostic
    thermal: ThermalDiagnostic
    display: DisplayDiagnostic
    component_evidence: List[ComponentEvidence]
    overall_score: int
    health_grade: str

# --- Battery ML Prediction Schemas ---
class BatteryPredictionResponse(BaseModel):
    device_id: str
    design_capacity_wh: float
    full_charge_capacity_wh: float
    estimated_soh: float = Field(..., description="State of Health percentage (0-100)")
    estimated_remaining_cycles: int
    confidence: float
    telemetry_status: str
    disclaimer: str = "Estimated using NASA PCoE battery regression models. Not a manufacturer guarantee."

# --- Fair-Market Valuation Schemas ---
class ValuationResponse(BaseModel):
    device_id: str
    estimated_low: int
    estimated_high: int
    currency: str = "INR"
    confidence: float
    factors: List[Dict[str, Any]]
    is_synthetic_benchmark: bool = True
    disclaimer: str = "Valuation calculated via secondary market regression curve based on condition, age, and component health."

# --- Refurbishment Decision Engine Schemas ---
class ComponentAction(BaseModel):
    component: str
    condition: str  # "excellent" | "good" | "fair" | "poor"
    action: str     # "reuse" | "replace" | "service" | "salvage"
    estimated_cost: int = 0

class RefurbishmentResponse(BaseModel):
    device_id: str
    decision: str   # "REFURBISH" | "RECYCLE" | "SALVAGE"
    reason: str
    estimated_repair_cost: int
    estimated_refurbished_value: int
    estimated_as_is_value: int
    net_gain: int
    components: List[ComponentAction]

# --- Digital Device Passport Schemas ---
class PassportResponse(BaseModel):
    passport_id: str
    device_id: str
    device_model: str
    manufacturer: str
    diagnostic_timestamp: str
    overall_health: int
    health_grade: str
    battery_soh: float
    valuation_range: str
    refurbishment_decision: str
    status: str = "VALID"
    verification_url: str
    qr_code_svg: Optional[str] = None
    created_at: str
