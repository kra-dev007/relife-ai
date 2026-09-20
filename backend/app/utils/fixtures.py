from datetime import datetime, timezone
import hashlib
from typing import Dict, List, Optional
from app.schemas.device import (
    DeviceResponse,
    DiagnosticRunResult,
    CpuDiagnostic,
    RamDiagnostic,
    StorageDiagnostic,
    ThermalDiagnostic,
    DisplayDiagnostic,
    ComponentEvidence,
    BatteryPredictionResponse,
    ValuationResponse,
    RefurbishmentResponse,
    ComponentAction,
    PassportResponse
)

# Standard mock / fixture devices
MOCK_DEVICES: Dict[str, DeviceResponse] = {
    "dev-demo-001": DeviceResponse(
        id="dev-demo-001",
        manufacturer="Dell",
        model="Latitude 7490",
        cpu="Intel Core i7-8650U @ 1.90GHz",
        ram_gb=16.0,
        storage_gb=512.0,
        storage_type="NVMe SSD",
        os="Windows 11 Pro 64-bit",
        serial_hash=hashlib.sha256(b"DELL-LATITUDE-7490-DEMO").hexdigest()[:16],
        registered_at="2026-09-20T10:00:00Z",
        health_score=87,
        health_grade="B+",
        status="diagnosed",
        last_diagnostic_at="2026-09-20T10:15:00Z",
        is_demo=True,
    ),
    "dev-demo-002": DeviceResponse(
        id="dev-demo-002",
        manufacturer="Lenovo",
        model="ThinkPad T480",
        cpu="Intel Core i5-8250U @ 1.60GHz",
        ram_gb=8.0,
        storage_gb=256.0,
        storage_type="SATA SSD",
        os="Windows 10 Pro 64-bit",
        serial_hash=hashlib.sha256(b"LENOVO-T480-DEMO").hexdigest()[:16],
        registered_at="2026-09-19T14:30:00Z",
        health_score=68,
        health_grade="D",
        status="diagnosed",
        last_diagnostic_at="2026-09-19T14:45:00Z",
        is_demo=True,
    )
}

def get_diagnostic_result(device_id: str) -> DiagnosticRunResult:
    is_thinkpad = "002" in device_id
    score = 68 if is_thinkpad else 87
    grade = "D" if is_thinkpad else "B+"
    return DiagnosticRunResult(
        run_id=f"diag-{device_id}-run-1",
        device_id=device_id,
        timestamp=datetime.now(timezone.utc).isoformat(),
        cpu=CpuDiagnostic(
            cpu_score=85 if not is_thinkpad else 70,
            peak_temperature=68.5 if not is_thinkpad else 86.0,
            thermal_throttling_detected=is_thinkpad,
            duration_seconds=3.0,
            utilization_percent=94.2
        ),
        ram=RamDiagnostic(
            ram_score=92 if not is_thinkpad else 75,
            total_gb=16.0 if not is_thinkpad else 8.0,
            available_gb=9.4 if not is_thinkpad else 1.8,
            status="pass" if not is_thinkpad else "warning"
        ),
        storage=StorageDiagnostic(
            storage_score=88,
            drive_model="SK hynix PC401 NVMe 512GB",
            capacity_gb=512.0,
            filesystem="NTFS",
            smart_status="SMART health status: Good"
        ),
        thermal=ThermalDiagnostic(
            baseline_temp=44.0,
            peak_temp=68.5 if not is_thinkpad else 86.0,
            thermal_status="normal" if not is_thinkpad else "warning",
            confidence=0.88
        ),
        display=DisplayDiagnostic(
            display_score=100 if not is_thinkpad else 85,
            user_confirmed_defects=is_thinkpad,
            notes="No dead pixels reported" if not is_thinkpad else "Minor backlight bleeding reported by user"
        ),
        component_evidence=[
            ComponentEvidence(
                component="CPU",
                status="Verified configuration consistent",
                confidence=0.98,
                notes="Model identifier matches CPUID instruction telemetry"
            ),
            ComponentEvidence(
                component="RAM",
                status="Configuration consistent",
                confidence=0.95,
                notes="Dual-channel DDR4 verified by memory controller"
            ),
            ComponentEvidence(
                component="Storage",
                status="Consistent with OEM specifications",
                confidence=0.90,
                notes="Model and firmware align with vendor manifest"
            )
        ],
        overall_score=score,
        health_grade=grade
    )

