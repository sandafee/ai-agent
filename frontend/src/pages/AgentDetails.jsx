import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bot, Key, FileCode, ShieldCheck, ArrowLeft, Cpu } from 'lucide-react';
import { fetchAgentDetails, fetchMandates, fetchTransactions } from '../services/api';
import VerificationBadge from '../components/VerificationBadge';

export default function AgentDetails() {
  const { did } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [mandates, setMandates] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function load() {
      try {
        const decodedDid = decodeURIComponent(did);
        const res = await fetchAgentDetails(decodedDid);
        const m = await fetchMandates();
        const t = await fetchTransactions();
        setData(res);
        setMandates(m.filter(x => x.agent_did === decodedDid));
        setTransactions(t.filter(x => x.agent_did === decodedDid));
      } catch (err) {
        console.error("AgentDetails error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [did]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Cpu className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  const agent = data?.data;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/agents')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Agents Registry</span>
      </button>

      {/* Hero Agent Header */}
      <div className="p-6 rounded-2xl glass-panel space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">{agent?.name}</h2>
              <VerificationBadge status={agent?.status} />
            </div>
            <p className="text-xs text-slate-400">{agent?.description}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 block font-mono">KYA Risk Score</span>
            <span className={`text-lg font-black font-mono ${agent?.risk_score > 30 ? 'text-red-400' : 'text-emerald-400'}`}>
              {agent?.risk_score}/100
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4 font-mono text-xs">
          <span className="text-slate-400">DID Identifier:</span>
          <span className="text-cyan-300 truncate font-bold">{agent?.did}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        {['overview', 'did-doc', 'mandate-vcs', 'transactions'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === tab
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl glass-card border space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              <span>Cryptographic Keys & Principal</span>
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div>
                <span className="text-slate-400 block">Owner Address:</span>
                <span className="text-cyan-300">{agent?.owner_address}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Public Key (Ed25519):</span>
                <span className="text-slate-300 break-all">{agent?.public_key}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Registration Timestamp:</span>
                <span className="text-slate-300">{new Date(agent?.created_at).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl glass-card border space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Active Spending Limits</span>
            </h3>
            {mandates.length > 0 ? (
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Single Tx Cap:</span>
                  <span className="text-emerald-300 font-bold">${parseFloat(mandates[0].spending_limit_per_tx).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Daily Spending Cap:</span>
                  <span className="text-emerald-300 font-bold">${parseFloat(mandates[0].daily_spending_cap).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Merchant Whitelist:</span>
                  <span className="text-cyan-300">{mandates[0].merchant_categories}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No active spending mandate found for this agent DID.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'did-doc' && (
        <div className="p-5 rounded-2xl glass-panel space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span>W3C Decentralized Identifier (DID) JSON-LD Document</span>
          </h3>
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
            {JSON.stringify(data?.didDocument, null, 2)}
          </pre>
        </div>
      )}

      {activeTab === 'mandate-vcs' && (
        <div className="space-y-4">
          {mandates.map((m) => (
            <div key={m.id} className="p-5 rounded-2xl glass-card border space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Mandate ID: {m.id}</span>
                <VerificationBadge status={m.status} />
              </div>
              <p className="text-slate-400">Allowed Categories: {m.merchant_categories}</p>
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-900/80 rounded-xl">
                <div>
                  <span className="text-slate-500 block">Single Tx Cap</span>
                  <span className="text-emerald-400 font-bold">${parseFloat(m.spending_limit_per_tx).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Daily Cap</span>
                  <span className="text-emerald-400 font-bold">${parseFloat(m.daily_spending_cap).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="p-4 rounded-xl glass-card flex items-center justify-between font-mono text-xs">
              <div>
                <span className="font-bold text-slate-200">${parseFloat(tx.amount).toFixed(2)}</span>
                <span className="text-slate-400 ml-2">({tx.merchant_category})</span>
              </div>
              <VerificationBadge status={tx.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
