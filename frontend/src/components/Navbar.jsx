import React from 'react';
import { ShieldCheck, Bell, Cpu, Search, Activity } from 'lucide-react';

export default function Navbar({ onOpenScanner }) {
  return (
    <header className="h-16 border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Agent DIDs, Mandates, VCs, Transcripts..."
            className="pl-9 pr-4 py-1.5 w-80 bg-slate-900/90 border border-slate-700/60 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Sherlock Security Quick Action */}
        <button
          onClick={onOpenScanner}
          className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-600/20 to-amber-600/20 border border-red-500/40 hover:border-red-400 rounded-lg text-xs font-semibold text-red-300 hover:text-white transition-all shadow-sm hover:shadow-red-900/30"
        >
          <Cpu className="w-4 h-4 text-red-400 animate-pulse" />
          <span>Sherlock AI Scanner</span>
        </button>

        {/* Network Badge */}
        <div className="flex items-center gap-2 px-3 py-1 bg-cyan-950/50 border border-cyan-500/30 rounded-full text-xs font-mono text-cyan-300">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Solana + EVM Mainnet</span>
        </div>

        {/* Notifications */}
        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full"></span>
        </button>

        {/* User Identity Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-xs text-black shadow-md shadow-cyan-900/40">
            CB
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-200">Central Bank Regulator</p>
            <p className="text-[10px] text-cyan-400 font-mono">KYA Authority Root</p>
          </div>
        </div>
      </div>
    </header>
  );
}
