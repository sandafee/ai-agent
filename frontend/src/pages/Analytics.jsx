import React, { useEffect, useState } from 'react';
import { BarChart3, ShieldAlert, Cpu, CheckCircle2, PieChart } from 'lucide-react';
import { fetchOverview } from '../services/api';

export default function Analytics() {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await fetchOverview();
      setOverview(data);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-cyan-400" />
          <span>Security & Mandate Intelligence Analytics</span>
        </h2>
        <p className="text-xs text-slate-400">Threat vector breakdown, mandate breach frequency, and systemic risk scoring.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Threat Distribution Card */}
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>Sherlock AI Threat Vector Distribution</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>System Prompt Override Attacks</span>
                <span className="text-red-400 font-bold">55%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '55%' }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Mandate Limit Evasion / Split Tx</span>
                <span className="text-amber-400 font-bold">30%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Wallet Drain & Sweeper Attacks</span>
                <span className="text-purple-400 font-bold">15%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Systemic Risk Breakdown */}
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-400" />
            <span>Agent Ecosystem Risk Matrix</span>
          </h3>

          <div className="grid grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Average Agent Risk Score</span>
              <span className="text-2xl font-black text-emerald-400">{overview?.avgRiskScore || 14}/100</span>
              <span className="text-[10px] text-emerald-300 block">LOW RISK CATEGORY</span>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Mandate Compliance Rate</span>
              <span className="text-2xl font-black text-cyan-400">96.8%</span>
              <span className="text-[10px] text-cyan-300 block">W3C SPEC COMPLIANT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
