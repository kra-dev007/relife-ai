'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { api, DiagnosticRun } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import {
  Activity,
  CheckCircle2,
  Clock,
  Play,
  ArrowRight,
  RefreshCw,
  Cpu,
  Layers,
  Thermometer,
  BatteryCharging,
  ShieldCheck
} from 'lucide-react';

const STAGES = [
  'Collecting hardware inventory',
  'Running CPU safe benchmark',
  'Checking memory pressure',
  'Checking storage SMART telemetry',
  'Analyzing battery degradation via NASA ML',
  'Running thermal monitoring',
  'Calculating ReLife health score',
  'Estimating fair-market value',
  'Generating refurbishment recommendation'
];

export default function DiagnosticsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [currentStage, setCurrentStage] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<DiagnosticRun | null>(null);

  const startDiagnostics = async () => {
    setIsRunning(true);
    setCurrentStage(0);

    // Simulate stepping through genuine backend diagnostic runner stages
    for (let i = 0; i < STAGES.length; i++) {
      setCurrentStage(i);
      await new Promise((r) => setTimeout(r, 450));
    }

    try {
      const data = await api.triggerDiagnostics(id);
      setResult(data);
    } catch (err) {
      console.error('Diagnostic error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (id) {
      api.getDiagnostics(id).then(setResult).catch(() => {});
    }
  }, [id]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Diagnostic Testing Suite
              </span>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                Hardware Integrity & Health Tests
              </h1>
              <p className="text-xs text-slate-500 font-mono mt-1">Device ID: {id}</p>
            </div>

            <button
              onClick={startDiagnostics}
              disabled={isRunning}
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Running Stage {currentStage + 1}/9...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Start Full Diagnostics</span>
                </>
              )}
            </button>
          </div>

          {/* Section 33 Diagnostic Stages */}
          <div className="mt-8 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Diagnostic Execution Stages (Section 33)
            </h3>

            <div className="space-y-3">
              {STAGES.map((stage, idx) => {
                const isDone = !isRunning && result ? true : idx < currentStage;
                const isCurrent = isRunning && idx === currentStage;

                return (
                  <div
                    key={stage}
                    className={`flex items-center justify-between p-3.5 rounded-lg border transition ${
                      isCurrent
                        ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-500/20'
                        : isDone
                        ? 'bg-white border-slate-200 text-slate-700'
                        : 'bg-slate-50/50 border-slate-100 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      ) : isCurrent ? (
                        <RefreshCw className="h-4 w-4 text-emerald-600 animate-spin shrink-0" />
                      ) : (
                        <Clock className="h-4 w-4 text-slate-300 shrink-0" />
                      )}
                      <span className={`text-xs font-medium ${isCurrent ? 'font-bold text-emerald-950' : ''}`}>
                        {idx + 1}. {stage}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono">
                      {isDone ? 'COMPLETED' : isCurrent ? 'EXECUTING' : 'QUEUED'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Diagnostic Results Card */}
          {result && !isRunning && (
            <div className="mt-8 bg-white p-6 rounded-xl border border-emerald-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Diagnostic Run Summary</h3>
                  <p className="text-xs text-slate-500">Run ID: {result.run_id} · {result.timestamp}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-emerald-600">
                    Grade {result.health_grade} ({result.overall_score}/100)
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-xs text-slate-400 font-medium">CPU Test</div>
                  <div className="text-base font-bold text-slate-800 mt-1">{result.cpu.cpu_score}/100</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Peak {result.cpu.peak_temperature}°C</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-xs text-slate-400 font-medium">RAM Test</div>
                  <div className="text-base font-bold text-slate-800 mt-1">{result.ram.ram_score}/100</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Status: {result.ram.status}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-xs text-slate-400 font-medium">Storage Test</div>
                  <div className="text-base font-bold text-slate-800 mt-1">{result.storage.storage_score}/100</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{result.storage.filesystem}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-xs text-slate-400 font-medium">Thermal Test</div>
                  <div className="text-base font-bold text-slate-800 mt-1 capitalize">{result.thermal.thermal_status}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Confidence {Math.round(result.thermal.confidence * 100)}%</div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => router.push(`/devices/${id}/passport`)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
                >
                  <span>Proceed to Digital Passport</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
