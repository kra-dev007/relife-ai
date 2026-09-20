'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Laptop,
  Activity,
  FileCheck2,
  BarChart3,
  PlusCircle,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Devices', href: '/devices', icon: Laptop },
    { label: 'Diagnostics', href: '/devices/dev-demo-001/diagnostics', icon: Activity },
    { label: 'Passports', href: '/devices/dev-demo-001/passport', icon: FileCheck2 },
    { label: 'Analytics', href: '/dashboard#analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col justify-between shrink-0">
      <div>
        {/* Brand */}
        <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Laptop className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-base">ReLife AI</span>
              <span className="block text-[10px] uppercase font-semibold text-emerald-600 tracking-wider">
                SUS-02 Prototype
              </span>
            </div>
          </Link>
        </div>

        {/* Quick Action Button */}
        <div className="p-4">
          <Link
            href="/devices/new"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-medium text-xs hover:bg-emerald-700 transition shadow-xs"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Scan New Device</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <ShieldAlert className="h-3.5 w-3.5 text-emerald-600" />
            <span>TENSORA 2K26</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Problem: SUS-02 Premature E-Waste Discard
          </p>
          <Link
            href="/verify/RL-2026-7A82F91"
            className="text-[11px] text-emerald-700 font-medium hover:underline inline-flex items-center gap-0.5 pt-1"
          >
            <span>Public QR Verification</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
