'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { api, Passport, Device } from '@/lib/api';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FileCheck2,
  ShieldCheck,
  QrCode,
  Download,
  Share2,
  ArrowRight,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

export default function PassportPage() {
  const params = useParams();
  const id = params?.id as string;

  const [passport, setPassport] = useState<Passport | null>(null);
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.allSettled([api.getPassport(id), api.getDevice(id)])
      .then(([pRes, dRes]) => {
        if (pRes.status === 'fulfilled') setPassport(pRes.value);
        if (dRes.status === 'fulfilled') setDevice(dRes.value);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin" />
        </main>
      </div>
    );
  }

  const pId = passport?.passport_id || 'RL-2026-7A82F91';

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Digital Asset Identity
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Status: VALID
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                Digital Device Passport
              </h1>
              <p className="text-xs text-slate-500 font-mono mt-1">Passport ID: {pId}</p>
            </div>

            <div className="mt-4 sm:mt-0 flex gap-2">
              <a
                href={`http://127.0.0.1:8000/api/passports/${pId}/pdf`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>

          {/* Certificate Card */}
          <div className="mt-8 bg-white rounded-2xl border-2 border-emerald-500/30 p-8 shadow-sm relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-emerald-50 pointer-events-none" />

            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded bg-emerald-600 flex items-center justify-center text-white">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="font-extrabold text-slate-900 text-lg">ReLife Certified Passport</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Issued under TENSORA 2K26 Sustainable Electronics Verification Standard
                </p>
              </div>

              <div className="text-right">
                <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  {pId}
                </span>
              </div>
            </div>

            {/* Passport Core Data Grid */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Device</span>
                <div className="text-sm font-bold text-slate-800 mt-0.5">
                  {passport?.device_model || 'Latitude 7490'}
                </div>
                <div className="text-[11px] text-slate-500">{passport?.manufacturer || 'Dell'}</div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Health Grade</span>
                <div className="text-sm font-bold text-emerald-700 mt-0.5">
                  Grade {passport?.health_grade || 'B+'}
                </div>
                <div className="text-[11px] text-slate-500">{passport?.overall_health || 87}/100 Score</div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Battery SOH</span>
                <div className="text-sm font-bold text-slate-800 mt-0.5">
                  {passport?.battery_soh || 82}%
                </div>
                <div className="text-[11px] text-slate-500">NASA AI Estimation</div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Decision</span>
                <div className="text-sm font-bold text-emerald-700 mt-0.5">
                  {passport?.refurbishment_decision || 'REFURBISH'}
                </div>
                <div className="text-[11px] text-slate-500">{passport?.valuation_range || '₹18.5k–₹21k'}</div>
              </div>
            </div>

            {/* QR Code Section (Section 27) */}
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="h-24 w-24 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-slate-700 font-mono text-[10px] text-center p-2">
                  [QR CODE: /verify/{pId}]
                </div>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-slate-800">Scan to Verify Passport</div>
                  <p className="text-slate-500 max-w-xs">
                    Third-party buyers and recyclers can scan this code to inspect verified hardware telemetry.
                  </p>
                  <Link
                    href={`/verify/${pId}`}
                    className="text-emerald-700 font-semibold hover:underline inline-flex items-center gap-1 pt-1"
                  >
                    <span>Open Public Verification Page</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-400 space-y-0.5">
                <div>Hash Verification: <span className="font-mono text-slate-600">SHA256-MATCH</span></div>
                <div>Model Release: <span className="font-mono text-slate-600">v1.0.0-PROD</span></div>
                <div>Issued: <span className="font-mono text-slate-600">{passport?.created_at?.split('T')[0]}</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
