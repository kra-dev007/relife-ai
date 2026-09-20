# ReLife AI Documentation

## System Architecture

```
Target Laptop
    ↓
Local Diagnostic Agent (Python/WMI/psutil)
    ↓ Authenticated Local HTTP API (No arbitrary shell execution)
FastAPI Backend (Data validation, scoring, passports, valuation)
    ├── Battery AI Engine (NASA PCoE SOH & RUL Regression)
    ├── Device Health Engine (Weighted diagnostic rubric)
    ├── Fair-Market Valuation Engine (Depreciation & component grade regression)
    └── Refurbishment Decision Engine (Refurbish vs Recycle vs Salvage)
    ↓
Next.js Frontend Client (UI, Display Test, Passports, QR Verification)
```

## Security Model
- Diagnostic Agent whitelists read-only telemetry queries (WMI, psutil, safe CPU/RAM benchmarks).
- Zero arbitrary command or shell execution endpoints are exposed.
- Hardware serial numbers are cryptographically hashed (SHA-256) before persistence.
