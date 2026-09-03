import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  FileCheck,
  ArrowLeftRight,
  DollarSign,
  BarChart3,
  ScrollText,
  ShieldCheck
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Agents', path: '/agents', icon: Bot },
  { name: 'Mandates', path: '/mandates', icon: FileCheck },
  { name: 'Transactions', path: '/transactions', icon: ArrowLeftRight },
  { name: 'Revenue', path: '/revenue', icon: DollarSign },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Audit Logs', path: '/audit-logs', icon: ScrollText },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#0a0f1d] border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 z-40 select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold tracking-wider text-base text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-200">
              KYA PROTOCOL
            </h1>
            <p className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">Know Your Agent</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-950/50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
          <div className="flex items-center justify-between font-mono text-[11px] text-slate-400">
            <span>W3C VC Spec</span>
            <span className="text-emerald-400 font-bold">v1.1</span>
          </div>
          <div className="flex items-center justify-between font-mono text-[11px] text-slate-400">
            <span>HSM Scanner</span>
            <span className="text-cyan-400 font-bold">Sherlock</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
