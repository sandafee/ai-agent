import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Modal from './components/Modal';
import PromptScanner from './components/PromptScanner';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Agents from './pages/Agents';
import AgentDetails from './pages/AgentDetails';
import Mandates from './pages/Mandates';
import Transactions from './pages/Transactions';
import Revenue from './pages/Revenue';
import Analytics from './pages/Analytics';
import AuditLogs from './pages/AuditLogs';

export default function App() {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('kya_user');
      return stored ? JSON.parse(stored) : {
        id: 'usr_regulator_01',
        name: 'Central Bank Regulator',
        role: 'REGULATOR',
        email: 'regulator@centralbank.gov',
        organization: 'Central Bank AI Authority Root',
        walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        did: 'did:kya:authority:central-bank-mainnet'
      };
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (user, token) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('kya_user', JSON.stringify(user));
      localStorage.setItem('kya_token', token);
    } catch (e) {
      console.warn('Storage warning:', e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('kya_user');
      localStorage.removeItem('kya_token');
    } catch (e) {
      console.warn('Storage clear warning:', e);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        
        <Route
          path="/*"
          element={
            currentUser ? (
              <div className="flex min-h-screen bg-[#080c14] text-slate-100 font-['Outfit',sans-serif]">
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0">
                  <Navbar
                    onOpenScanner={() => setIsScannerOpen(true)}
                    currentUser={currentUser}
                    onLogout={handleLogout}
                  />
                  <main className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto">
                    <Routes>
                      <Route path="/" element={<Dashboard onOpenScanner={() => setIsScannerOpen(true)} />} />
                      <Route path="/agents" element={<Agents />} />
                      <Route path="/agents/:did" element={<AgentDetails />} />
                      <Route path="/mandates" element={<Mandates />} />
                      <Route path="/transactions" element={<Transactions />} />
                      <Route path="/revenue" element={<Revenue />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/audit-logs" element={<AuditLogs />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>

                {/* Global Sherlock Prompt Scanner Modal */}
                <Modal
                  isOpen={isScannerOpen}
                  onClose={() => setIsScannerOpen(false)}
                  title="Sherlock Real-Time Prompt Injection & Threat Scanner"
                >
                  <PromptScanner />
                </Modal>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}
