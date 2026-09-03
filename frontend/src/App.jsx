import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Modal from './components/Modal';
import PromptScanner from './components/PromptScanner';

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

  return (
    <Router>
      <div className="flex min-h-screen bg-[#080c14] text-slate-100 font-['Outfit',sans-serif]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar onOpenScanner={() => setIsScannerOpen(true)} />
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
    </Router>
  );
}
