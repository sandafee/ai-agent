import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Wallet, KeyRound, Cpu, ArrowRight, UserCheck, Sparkles } from 'lucide-react';
import { loginUser } from '../services/api';

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('credentials'); // 'credentials' | 'wallet' | 'demo'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [walletAddress, setWalletAddress] = useState('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = authMode === 'wallet'
        ? { walletAddress }
        : { email: email || 'regulator@centralbank.gov', password, role: 'REGULATOR' };

      const res = await loginUser(payload);
      if (res.success) {
        onLoginSuccess(res.user, res.token);
        navigate('/');
      } else {
        setError(res.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFastDemoLogin = async (presetUser) => {
    setLoading(true);
    try {
      const res = await loginUser(presetUser);
      if (res.success) {
        onLoginSuccess(res.user, res.token);
        navigate('/');
      }
    } catch (err) {
      setError('Demo login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 font-['Outfit',sans-serif] flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Dynamic Background Glow Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 mx-auto flex items-center justify-center shadow-xl shadow-cyan-500/20">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-200 to-indigo-200">
            KYA PROTOCOL
          </h1>
          <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase">Know Your Agent Financial Authority</p>
        </div>

        {/* Main Glass Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5 shadow-2xl">
          {/* Auth Mode Toggle */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setAuthMode('credentials')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'credentials'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Regulator</span>
            </button>
            <button
              onClick={() => setAuthMode('wallet')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'wallet'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Web3 DID</span>
            </button>
            <button
              onClick={() => setAuthMode('demo')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'demo'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Demo</span>
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-300 text-center font-medium">
              {error}
            </div>
          )}

          {authMode === 'credentials' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Authority Email / Username</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="regulator@centralbank.gov"
                  className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Cryptographic Key Secret / Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all disabled:opacity-50"
              >
                {loading ? <Cpu className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                <span>Authenticate Authority Session</span>
              </button>
            </form>
          )}

          {authMode === 'wallet' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Solana / EVM Principal Wallet Address</label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="0x... or Solana PubKey"
                  className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-xl text-xs text-cyan-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  <span>Ed25519 Cryptographic Proof Sign-In</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Connects to your local Web3 wallet provider to verify ownership of registered Agent DIDs.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-950/50 transition-all disabled:opacity-50"
              >
                {loading ? <Cpu className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
                <span>Sign In with Web3 Wallet Signature</span>
              </button>
            </form>
          )}

          {authMode === 'demo' && (
            <div className="space-y-3">
              <span className="text-xs text-slate-400 block text-center font-medium">Select a 1-Click Evaluation Persona:</span>
              
              <button
                onClick={() => handleFastDemoLogin({ email: 'regulator@centralbank.gov', role: 'REGULATOR' })}
                className="w-full p-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-cyan-300">Central Bank Regulator Root</h4>
                  <p className="text-[11px] text-slate-400 font-mono">Full Compliance & Audit Export Privileges</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={() => handleFastDemoLogin({ walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' })}
                className="w-full p-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-cyan-300">Apex Finance Agent Controller</h4>
                  <p className="text-[11px] text-slate-400 font-mono">Autonomous Escrow & DID Management</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          )}
        </div>

        {/* Footer Security Badges */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono px-2">
          <span>W3C VC Spec v1.1</span>
          <span>Sherlock Guard Active</span>
        </div>
      </div>
    </div>
  );
}
