'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { api, Device } from '@/lib/api';
import Link from 'next/link';
import { Laptop, Search, Plus, FileText, Activity, ShieldCheck } from 'lucide-react';

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [query, setQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDevices()
      .then(setDevices)
      .catch((err) => console.error('Error fetching devices:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredDevices = devices.filter((d) => {
    const matchesQuery =
      d.model.toLowerCase().includes(query.toLowerCase()) ||
      d.manufacturer.toLowerCase().includes(query.toLowerCase()) ||
      d.cpu.toLowerCase().includes(query.toLowerCase());
    const matchesGrade =
      gradeFilter === 'ALL' || (d.health_grade && d.health_grade.startsWith(gradeFilter));
    return matchesQuery && matchesGrade;
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Device Inventory</h1>
            <p className="text-sm text-slate-500 mt-1">
              Registered laptops, live diagnostic records, and digital refurbishment passports.
            </p>
          </div>
          <Link
            href="/devices/new"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
          >
            <Plus className="h-4 w-4" />
            <span>Scan New Laptop</span>
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search make, model, or CPU..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 font-medium">Filter Grade:</span>
            {['ALL', 'A', 'B', 'C', 'D'].map((grade) => (
              <button
                key={grade}
                onClick={() => setGradeFilter(grade)}
                className={`px-3 py-1 rounded text-xs font-semibold transition ${
                  gradeFilter === grade
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>

        {/* Device Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredDevices.map((device) => (
            <div key={device.id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-emerald-300 transition">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {device.manufacturer}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-0.5">{device.model}</h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                    device.health_grade?.startsWith('A') || device.health_grade?.startsWith('B')
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {device.health_grade ? `Grade ${device.health_grade}` : 'Pending'}
                  </span>
                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs space-y-1 text-slate-600">
                  <div><strong className="text-slate-800">CPU:</strong> {device.cpu}</div>
                  <div><strong className="text-slate-800">Memory:</strong> {device.ram_gb} GB RAM</div>
                  <div><strong className="text-slate-800">Storage:</strong> {device.storage_gb} GB {device.storage_type}</div>
                  <div><strong className="text-slate-800">OS:</strong> {device.os}</div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Overall Health Score:</span>
                  <span className="font-bold text-slate-800">{device.health_score || '--'}/100</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/devices/${device.id}`}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-800"
                >
                  View Details →
                </Link>
                <div className="flex gap-2">
                  <Link
                    href={`/devices/${device.id}/diagnostics`}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 rounded hover:bg-slate-50"
                    title="Hardware Diagnostics"
                  >
                    <Activity className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/devices/${device.id}/passport`}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 rounded hover:bg-slate-50"
                    title="Digital Passport"
                  >
                    <FileText className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
