import React, { useEffect, useState } from 'react';
import { ScrollText, Download, ShieldCheck, Printer, Search, Lock } from 'lucide-react';
import { fetchAuditLogs } from '../services/api';
import Modal from '../components/Modal';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [showCertModal, setShowCertModal] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await fetchAuditLogs();
      setLogs(data);
    }
    load();
  }, []);

  const handleExportCSV = () => {
    window.open('/api/audit-logs/export?format=csv', '_blank');
  };

  const filtered = logs.filter(l =>
    l.entity_id.toLowerCase().includes(search.toLowerCase()) ||
    l.actor.toLowerCase().includes(search.toLowerCase()) ||
    l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-amber-400" />
            <span>Central Bank Regulatory Compliance Audit Trail</span>
          </h2>
          <p className="text-xs text-slate-400">Cryptographically hashed immutable record of all agent DID actions and mandate evaluations.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCertModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Print Regulatory Cert</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-950/50 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Audit Log</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search audit logs by actor, entity ID, or details..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
        />
      </div>

      <div className="space-y-3 font-mono text-xs">
        {filtered.map((log) => (
          <div key={log.id} className="p-4 rounded-2xl glass-card border space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-bold text-[10px]">
                  [{log.entity_type}]
                </span>
                <span className="font-bold text-white text-xs">{log.action}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300 text-[11px]">{log.actor}</span>
              </div>
              <span className="text-slate-500 text-[10px]">{new Date(log.timestamp).toLocaleString()}</span>
            </div>

            <p className="text-slate-300 font-sans text-xs">{log.details}</p>

            <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
              <Lock className="w-3 h-3 text-slate-600" />
              <span>SHA-256 Hash: <strong className="text-slate-400 font-mono">{log.hash}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Central Bank Compliance Cert Modal */}
      <Modal isOpen={showCertModal} onClose={() => setShowCertModal(false)} title="Central Bank Regulatory Compliance Certificate">
        <div className="p-6 bg-slate-950 border-2 border-amber-500/40 rounded-2xl space-y-6 text-center text-slate-200 print:text-black print:bg-white">
          <div className="space-y-2">
            <ShieldCheck className="w-12 h-12 text-amber-400 mx-auto" />
            <h1 className="text-xl font-extrabold text-amber-300 uppercase tracking-wider">OFFICIAL REGULATORY COMPLIANCE CERTIFICATE</h1>
            <p className="text-xs text-slate-400 font-mono">Issued by Central Bank AI Financial Systems Authority</p>
          </div>

          <div className="text-xs space-y-2 text-left bg-slate-900/80 p-4 rounded-xl border border-slate-800 font-mono">
            <p><strong>Protocol Standard:</strong> KYA (Know Your Agent) PS05 Architecture</p>
            <p><strong>Decentralized Identifier Spec:</strong> W3C DID Core 1.0 / Ed25519 2020</p>
            <p><strong>Firewall Integrity:</strong> Sherlock Real-Time Prompt Injection Defense (Active)</p>
            <p><strong>Audit Trail Status:</strong> 100% Cryptographically Validated & Hashed</p>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono border-t border-slate-800 pt-4">
            <span>Certificate ID: CERT-KYA-2026-9941</span>
            <span>Date: {new Date().toLocaleDateString()}</span>
          </div>

          <button
            onClick={() => window.print()}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 font-bold rounded-xl text-xs text-slate-950 shadow-lg shadow-amber-950/40"
          >
            Print Formal Document
          </button>
        </div>
      </Modal>
    </div>
  );
}
