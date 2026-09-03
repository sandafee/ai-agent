import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function VerificationBadge({ status }) {
  const normalized = (status || '').toUpperCase();

  if (normalized === 'ACTIVE' || normalized === 'APPROVED' || normalized === 'ISSUED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>{status}</span>
      </span>
    );
  }

  if (normalized === 'SUSPENDED' || normalized === 'EXPIRED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        <span>{status}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/15 border border-red-500/30 text-red-300">
      <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
      <span>{status}</span>
    </span>
  );
}
