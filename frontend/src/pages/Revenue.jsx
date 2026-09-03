import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, CreditCard, ShieldCheck, Activity } from 'lucide-react';
import { fetchRevenue } from '../services/api';
import StatCard from '../components/StatCard';

export default function Revenue() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const rev = await fetchRevenue();
      setData(rev);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-emerald-400" />
          <span>Platform Revenue & Transaction Fee Analytics</span>
        </h2>
        <p className="text-xs text-slate-400">KYA Security & Authorization Protocol Monetization Model.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Total Platform Protocol Fees"
          value={`$${(data?.totalEarnings || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtext="Net 1.0% KYA Security Fee"
          icon={DollarSign}
          color="emerald"
          trend="+34%"
        />
        <StatCard
          title="Total Processed Volume"
          value={`$${(data?.totalVolumeProcessed || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtext="Through Verified Agents"
          icon={TrendingUp}
          color="cyan"
        />
        <StatCard
          title="Effective Fee Rate"
          value={`${data?.feeRatePercent || 1.0}%`}
          subtext="Per Authorized Transaction"
          icon={CreditCard}
          color="purple"
        />
      </div>

      <div className="p-6 rounded-2xl glass-panel space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Agent Revenue Distribution Breakdown</span>
        </h3>

        <div className="space-y-3 font-mono text-xs">
          {data?.history?.map((item) => (
            <div key={item.id} className="p-4 rounded-xl glass-card border flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-200 block text-xs">{item.agent_did}</span>
                <span className="text-slate-400 text-[11px]">Period: {item.period_date}</span>
              </div>
              <div className="text-right">
                <span className="text-emerald-400 font-bold block text-sm">+${parseFloat(item.transaction_fees_earned).toFixed(2)} USD</span>
                <span className="text-slate-500 text-[10px]">Volume: ${parseFloat(item.volume_processed).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
