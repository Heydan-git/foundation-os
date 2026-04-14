import { motion } from "motion/react";
import { Wallet, Send, ArrowDownToLine, QrCode, Copy, Eye, EyeOff, ShieldCheck, History, TrendingUp, CircleDollarSign, Plus } from "lucide-react";
import { useState } from "react";

const ASSETS = [
  { symbol: "ETH", name: "Ethereum", balance: "124.50", usd: "$429,525.00", change: "+5.2%", color: "text-blue-400", bg: "bg-blue-500", glow: "shadow-[0_0_15px_rgba(59,130,246,0.3)]", icon: CircleDollarSign },
  { symbol: "NEXUS", name: "Nexus Token", balance: "45,200", usd: "$90,400.00", change: "+12.4%", color: "text-purple-400", bg: "bg-purple-500", glow: "shadow-[0_0_15px_rgba(168,85,247,0.3)]", icon: Wallet },
  { symbol: "USDC", name: "USD Coin", balance: "15,000", usd: "$15,000.00", change: "0.0%", color: "text-emerald-400", bg: "bg-emerald-500", glow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]", icon: CircleDollarSign },
];

export function DashboardWallet() {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col gap-4 mb-10 border-b border-white/[0.05] pb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] w-fit mb-2">
          <Wallet size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-white/70">Portefeuille Sécurisé</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40">
              Vos Actifs
            </h1>
            <p className="text-white/40 text-sm mt-2 max-w-lg leading-relaxed">
              Gérez votre trésorerie, vos stakings et visualisez les rendements de vos nœuds de calcul.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] text-white/90 text-sm font-medium transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] active:scale-[0.98] flex items-center gap-2">
              <QrCode size={14} /> Scan
            </button>
            <button className="px-4 py-2.5 rounded-lg bg-white text-black hover:bg-white/90 text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2),inset_0_-2px_0_rgba(0,0,0,0.2)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4),inset_0_-2px_0_rgba(0,0,0,0.2)] active:scale-[0.98]">
              <Plus size={14} strokeWidth={2} /> Acheter
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Balance Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 rounded-2xl bg-[#0a0a0a]/75 backdrop-blur-2xl border border-white/[0.05] p-8 relative overflow-hidden group hover:border-white/[0.08] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-500"
        >
          <div className="absolute top-[-30%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="flex justify-between items-start mb-10 relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-3 mb-2">
                <p className="text-[10px] uppercase tracking-wider text-white/40 font-mono">Solde Total Estimé</p>
                <button onClick={() => setShowBalance(!showBalance)} className="text-white/30 hover:text-white/90 transition-colors p-1 bg-white/[0.03] rounded-md border border-white/[0.05]">
                  {showBalance ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
              </div>
              <div className="flex flex-wrap items-end gap-4">
                <span className="text-5xl font-medium tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
                  {showBalance ? "$534,925.00" : "••••••••"}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] mb-2">
                  <TrendingUp size={12} /> +2.4% (24h)
                </span>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-2 bg-[#050505] border border-white/[0.08] px-3 py-1.5 rounded-lg shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] hover:border-white/[0.15] cursor-pointer transition-all group/address">
              <span className="text-xs font-mono text-white/60 group-hover/address:text-white/90">0x44f2...a94c</span>
              <Copy size={12} className="text-white/30 group-hover/address:text-white/70" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10 border-t border-white/[0.05] pt-8">
            {[
              { label: "Recevoir", icon: ArrowDownToLine, color: "text-blue-400", bg: "bg-blue-500/10 hover:bg-blue-500/20", border: "border-blue-500/20" },
              { label: "Envoyer", icon: Send, color: "text-purple-400", bg: "bg-purple-500/10 hover:bg-purple-500/20", border: "border-purple-500/20" },
              { label: "Historique", icon: History, color: "text-emerald-400", bg: "bg-emerald-500/10 hover:bg-emerald-500/20", border: "border-emerald-500/20" },
              { label: "Staking", icon: ShieldCheck, color: "text-amber-400", bg: "bg-amber-500/10 hover:bg-amber-500/20", border: "border-amber-500/20" },
            ].map((action, i) => (
              <button key={i} className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl bg-transparent hover:bg-[#050505] border border-transparent hover:border-white/[0.08] transition-all group/btn">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${action.bg} ${action.border}`}>
                  <action.icon size={16} className={action.color} />
                </div>
                <span className="text-xs font-medium text-white/60 group-hover/btn:text-white/90">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Network Info */}
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="rounded-2xl bg-[#0a0a0a]/75 backdrop-blur-2xl border border-white/[0.05] p-8 relative overflow-hidden group hover:border-white/[0.08] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-500 flex flex-col justify-between"
        >
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6 border-b border-white/[0.05] pb-4">
              <p className="text-[10px] uppercase tracking-wider text-white/40 font-mono">Connexion</p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" /> 
                Mainnet
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="flex justify-between items-end">
                <span className="text-xs text-white/40 font-mono">Statut du Nœud</span>
                <span className="text-emerald-400 text-sm font-medium">Synchronisé</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs text-white/40 font-mono">Gaz Actuel</span>
                <span className="text-white/80 font-mono text-sm">14.5 Gwei</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs text-white/40 font-mono">Dernier Bloc</span>
                <span className="text-blue-400 font-mono text-sm">18493201</span>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 mt-8 pt-6 border-t border-white/[0.05]">
            <div className="bg-[#050505] border border-white/[0.08] p-4 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]">
              <p className="text-[10px] uppercase tracking-wider text-white/40 font-mono mb-3">Sécurité Portefeuille</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-400">Optimale</span>
                <div className="flex gap-1.5">
                  <div className="w-6 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <div className="w-6 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <div className="w-6 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <div className="w-6 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Assets List */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="rounded-2xl bg-[#0a0a0a]/75 backdrop-blur-2xl border border-white/[0.05] p-8 relative overflow-hidden group hover:border-white/[0.08] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-500"
      >
        <div className="absolute top-1/2 left-[20%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="flex items-center justify-between mb-6 relative z-10 border-b border-white/[0.05] pb-6">
          <p className="text-[10px] uppercase tracking-wider text-white/40 font-mono">Inventaire</p>
          <button className="text-sm font-medium text-white/40 hover:text-white/90 transition-colors">Gérer les jetons →</button>
        </div>
        
        <div className="space-y-2 relative z-10">
          {ASSETS.map((asset, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-transparent hover:bg-[#050505] border border-transparent hover:border-white/[0.08] transition-all cursor-pointer group/asset">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${asset.bg} ${asset.glow} border border-white/10 group-hover/asset:scale-110 transition-transform`}>
                  <asset.icon size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white/90 group-hover/asset:text-white transition-colors">{asset.name}</h3>
                  <p className="text-[11px] text-white/40 font-mono mt-0.5">{asset.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white/90 font-mono">
                  {showBalance ? asset.balance : "••••••"}
                </p>
                <div className="flex items-center justify-end gap-2 text-xs mt-1">
                  <span className="text-white/40 font-mono">{showBalance ? asset.usd : "••••"}</span>
                  {asset.change !== "0.0%" && (
                    <span className="text-emerald-400 font-mono">{asset.change}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}