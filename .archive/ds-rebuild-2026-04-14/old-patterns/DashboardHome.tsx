import { 
  Activity, 
  Zap, 
  ArrowUpRight,
  Database,
  Cpu,
  Network,
  ShieldAlert,
  BarChart3,
  Copy,
  Hexagon
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { motion } from "motion/react";

const DATA = [
  { name: "Jan", balance: 4000, aiUsage: 2400 },
  { name: "Fév", balance: 3000, aiUsage: 1398 },
  { name: "Mar", balance: 2000, aiUsage: 9800 },
  { name: "Avr", balance: 2780, aiUsage: 3908 },
  { name: "Mai", balance: 1890, aiUsage: 4800 },
  { name: "Juin", balance: 2390, aiUsage: 3800 },
  { name: "Juil", balance: 3490, aiUsage: 4300 },
];

const TRANSACTIONS = [
  { id: "1", type: "Inférence Llama 3", hash: "0x12...a94", amount: "-1.24 ETH", status: "success", time: "2 min" },
  { id: "2", type: "Récompense Validation", hash: "0x9f...2b1", amount: "+0.45 ETH", status: "success", time: "1 h" },
  { id: "3", type: "Entraînement Nœud", hash: "0x3c...8e7", amount: "-5.00 ETH", status: "pending", time: "3 h" },
  { id: "4", type: "Frais d'accès API", hash: "0x7a...0d3", amount: "-0.15 ETH", status: "success", time: "5 h" },
  { id: "5", type: "Mise en jeu (Staking)", hash: "0xb4...e92", amount: "-10.00 ETH", status: "success", time: "1 j" },
];

const AGENT_TASKS = [
  { name: "Analyse des sentiments de marché", status: "En cours", progress: 78, model: "GPT-4o" },
  { name: "Optimisation de smart contract", status: "En attente", progress: 0, model: "Claude 3" },
  { name: "Génération d'images (batch)", status: "Terminé", progress: 100, model: "Midjourney v6" },
  { name: "Arbitrage DeFi", status: "Actif", progress: 45, model: "Custom AI" },
];

export function DashboardHome() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col gap-3 mb-6 border-b border-white/[0.05] pb-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.05] w-fit mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
          <span className="text-[10px] font-mono tracking-wider text-white/70">SYNC: 100%</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40">
              Vue d'ensemble
            </h1>
            <p className="text-white/40 text-xs mt-1 max-w-lg leading-relaxed">
              Surveillance globale de votre écosystème Nexus. Performances IA et transactions en temps réel.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] text-white/90 text-xs font-medium transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] active:scale-[0.98]">
              Exporter CSV
            </button>
            <button className="px-3 py-1.5 rounded-md bg-white text-black hover:bg-white/90 text-xs font-medium transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.2)] active:scale-[0.98]">
              <Zap size={12} strokeWidth={2} /> Déployer
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Solde Total", value: "$534,925", change: "+12.4%", glow: "bg-blue-500/10", icon: Hexagon, iconColor: "text-blue-400" },
          { title: "Volume API (24h)", value: "5.6M", change: "+8.2%", glow: "bg-purple-500/10", icon: Activity, iconColor: "text-purple-400" },
          { title: "Nœuds Actifs", value: "24", change: "+2", glow: "bg-emerald-500/10", icon: Network, iconColor: "text-emerald-400" },
          { title: "Latence Moyenne", value: "24ms", change: "-2ms", glow: "bg-rose-500/10", icon: Zap, iconColor: "text-rose-400" }
        ].map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -2 }}
            key={i}
            className="p-5 rounded-xl bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/[0.05] relative overflow-hidden group hover:border-white/[0.1] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-500"
          >
            {/* Glow Effects */}
            <div className={`absolute top-[10%] right-[10%] w-[30%] h-[30%] ${stat.glow} blur-[30px] rounded-full pointer-events-none mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-3">
                <div className="w-8 h-8 rounded-md bg-[#050505] border border-white/[0.08] flex items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
                  <stat.icon size={14} className={stat.iconColor} />
                </div>
                <span className="flex items-center gap-0.5 text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  <ArrowUpRight size={10} /> {stat.change}
                </span>
              </div>
              <p className="text-[9px] uppercase tracking-wider text-white/40 font-mono mb-1">{stat.title}</p>
              <p className="text-2xl font-medium tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Chart Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="lg:col-span-2 rounded-xl bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/[0.05] p-5 relative overflow-hidden group hover:border-white/[0.08] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-500"
        >
          {/* Glow Effects */}
          <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[80px] rounded-full pointer-events-none mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="flex items-center justify-between mb-6 relative z-10 border-b border-white/[0.05] pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-[1px] bg-gradient-to-r from-blue-500 to-transparent" />
                <p className="text-[9px] uppercase tracking-wider text-white/40 font-mono">Network Activity</p>
              </div>
              <h2 className="text-sm font-medium text-white/90">Portefeuille & Inférence IA</h2>
            </div>
            <div className="flex items-center gap-2 bg-[#050505] p-1 rounded-md border border-white/[0.05]">
              <button className="px-2.5 py-1 text-[10px] font-medium bg-white/[0.08] text-white rounded shadow-[0_1px_5px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]">7j</button>
              <button className="px-2.5 py-1 text-[10px] font-medium text-white/40 hover:text-white/70 rounded transition-colors">30j</button>
              <button className="px-2.5 py-1 text-[10px] font-medium text-white/40 hover:text-white/70 rounded transition-colors">1a</button>
            </div>
          </div>

          <div className="h-[250px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', boxShadow: '0 8px 30px rgba(0,0,0,0.5)', fontSize: '11px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={1.5} fillOpacity={1} fill="url(#colorBalance)" />
                <Area type="monotone" dataKey="aiUsage" stroke="#a855f7" strokeWidth={1.5} fillOpacity={1} fill="url(#colorAi)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* AI Agents Side Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="rounded-xl bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/[0.05] p-5 relative overflow-hidden group hover:border-white/[0.08] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-500"
        >
          {/* Glow Effects */}
          <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[80px] rounded-full pointer-events-none mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="flex items-center justify-between mb-5 relative z-10 pt-2 border-b border-white/[0.05] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-[1px] bg-gradient-to-r from-purple-500 to-transparent" />
              <h2 className="text-sm font-medium text-white/90">Agents Actifs</h2>
            </div>
            <button className="text-white/40 hover:text-white/90 transition-colors p-1 bg-white/[0.02] rounded border border-white/[0.05]"><ArrowUpRight size={10} /></button>
          </div>

          <div className="space-y-3 relative z-10">
            {AGENT_TASKS.map((task, i) => (
              <div key={i} className="p-3 rounded-lg bg-[#050505] border border-white/[0.05] hover:border-white/[0.1] hover:shadow-[0_2px_10px_rgba(0,0,0,0.3)] transition-all group/agent cursor-pointer relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-[11px] font-medium text-white/90 group-hover/agent:text-white transition-colors">{task.name}</h4>
                    <p className="text-[9px] text-white/40 font-mono mt-0.5">{task.model}</p>
                  </div>
                  {task.progress === 100 ? (
                    <span className="flex items-center gap-1 text-[8px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded">Terminé</span>
                  ) : task.progress === 0 ? (
                    <span className="flex items-center gap-1 text-[8px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded">Attente</span>
                  ) : (
                    <span className="flex items-center gap-1 text-[8px] font-mono text-blue-400 bg-blue-400/10 border border-blue-400/20 px-1.5 py-0.5 rounded">
                      <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse shadow-[0_0_5px_rgba(96,165,250,0.8)]" /> 
                      {task.progress}%
                    </span>
                  )}
                </div>
                <div className="h-1 w-full bg-white/[0.03] rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full relative ${
                      task.progress === 100 ? 'bg-emerald-400' : 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                    }`} 
                    style={{ width: `${task.progress}%` }} 
                  >
                     {task.progress > 0 && task.progress < 100 && (
                       <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[1px]" />
                     )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Transactions List */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="rounded-xl bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/[0.05] p-5 relative overflow-hidden group hover:border-white/[0.08] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-500"
      >
        {/* Glow Effects */}
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[80px] rounded-full pointer-events-none mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="flex items-center justify-between mb-5 relative z-10 border-b border-white/[0.05] pb-4 pt-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-[1px] bg-gradient-to-r from-emerald-500 to-transparent" />
              <p className="text-[9px] uppercase tracking-wider text-white/40 font-mono">Ledger</p>
            </div>
            <h2 className="text-sm font-medium text-white/90">Dernières Activités</h2>
          </div>
          <button className="text-xs font-medium text-white/40 hover:text-white/90 transition-colors">Voir tout →</button>
        </div>

        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[9px] uppercase tracking-wider text-white/40 font-mono border-b border-white/[0.05]">
                <th className="pb-3 px-3 font-medium">Transaction</th>
                <th className="pb-3 px-3 font-medium">Hash</th>
                <th className="pb-3 px-3 font-medium text-right">Montant</th>
                <th className="pb-3 px-3 font-medium text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {TRANSACTIONS.map((tx, i) => (
                <tr key={i} className="border-b border-white/[0.02] hover:bg-[#050505] transition-colors group/row">
                  <td className="py-3 px-3">
                    <p className="text-white/90 font-medium group-hover/row:text-white transition-colors">{tx.type}</p>
                    <p className="text-[10px] text-white/40 font-mono mt-0.5">{tx.time}</p>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <code className="px-1.5 py-0.5 rounded bg-[#050505] border border-white/[0.05] text-[10px] text-blue-400/90 font-mono shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
                        {tx.hash}
                      </code>
                      <button className="text-white/30 hover:text-white/90 transition-colors p-0.5"><Copy size={10} /></button>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-[11px]">
                    <span className={tx.amount.startsWith('+') ? 'text-emerald-400/90' : 'text-white/90'}>
                      {tx.amount}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex justify-end">
                      {tx.status === "success" ? (
                        <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                          <div className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> OK
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[9px] font-mono text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                          <div className="w-1 h-1 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" /> WAIT
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      
    </div>
  );
}