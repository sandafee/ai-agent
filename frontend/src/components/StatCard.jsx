import React from 'react';

export default function StatCard({ title, value, subtext, icon: Icon, color = "cyan", trend }) {
  const colorMap = {
    cyan: "from-cyan-500/20 to-blue-500/5 text-cyan-400 border-cyan-500/30",
    emerald: "from-emerald-500/20 to-green-500/5 text-emerald-400 border-emerald-500/30",
    purple: "from-purple-500/20 to-indigo-500/5 text-purple-400 border-purple-500/30",
    amber: "from-amber-500/20 to-orange-500/5 text-amber-400 border-amber-500/30",
    red: "from-red-500/20 to-rose-500/5 text-red-400 border-red-500/30"
  };

  return (
    <div className={`p-5 rounded-2xl glass-card border bg-gradient-to-br ${colorMap[color] || colorMap.cyan} relative overflow-hidden group`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-current">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <h3 className="text-2xl font-black tracking-tight text-white font-mono">{value}</h3>
        {trend && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trend.startsWith('+') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
            {trend}
          </span>
        )}
      </div>

      {subtext && <p className="mt-1 text-xs text-slate-400 font-sans">{subtext}</p>}
    </div>
  );
}
