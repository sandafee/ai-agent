import React, { useEffect, useState } from 'react';
import { ArrowLeftRight, Play, ShieldAlert, CheckCircle2, Search, Cpu } from 'lucide-react';
import { fetchTransactions, authorizeTransaction, fetchAgents } from '../services/api';
import VerificationBadge from '../components/VerificationBadge';
import Modal from '../components/Modal';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [simResult, setSimResult] = useState(null);
  const [formData, setFormData] = useState({
    agentDid: '',
    amount: 2500,
    recipientAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    merchantCategory: 'escrow',
    promptPayload: 'Execute automated liquidity vault rebalance.'
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [txs, ags] = await Promise.all([fetchTransactions(), fetchAgents()]);
    setTransactions(txs);
    setAgents(ags);
    if (ags.length > 0) setFormData(prev => ({ ...prev, agentDid: ags[0].did }));
  }

  const handleSimulate = async (e) => {
    e.preventDefault();
    const res = await authorizeTransaction(formData);
    setSimResult(res);
    loadData();
  };

  const filtered = transactions.filter(t =>
    t.tx_hash.toLowerCase().includes(search.toLowerCase()) ||
    t.agent_did.toLowerCase().includes(search.toLowerCase()) ||
    t.merchant_category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ArrowLeftRight className="w-6 h-6 text-purple-400" />
            <span>Autonomous Payment Rails & Escrow Logs</span>
          </h2>
          <p className="text-xs text-slate-400">Real-time execution verification across M-Pesa, Solana, and Escrow smart contracts.</p>
        </div>

        <button
          onClick={() => {
            setSimResult(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-purple-950/50 transition-all"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Simulate Agent Payment</span>
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by transaction hash, agent DID, or merchant category..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((tx) => (
          <div key={tx.id} className="p-4 rounded-2xl glass-card border flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="font-bold text-base text-white">${parseFloat(tx.amount).toFixed(2)} USD</span>
                <VerificationBadge status={tx.status} />
                <span className="text-[11px] text-cyan-400 bg-cyan-950/60 border border-cyan-500/20 px-2 py-0.5 rounded">
                  {tx.merchant_category}
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">Tx Hash: <span className="text-slate-300 truncate">{tx.tx_hash}</span></p>
              <p className="text-slate-500 text-[11px]">Agent: <span className="text-cyan-300">{tx.agent_did}</span></p>
            </div>

            <div className="text-right space-y-1">
              <p className="text-slate-300 text-[11px] max-w-xs">{tx.details}</p>
              <p className="text-slate-500 text-[10px]">{new Date(tx.created_at).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Simulator Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Autonomous Payment Rail Simulator">
        <form onSubmit={handleSimulate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Agent DID</label>
            <select
              value={formData.agentDid}
              onChange={(e) => setFormData({ ...formData, agentDid: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300 focus:outline-none"
            >
              {agents.map(a => (
                <option key={a.id} value={a.did}>{a.name} ({a.did.substring(0, 18)}...)</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Transfer Amount ($)</label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Merchant Category</label>
              <input
                type="text"
                required
                value={formData.merchantCategory}
                onChange={(e) => setFormData({ ...formData, merchantCategory: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Recipient Address</label>
            <input
              type="text"
              required
              value={formData.recipientAddress}
              onChange={(e) => setFormData({ ...formData, recipientAddress: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Associated Natural Language Prompt Payload</label>
            <textarea
              rows={3}
              value={formData.promptPayload}
              onChange={(e) => setFormData({ ...formData, promptPayload: e.target.value })}
              placeholder="e.g. Execute transfer of funds..."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 font-bold rounded-xl text-xs text-white shadow-lg shadow-purple-950/40"
          >
            Submit Transaction to KYA Mandate Engine
          </button>
        </form>

        {simResult && (
          <div className={`p-4 rounded-xl border mt-4 space-y-2 ${simResult.authorized ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-red-950/30 border-red-500/50'}`}>
            <div className="flex items-center gap-2 font-bold text-xs">
              {simResult.authorized ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-red-400" />}
              <span className={simResult.authorized ? 'text-emerald-300' : 'text-red-300'}>
                {simResult.authorized ? 'TRANSACTION AUTHORIZED' : `TRANSACTION REJECTED (${simResult.status})`}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans">{simResult.reason}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
