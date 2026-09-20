'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Cpu,
  BatteryCharging,
  Award,
  DollarSign,
  FileText,
  ArrowRight,
  Sparkles,
  Layers,
  ShieldCheck,
  Laptop
} from 'lucide-react';

interface HealthResponse {
  status: string;
  service: string;
  tagline: string;
  version: string;
  environment: string;
  timestamp: string;
  phase: string;
}

export default function HomePage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<string>('');

  const checkBackendHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${apiUrl}/api/health`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }
      const data: HealthResponse = await res.json();
      setHealth(data);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (err: any) {
      setError(err?.message || 'Could not connect to FastAPI backend');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <Laptop className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">ReLife AI</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                TENSORA 2K26 · SUS-02
              </span>
            </div>
          </div>

          {/* Connection Status Header Badge */}
          <div className="flex items-center space-x-3">
            {loading ? (
              <div className="flex items-center text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5 text-slate-400" />
                Connecting backend...
              </div>
            ) : health?.status === 'healthy' ? (
              <div className="flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shadow-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                ReLife AI Backend Connected ✓
              </div>
            ) : (
              <div className="flex items-center text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                <AlertCircle className="h-3.5 w-3.5 mr-1.5 text-amber-600" />
                Backend Offline
              </div>
            )}

            <button
              onClick={checkBackendHealth}
              disabled={loading}
              title="Refresh connection status"
              className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium mb-6">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          <span>Diagnostic • Refurbish • Resell • Don’t Discard</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Premature E-Waste Discard &<br />
          <span className="text-emerald-600">Unverified Device Resale</span> Solver
        </h1>

        <p className="mt-5 text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          AI-powered software-driven diagnostic grading suite that tests hardware integrity, estimates battery degradation with NASA AI models, verifies component evidence, estimates fair device value, and generates a trusted digital refurbishment passport.
        </p>

        {/* Primary CTA Buttons (Section 38 requirement) */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/devices/new"
            className="inline-flex items-center px-6 py-3 rounded-lg text-sm font-semibold bg-emerald-600 text-white shadow hover:bg-emerald-700 transition"
          >
            <Laptop className="mr-2 h-4 w-4" />
            Scan Device
          </Link>
          <Link
            href="/devices/dev-demo-001"
            className="inline-flex items-center px-6 py-3 rounded-lg text-sm font-semibold bg-white text-slate-700 border border-slate-300 shadow-xs hover:bg-slate-50 transition"
          >
            View Demo (Dell 7490)
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 rounded-lg text-sm font-semibold bg-slate-900 text-white shadow-xs hover:bg-slate-800 transition"
          >
            Open Dashboard →
          </Link>
        </div>

        {/* 5-Step Pipeline Flow Visualization */}
        <div className="mt-14 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-4 text-left">
            Core ReLife Pipeline
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-left">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-emerald-600 font-bold text-xs mb-1">01. INVENTORY</div>
              <div className="font-semibold text-sm text-slate-800 flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-slate-500" />
                Diagnostics
              </div>
              <div className="text-xs text-slate-500 mt-1">Safe CPU, RAM, disk, display & thermal testing</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-emerald-600 font-bold text-xs mb-1">02. BATTERY AI</div>
              <div className="font-semibold text-sm text-slate-800 flex items-center gap-1.5">
                <BatteryCharging className="h-4 w-4 text-slate-500" />
                Health Score
              </div>
              <div className="text-xs text-slate-500 mt-1">NASA-trained SOH & remaining cycles prediction</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-emerald-600 font-bold text-xs mb-1">03. VALUATION</div>
              <div className="font-semibold text-sm text-slate-800 flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-slate-500" />
                Fair Value
              </div>
              <div className="text-xs text-slate-500 mt-1">Transparent market estimate (Low – High)</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-emerald-600 font-bold text-xs mb-1">04. DECISION</div>
              <div className="font-semibold text-sm text-slate-800 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-slate-500" />
                Refurbishment
              </div>
              <div className="text-xs text-slate-500 mt-1">Refurbish vs Recycle vs Salvage matrix</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-emerald-600 font-bold text-xs mb-1">05. TRUST</div>
              <div className="font-semibold text-sm text-slate-800 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-slate-500" />
                Digital Passport
              </div>
              <div className="text-xs text-slate-500 mt-1">QR verification & downloadable PDF</div>
            </div>
          </div>
        </div>
      </section>

      {/* Phase 1 Verification Card */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between pb-5 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Phase 1 Milestone</span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">Frontend & Backend Connectivity Test</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {lastChecked ? `Checked at ${lastChecked}` : 'Checking...'}
            </span>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="py-10 text-center">
                <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-600">Querying FastAPI backend at http://127.0.0.1:8000/api/health ...</p>
              </div>
            ) : health ? (
              <div className="space-y-6">
                {/* Prominent Success Banner requested by Section 48 */}
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-emerald-900">
                      ReLife AI Backend Connected ✓
                    </h3>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Live connection established between Next.js client and FastAPI server.
                    </p>
                  </div>
                </div>

                {/* Response Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-xs text-slate-400 font-medium">Service</div>
                    <div className="text-sm font-semibold text-slate-800 mt-0.5">{health.service}</div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-xs text-slate-400 font-medium">Status</div>
                    <div className="text-sm font-semibold text-emerald-700 capitalize mt-0.5">{health.status}</div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-xs text-slate-400 font-medium">API Version</div>
                    <div className="text-sm font-semibold text-slate-800 font-mono mt-0.5">{health.version}</div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-xs text-slate-400 font-medium">Active Phase</div>
                    <div className="text-xs font-semibold text-slate-800 mt-0.5">{health.phase}</div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-xs text-slate-400 font-medium">Environment</div>
                    <div className="text-sm font-semibold text-slate-800 capitalize mt-0.5">{health.environment}</div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-xs text-slate-400 font-medium">Server Timestamp</div>
                    <div className="text-xs font-mono text-slate-700 mt-0.5">{health.timestamp}</div>
                  </div>
                </div>

                {/* Tagline confirmation */}
                <div className="p-3 rounded-lg bg-slate-100/70 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                  <span>Tagline: <strong className="text-slate-800">{health.tagline}</strong></span>
                  <span className="font-mono text-emerald-600 font-semibold">GET /api/health (200 OK)</span>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-red-50 border border-red-200 text-red-900 space-y-3">
                <div className="flex items-center space-x-2 font-bold text-sm">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span>Connection Failed</span>
                </div>
                <p className="text-xs text-red-700">{error}</p>
                <div className="text-xs text-slate-600 bg-white p-3 rounded border border-red-100">
                  <p className="font-semibold mb-1">Make sure the FastAPI backend is running:</p>
                  <code className="text-xs font-mono bg-slate-100 px-2 py-1 rounded block">
                    cd backend; python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
                  </code>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