def get_battery_prediction(device_id: str) -> BatteryPredictionResponse:
    is_thinkpad = "002" in device_id
    return BatteryPredictionResponse(
        device_id=device_id,
        design_capacity_wh=60.0 if not is_thinkpad else 48.0,
        full_charge_capacity_wh=49.2 if not is_thinkpad else 27.5,
        estimated_soh=82.0 if not is_thinkpad else 57.3,
        estimated_remaining_cycles=430 if not is_thinkpad else 110,
        confidence=0.84 if not is_thinkpad else 0.76,
        telemetry_status="Telemetry complete via Windows Battery API",
        disclaimer="Estimated using NASA PCoE battery regression models. Not a manufacturer guarantee."
    )

def get_valuation(device_id: str) -> ValuationResponse:
    is_thinkpad = "002" in device_id
    low = 18500 if not is_thinkpad else 9500
    high = 21000 if not is_thinkpad else 11500
    return ValuationResponse(
        device_id=device_id,
        estimated_low=low,
        estimated_high=high,
        currency="INR",
        confidence=0.84,
        factors=[
            {"factor": "Device Age (4-5 yrs)", "impact": -12, "detail": "Hardware generation depreciation"},
            {"factor": "Battery Health (82% SOH)", "impact": -6, "detail": "Moderate capacity remaining"},
            {"factor": "RAM (16GB DDR4)", "impact": +8, "detail": "High memory capacity for business use"},
            {"factor": "Storage (512GB NVMe)", "impact": +6, "detail": "Fast NVMe SSD in good condition"},
            {"factor": "Grade Condition (B+)", "impact": +4, "detail": "Fully functional with minor cosmetic wear"}
        ],
        is_synthetic_benchmark=True,
        disclaimer="Valuation calculated via secondary market regression curve based on condition, age, and component health."
    )

def get_refurbishment_decision(device_id: str) -> RefurbishmentResponse:
    is_thinkpad = "002" in device_id
    if is_thinkpad:
        return RefurbishmentResponse(
            device_id=device_id,
            decision="SALVAGE",
            reason="High thermal degradation and severely depleted battery make full refurbishment uneconomical. Reusable RAM and SSD can be salvaged.",
            estimated_repair_cost=7500,
            estimated_refurbished_value=14000,
            estimated_as_is_value=8500,
            net_gain=-2000,
            components=[
                ComponentAction(component="Battery", condition="poor", action="replace", estimated_cost=4200),
                ComponentAction(component="Thermal / Fan", condition="poor", action="service", estimated_cost=1500),
                ComponentAction(component="RAM", condition="good", action="salvage", estimated_cost=0),
                ComponentAction(component="SSD", condition="good", action="salvage", estimated_cost=0),
                ComponentAction(component="Display", condition="fair", action="salvage", estimated_cost=0)
            ]
        )
    return RefurbishmentResponse(
        device_id=device_id,
        decision="REFURBISH",
        reason="Most major components remain healthy and estimated refurbishment value exceeds recovery and repair costs.",
        estimated_repair_cost=1200,
        estimated_refurbished_value=22500,
        estimated_as_is_value=17000,
        net_gain=4300,
        components=[
            ComponentAction(component="CPU", condition="excellent", action="reuse", estimated_cost=0),
            ComponentAction(component="RAM", condition="excellent", action="reuse", estimated_cost=0),
            ComponentAction(component="SSD", condition="good", action="reuse", estimated_cost=0),
            ComponentAction(component="Battery", condition="good", action="reuse", estimated_cost=0),
            ComponentAction(component="Cooling System", condition="fair", action="service", estimated_cost=1200),
            ComponentAction(component="Display", condition="excellent", action="reuse", estimated_cost=0)
        ]
    )

def get_passport(device_id: str) -> PassportResponse:
    is_thinkpad = "002" in device_id
    p_id = f"RL-2026-{'T480' if is_thinkpad else '7A82F91'}"
    return PassportResponse(
        passport_id=p_id,
        device_id=device_id,
        device_model="ThinkPad T480" if is_thinkpad else "Latitude 7490",
        manufacturer="Lenovo" if is_thinkpad else "Dell",
        diagnostic_timestamp="2026-09-20T10:15:00Z",
        overall_health=68 if is_thinkpad else 87,
        health_grade="D" if is_thinkpad else "B+",
        battery_soh=57.3 if is_thinkpad else 82.0,
        valuation_range="₹9,500 – ₹11,500" if is_thinkpad else "₹18,500 – ₹21,000",
        refurbishment_decision="SALVAGE" if is_thinkpad else "REFURBISH",
        status="VALID",
        verification_url=f"/verify/{p_id}",
        created_at=datetime.now(timezone.utc).isoformat()
    )
