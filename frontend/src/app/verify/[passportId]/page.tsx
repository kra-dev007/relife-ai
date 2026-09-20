'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Laptop,
  BatteryCharging,
  Layers,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';

export default function VerifyPassportPage() {
  const params = useParams();
  const passportId = params?.passportId as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!passportId) return;
    api.verifyPassport(passportId)
      .then(setData)
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  }, [passportId]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between p-4 sm:p-8">
      <div className="max-w-xl mx-auto w-full">
        {/* Navigation back */}
        <div className="mb-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Verification Certificate */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 overflow-hidden">
          {loading ? (
            <div className="py-12 text-center">
              <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500">Querying passport verification ledger...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-800 rounded-lg text-xs">
              Failed to verify passport: {error}
            </div>
          ) : (
            <div>
              {/* Top Verified Badge */}
              <div className="text-center pb-6 border-b border-slate-100">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                  ReLife Digital Device Passport
                </span>
                <h1 className="text-xl font-bold text-slate-900 mt-1">
                  Verified Device Passport
                </h1>
                <div className="inline-block mt-2 font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Status: {data?.status || 'VALID'}
                </div>
              </div>

              {/* Data Table requested in Section 27 */}
              <div className="mt-6 divide-y divide-slate-100 text-xs">
                <div className="py-3 flex justify-between">
                  <span className="text-slate-500">Passport ID</span>
                  <span className="font-mono font-bold text-slate-800">{data?.passport_id}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-slate-500">Device Model</span>
                  <span className="font-bold text-slate-800">{data?.device_model}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-slate-500">Diagnostic Date</span>
                  <span className="font-mono text-slate-700">{data?.issued_at?.split('T')[0] || '2026-09-20'}</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-slate-500">Health Score</span>
                  <span className="font-bold text-slate-900 text-sm">{data?.health_score}/100</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-slate-500">ReLife Health Grade</span>
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
                    Grade {data?.health_grade}
                  </span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-slate-500">Battery SOH (AI Estimated)</span>
                  <span className="font-bold text-slate-800">{data?.battery_soh}%</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-slate-500">Circularity Recommendation</span>
                  <span className="px-2 py-0.5 rounded font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
                    {data?.refurbishment_decision}
                  </span>
                </div>
              </div>

              {/* Verification Message */}
              <div className="mt-6 p-3 bg-slate-50 rounded-lg text-[11px] text-slate-500 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Evidence Consistency Verified</span>
                </div>
                <p>{data?.message}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="text-center text-[11px] text-slate-400 mt-6">
        ReLife AI · TENSORA 2K26 Problem SUS-02 · Digital Product Passports for Circular Electronics
      </footer>
    </div>
  );
}
