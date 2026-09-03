import React, { useEffect, useState } from 'react';
import { Bot, Plus, Search, ShieldCheck, ChevronRight, Key } from 'lucide-react';
import { fetchAgents, createAgent } from '../services/api';
import VerificationBadge from '../components/VerificationBadge';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', ownerAddress: '', riskScore: 10 });
  const navigate = useNavigate();

  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    const data = await fetchAgents();
    setAgents(data);
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    await createAgent(formData);
    setIsModalOpen(false);
    setFormData({ name: '', description: '', ownerAddress: '', riskScore: 10 });
    loadAgents();
  };

  const filtered = agents.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.did.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-cyan-400" />
            <span>AI Agent Identity Registry (DIDs)</span>
          </h2>
          <p className="text-xs text-slate-400">Cryptographically verifiable W3C DIDs linked to legal human principals.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-cyan-950/50 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Agent DID</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by agent name or DID string..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Agents Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((agent) => (
          <div
            key={agent.id}
            onClick={() => navigate(`/agents/${encodeURIComponent(agent.did)}`)}
            className="p-5 rounded-2xl glass-card border border-slate-800 space-y-4 cursor-pointer hover:border-cyan-500/40 transition-all group"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">{agent.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{agent.description}</p>
              </div>
              <VerificationBadge status={agent.status} />
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 font-mono text-[11px] text-cyan-300 truncate">
              {agent.did}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <Key className="w-3 h-3 text-slate-500" />
                {agent.owner_address ? `${agent.owner_address.substring(0, 8)}...` : 'Unknown'}
              </span>
              <span className="text-cyan-400 font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                Details <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Register Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Autonomous Agent DID">
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Agent Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Apex Escrow Settlement Bot"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Primary autonomous function and financial scope..."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Legal Owner / Controller Address</label>
            <input
              type="text"
              required
              value={formData.ownerAddress}
              onChange={(e) => setFormData({ ...formData, ownerAddress: e.target.value })}
              placeholder="0x... or Solana PubKey"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 font-bold rounded-xl text-xs text-slate-950 shadow-lg shadow-cyan-950/40"
          >
            Generate & Issue W3C DID
          </button>
        </form>
      </Modal>
    </div>
  );
}
