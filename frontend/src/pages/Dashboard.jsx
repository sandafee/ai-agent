import React, { useEffect, useState } from 'react';
import { Bot, FileCheck, ArrowLeftRight, ShieldAlert, Cpu, Sparkles, ChevronRight } from 'lucide-react';
import StatCard from '../components/StatCard';
import VerificationBadge from '../components/VerificationBadge';
import { fetchOverview, fetchTransactions, fetchAgents } from '../services/api';
import { Link } from 'react-router-dom';

export default function Dashboard({ onOpenScanner }) {
  const [overview, setOverview] = useState(null);
  const [recentTx, setRecentTx] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [ov, txs, ags] = await Promise.all([
          fetchOverview(),
          fetchTransactions(),
          fetchAgents()
        ]);
        setOverview(ov);
        setRecentTx(txs.slice(0, 5));
        setAgents(ags.slice(0, 3));
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Cpu className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/20 relative overflow-hidden flex items-center justify-between">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Decentralized AI Agent Financial Infrastructure</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Know Your Agent (KYA) Control Center
          </h2>
          <p className="text-xs text-slate-300">
            Enforcing W3C Verifiable Credentials spending mandates, cryptographic DID resolution, and HSM-integrated Sherlock prompt injection defense across automated payment rails.
          </p>
        </div>

        <div className="hidden lg:flex gap-3">
          <button
            onClick={onOpenScanner}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-red-950/40 transition-all"
          >
            <Cpu className="w-4 h-4" />
            <span>Sherlock AI Scan</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Registered Agents"
          value={overview?.activeAgents || 0}
          subtext={`Out of ${overview?.totalAgents || 0} total DIDs`}
          icon={Bot}
          color="cyan"
          trend="+12%"
        />
        <StatCard
          title="Active VC Mandates"
          value={overview?.activeMandates || 0}
          subtext="W3C Ed25519 Verified"
          icon={FileCheck}
          color="emerald"
        />
        <StatCard
          title="Total Processed Volume"
          value={`$${(overview?.totalVolumeUSD || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtext="M-Pesa & Escrow Rails"
          icon={ArrowLeftRight}
          color="purple"
          trend="+28%"
        />
        <StatCard
          title="Threats Intercepted"
          value={overview?.securityThreatsIntercepted || 0}
          subtext="Sherlock AI Interceptions"
          icon={ShieldAlert}
          color="red"
        />
      </div>

      {/* Main Grid: Activity & Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions Feed */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-cyan-400" />
              <span>Real-Time Payment Rail Transactions</span>
            </h3>
            <Link to="/transactions" className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentTx.map((tx) => (
              <div key={tx.id} className="p-4 rounded-xl glass-card flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-200">${parseFloat(tx.amount).toFixed(2)}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-mono text-cyan-400">{tx.merchant_category}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono truncate max-w-xs">{tx.agent_did}</p>
                </div>

                <div className="flex items-center gap-3">
                  <VerificationBadge status={tx.status} />
                  <span className="text-[11px] text-slate-500 font-mono">{new Date(tx.created_at).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Agents Snapshot */}
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-400" />
              <span>Active Agent DIDs</span>
            </h3>
            <Link to="/agents" className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold">
              <span>Manage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {agents.map((agent) => (
              <div key={agent.id} className="p-3.5 rounded-xl glass-card space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-100">{agent.name}</span>
                  <VerificationBadge status={agent.status} />
                </div>
                <p className="text-[11px] font-mono text-cyan-300 truncate">{agent.did}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  <span>Risk Score:</span>
                  <span className={`font-mono font-bold ${agent.risk_score > 30 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {agent.risk_score}/100
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
