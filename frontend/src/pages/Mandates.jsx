import React, { useEffect, useState } from 'react';
import { FileCheck, Plus, ShieldAlert, Code2, AlertCircle } from 'lucide-react';
import { fetchMandates, createMandate, revokeMandate, fetchAgents } from '../services/api';
import VerificationBadge from '../components/VerificationBadge';
import Modal from '../components/Modal';

export default function Mandates() {
  const [mandates, setMandates] = useState([]);
  const [agents, setAgents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inspectVc, setInspectVc] = useState(null);
  const [formData, setFormData] = useState({
    agentDid: '',
    maxSingleTx: 5000,
    dailyCap: 25000,
    merchantCategories: 'fintech,escrow,settlement',
    durationDays: 180
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [m, a] = await Promise.all([fetchMandates(), fetchAgents()]);
    setMandates(m);
    setAgents(a);
    if (a.length > 0) setFormData(prev => ({ ...prev, agentDid: a[0].did }));
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    await createMandate(formData);
    setIsModalOpen(false);
    loadData();
  };

  const handleRevoke = async (id) => {
    await revokeMandate(id);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-emerald-400" />
            <span>W3C Verifiable Credential Mandates</span>
          </h2>
          <p className="text-xs text-slate-400">Spending rules, merchant category restrictions, and single transaction caps.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Issue VC Mandate</span>
        </button>
      </div>

      {/* Mandate Cards List */}
      <div className="space-y-4">
        {mandates.map((m) => (
          <div key={m.id} className="p-6 rounded-2xl glass-card border space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-white font-mono">{m.id}</span>
                  <VerificationBadge status={m.status} />
                </div>
                <p className="text-xs font-mono text-cyan-300">{m.agent_did}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInspectVc(m)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono flex items-center gap-1.5"
                >
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View JSON-LD</span>
                </button>
                {m.status === 'ACTIVE' && (
                  <button
                    onClick={() => handleRevoke(m.id)}
                    className="px-3 py-1.5 bg-red-950/50 hover:bg-red-900/60 border border-red-500/30 text-red-300 rounded-lg text-xs font-mono flex items-center gap-1.5"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                    <span>Revoke</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Single Tx Cap</span>
                <span className="text-emerald-400 font-bold text-base">${parseFloat(m.spending_limit_per_tx).toFixed(2)}</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Daily Spending Cap</span>
                <span className="text-emerald-400 font-bold text-base">${parseFloat(m.daily_spending_cap).toFixed(2)}</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Daily Spent / Remaining</span>
                <span className="text-cyan-300 font-bold text-base">
                  ${parseFloat(m.current_daily_spent || 0).toFixed(2)} / ${(parseFloat(m.daily_spending_cap) - parseFloat(m.current_daily_spent || 0)).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1 font-mono">
              <span>Allowed Merchants: <strong className="text-slate-200">{m.merchant_categories}</strong></span>
              <span>Expires: <strong className="text-slate-200">{new Date(m.expires_at).toLocaleDateString()}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Issue W3C Verifiable Credential Mandate">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Agent DID</label>
            <select
              value={formData.agentDid}
              onChange={(e) => setFormData({ ...formData, agentDid: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300 focus:outline-none"
            >
              {agents.map(a => (
                <option key={a.id} value={a.did}>{a.name} ({a.did.substring(0, 20)}...)</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Single Tx Cap ($)</label>
              <input
                type="number"
                required
                value={formData.maxSingleTx}
                onChange={(e) => setFormData({ ...formData, maxSingleTx: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Daily Cap ($)</label>
              <input
                type="number"
                required
                value={formData.dailyCap}
                onChange={(e) => setFormData({ ...formData, dailyCap: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Allowed Merchant Categories</label>
            <input
              type="text"
              value={formData.merchantCategories}
              onChange={(e) => setFormData({ ...formData, merchantCategories: e.target.value })}
              placeholder="e.g. fintech,escrow,micro-lending"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 font-bold rounded-xl text-xs text-slate-950 shadow-lg shadow-emerald-950/40"
          >
            Issue & Anchor VC Mandate
          </button>
        </form>
      </Modal>

      {/* JSON-LD Inspector Modal */}
      <Modal isOpen={!!inspectVc} onClose={() => setInspectVc(null)} title={`W3C VC Mandate Specification (${inspectVc?.id})`}>
        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto">
          {JSON.stringify({
            "@context": ["https://www.w3.org/2018/credentials/v1"],
            "id": inspectVc?.id,
            "type": ["VerifiableCredential", "AgentMandateCredential"],
            "issuer": "did:kya:authority:central-bank-mainnet",
            "issuanceDate": inspectVc?.created_at,
            "expirationDate": inspectVc?.expires_at,
            "credentialSubject": {
              "id": inspectVc?.agent_did,
              "spendingLimitPerTx": inspectVc?.spending_limit_per_tx,
              "dailySpendingCap": inspectVc?.daily_spending_cap,
              "allowedMerchants": inspectVc?.merchant_categories?.split(',')
            },
            "proof": {
              "type": "Ed25519Signature2020",
              "proofPurpose": "assertionMethod",
              "verificationMethod": "did:kya:authority:central-bank-mainnet#key-1",
              "jws": inspectVc?.vc_jwt
            }
          }, null, 2)}
        </pre>
      </Modal>
    </div>
  );
}
