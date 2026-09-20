'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Laptop, Cpu, ShieldCheck, AlertCircle, Play, Sparkles } from 'lucide-react';

export default function NewDevicePage() {
  const router = useRouter();
  const [mode, setMode] = useState<'agent' | 'demo'>('agent');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    manufacturer: 'HP',
    model: 'ProBook 450 G7',
    cpu: 'Intel Core i5-10210U @ 1.60GHz',
    ram_gb: 16,
    storage_gb: 512,
    storage_type: 'NVMe SSD',
    os: 'Windows 11 Home 64-bit',
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const created = await api.registerDevice({
        ...formData,
        is_demo: mode === 'demo',
      });
      router.push(`/devices/${created.id}/diagnostics`);
    } catch (err) {
      alert('Failed to register device: ' + String(err));
      setLoading(false);
    }
  };

  const handleSelectDemo = async (demoProfile: string) => {
    setLoading(true);
    try {
      if (demoProfile === 'healthy') {
        const d = await api.registerDevice({
          manufacturer: 'Dell',
          model: 'XPS 13 9300 (Demo)',
          cpu: 'Intel Core i7-1065G7 @ 1.30GHz',
          ram_gb: 16,
          storage_gb: 512,
          storage_type: 'NVMe SSD',
          os: 'Windows 11 Pro',
          is_demo: true,
        });
        router.push(`/devices/${d.id}`);
      } else {
        const d = await api.registerDevice({
          manufacturer: 'Lenovo',
          model: 'ThinkPad T480 (Demo - Aging Battery)',
          cpu: 'Intel Core i5-8250U @ 1.60GHz',
          ram_gb: 8,
          storage_gb: 256,
          storage_type: 'SATA SSD',
          os: 'Windows 10 Pro',
          is_demo: true,
        });
        router.push(`/devices/${d.id}`);
      }
    } catch (err) {
      alert('Failed to initialize demo: ' + String(err));
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="pb-6 border-b border-slate-200">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Scan / Register Laptop</h1>
            <p className="text-sm text-slate-500 mt-1">
              Initialize local Windows diagnostic agent or select a verified test profile.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              type="button"
              onClick={() => setMode('agent')}
              className={`p-4 rounded-xl border text-left transition ${
                mode === 'agent'
                  ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <Laptop className="h-4 w-4 text-emerald-600" />
                <span>Live Hardware Agent</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Reads direct telemetry via Windows WMI & battery APIs (Port 8765).
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMode('demo')}
              className={`p-4 rounded-xl border text-left transition ${
                mode === 'demo'
                  ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Demo / Test Profiles</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Evaluate AI models on pre-loaded benchmark laptops (Section 45 Fallback).
              </p>
            </button>
          </div>

          {mode === 'demo' ? (
            <div className="mt-6 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>Section 45 Mode: Running on verified benchmark data without live agent.</span>
              </div>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-lg border border-slate-200 hover:border-emerald-300 transition flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Profile 1: Healthy Business Laptop (Dell XPS 13)</h4>
                    <p className="text-xs text-slate-500 mt-0.5">82% SOH battery, Grade B+, NVMe SSD, Candidate for Refurbishment.</p>
                  </div>
                  <button
                    onClick={() => handleSelectDemo('healthy')}
                    disabled={loading}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
                  >
                    Load Profile
                  </button>
                </div>

                <div className="p-4 rounded-lg border border-slate-200 hover:border-amber-300 transition flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Profile 2: Thermal & Battery Degradation (ThinkPad T480)</h4>
                    <p className="text-xs text-slate-500 mt-0.5">57% SOH battery, Grade D, Thermal throttling, Salvage Candidate.</p>
                  </div>
                  <button
                    onClick={() => handleSelectDemo('degraded')}
                    disabled={loading}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
                  >
                    Load Profile
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="mt-6 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Device Specifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    required
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Model Name</label>
                  <input
                    type="text"
                    required
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">CPU Model</label>
                <input
                  type="text"
                  required
                  value={formData.cpu}
                  onChange={(e) => setFormData({ ...formData, cpu: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">RAM (GB)</label>
                  <input
                    type="number"
                    required
                    value={formData.ram_gb}
                    onChange={(e) => setFormData({ ...formData, ram_gb: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Storage Capacity (GB)</label>
                  <input
                    type="number"
                    required
                    value={formData.storage_gb}
                    onChange={(e) => setFormData({ ...formData, storage_gb: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Storage Type</label>
                  <select
                    value={formData.storage_type}
                    onChange={(e) => setFormData({ ...formData, storage_type: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="NVMe SSD">NVMe SSD</option>
                    <option value="SATA SSD">SATA SSD</option>
                    <option value="HDD">HDD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Operating System</label>
                <input
                  type="text"
                  required
                  value={formData.os}
                  onChange={(e) => setFormData({ ...formData, os: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
                >
                  <Play className="h-4 w-4" />
                  <span>{loading ? 'Registering...' : 'Register & Start Diagnostics'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
