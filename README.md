# ReLife AI

> **“Diagnose. Refurbish. Resell. Don’t Discard.”**

ReLife AI is an intelligent diagnostic grading suite, battery state-of-health predictor, fair-market valuation engine, and digital device passport platform designed for **TENSORA 2K26 (Problem SUS-02: Premature E-Waste Discard and Unverified Device Resale)**.

---

## The Problem
Consumers and secondary electronics markets discard functioning consumer laptops prematurely because assessing remaining battery health, component authenticities, and device values is difficult without specialized hardware testing equipment.

## The ReLife AI Solution
ReLife AI provides:
1. **Local Diagnostic Agent**: Safely queries Windows hardware metrics without arbitrary shell risks.
2. **Battery ML Model**: Trains on NASA battery degradation data to estimate true State-of-Health (SOH) and predict remaining useful charge cycles with confidence intervals.
3. **Hardware Health Engine**: Computes normalized, explainable health grades (A–E) across CPU, RAM, storage, battery, display, and thermal behavior.
4. **Fair-Market Valuation Engine**: Estimates verifiable resale value ranges.
5. **Refurbishment Decision Engine**: Evaluates whether a device should be Refurbished, Recycled, or Salvaged for parts.
6. **Digital Device Passport & QR Verification**: Tamper-evident device passports with verifiable QR landing pages and downloadable PDFs.

---

## Phase 1 Status
- **Phase 1 Objective**: Project skeleton, dependency environment setup, FastAPI backend with `/api/health`, and Next.js frontend verifying live connectivity with **“ReLife AI Backend Connected ✓”**.
- **Backend Port**: `8000` (`http://127.0.0.1:8000/api/health`)
- **Frontend Port**: `3000` (`http://localhost:3000`)

---

## Getting Started

### Prerequisites
- Python 3.10+ (tested on Python 3.11.9)
- Node.js 18+ (tested on Node.js v24.19.0 / npm 11.17.0)

### 1. Backend Setup
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to view the live dashboard and backend connection status.

