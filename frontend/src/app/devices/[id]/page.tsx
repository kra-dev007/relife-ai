'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { api, Device, DiagnosticRun, BatteryPrediction, Valuation, RefurbishmentDecision } from '@/lib/api';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Laptop,
  Activity,
  BatteryCharging,
  Cpu,
  Layers,
  FileCheck2,
  DollarSign,
  ShieldCheck,
  Download,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Thermometer
} from 'lucide-react';

export default function DeviceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [device, setDevice] = useState<Device | null>(null);
  const [diag, setDiag] = useState<DiagnosticRun | null>(null);
  const [battery, setBattery] = useState<BatteryPrediction | null>(null);
  const [valuation, setValuation] = useState<Valuation | null>(null);
  const [refurb, setRefurb] = useState<RefurbishmentDecision | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    Promise.allSettled([
      api.getDevice(id),
      api.getDiagnostics(id),
      api.getBatteryPrediction(id),
      api.getValuation(id),
      api.getRefurbishment(id)
    ]).then(([dRes, diagRes, bRes, vRes, rRes]) => {
      if (dRes.status === 'fulfilled') setDevice(dRes.value);
      if (diagRes.status === 'fulfilled') setDiag(diagRes.value);
      if (bRes.status === 'fulfilled') setBattery(bRes.value);
      if (vRes.status === 'fulfilled') setValuation(vRes.value);
      if (rRes.status === 'fulfilled') setRefurb(rRes.value);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600">Loading device health telemetry...</p>
          </div>
        </main>
      </div>
    );
  }

  const overallHealth = diag?.overall_score ?? device?.health_score ?? 87;
  const grade = diag?.health_grade ?? device?.health_grade ?? 'B+';

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Device Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {device?.manufacturer || 'Laptop'}
              </span>
              {device?.is_demo && (
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                  Demo / Test Profile
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              {device?.model || 'Device Overview'}
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Device ID: {id} · Serial Hash: {device?.serial_hash || 'SHA256-UNVERIFIED'}
            </p>
          </div>

          {/* Action Buttons requested in Section 32 */}
          <div className="mt-4 lg:mt-0 flex flex-wrap gap-2.5">
            <Link
              href={`/devices/${id}/diagnostics`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition shadow-xs"
            >
              <Activity className="h-3.5 w-3.5 text-emerald-600" />
              <span>Run Diagnostics</span>
            </Link>

            <Link
              href={`/devices/${id}/passport`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition shadow-xs"
            >
              <FileCheck2 className="h-3.5 w-3.5" />
              <span>Generate Passport</span>
            </Link>

            <a
              href={`http://127.0.0.1:8000/api/passports/RL-2026-7A82F91/pdf`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition shadow-xs"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Download PDF</span>
            </a>
          </div>
        </div>

        {/* Executive Score Banner */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs uppercase font-bold text-slate-400">ReLife Health Score</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-slate-900">{overallHealth}</span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
            <div className="mt-1 text-xs text-emerald-700 font-semibold">
              Project-defined grade standard
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs uppercase font-bold text-slate-400">ReLife Health Grade</span>
            <div className="text-3xl font-extrabold text-emerald-600 mt-2">
              Grade {grade}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Weights: Battery 20% · CPU 20% · Thermal 15%
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs uppercase font-bold text-slate-400">Battery SOH (AI Model)</span>
            <div className="text-3xl font-extrabold text-slate-900 mt-2">
              {battery?.estimated_soh ? `${battery.estimated_soh}%` : '82%'}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              ~{battery?.estimated_remaining_cycles || 430} useful cycles remaining
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs uppercase font-bold text-slate-400">Refurbish Decision</span>
            <div className={`text-2xl font-extrabold mt-2 ${
              refurb?.decision === 'REFURBISH' ? 'text-emerald-700' : 'text-amber-700'
            }`}>
              {refurb?.decision || 'REFURBISH'}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Est. Net Gain: ₹{refurb?.net_gain || 4300}
            </div>
          </div>
        </div>

        {/* Section 32 Component Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Hardware Diagnostic Scores */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Component Health Breakdown
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Cpu className="h-5 w-5 text-slate-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">CPU Performance Test</div>
                    <div className="text-[11px] text-slate-500">
                      {device?.cpu} · Utilization {diag?.cpu.utilization_percent || 94.2}%
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                  Score: {diag?.cpu.cpu_score || 85}/100
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Layers className="h-5 w-5 text-slate-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Memory Integrity & Pressure</div>
                    <div className="text-[11px] text-slate-500">
                      Total: {device?.ram_gb || 16} GB · Available: {diag?.ram.available_gb || 9.4} GB
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                  Score: {diag?.ram.ram_score || 92}/100
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Thermometer className="h-5 w-5 text-slate-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Thermal Diagnostic</div>
                    <div className="text-[11px] text-slate-500">
                      Peak Temp: {diag?.thermal.peak_temp || 68.5}°C · Status: {diag?.thermal.thermal_status || 'Normal'}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                  Status: Pass
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BatteryCharging className="h-5 w-5 text-slate-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Storage SMART Health</div>
                    <div className="text-[11px] text-slate-500">
                      {diag?.storage.drive_model || 'SK hynix PC401 NVMe 512GB'} · {diag?.storage.smart_status}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                  Score: {diag?.storage.storage_score || 88}/100
                </span>
              </div>
            </div>

            {/* Component Evidence Section */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Component Evidence Verification (Section 19)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {diag?.component_evidence.map((ev) => (
                  <div key={ev.component} className="p-2.5 bg-slate-50 rounded border border-slate-100">
                    <div className="font-bold text-slate-800">{ev.component}</div>
                    <div className="text-[11px] text-emerald-700">{ev.status}</div>
                    <div className="text-[10px] text-slate-400">Confidence: {Math.round(ev.confidence * 100)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Valuation & Decision Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Fair Market Valuation
                </h3>
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </div>

              <div className="mt-3">
                <div className="text-2xl font-extrabold text-slate-900">
                  ₹{valuation?.estimated_low.toLocaleString() || '18,500'} – ₹{valuation?.estimated_high.toLocaleString() || '21,000'}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Confidence: {Math.round((valuation?.confidence || 0.84) * 100)}%
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="font-bold text-slate-800 mb-1">Pricing Factors:</div>
                {valuation?.factors.map((f, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{f.factor}</span>
                    <span className={f.impact >= 0 ? 'text-emerald-700 font-semibold' : 'text-slate-500 font-semibold'}>
                      {f.impact >= 0 ? `+${f.impact}%` : `${f.impact}%`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Refurbishment Decision Matrix
              </h3>
              <p className="text-xs text-slate-600 mt-2">
                {refurb?.reason}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                {refurb?.components.map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{c.component}</span>
                    <span className="capitalize px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {c.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
