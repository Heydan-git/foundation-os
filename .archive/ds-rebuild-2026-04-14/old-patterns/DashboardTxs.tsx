import { motion } from "motion/react";
import { ArrowUpRight, ArrowDownLeft, Clock, Filter, Search, Download, MoreVertical, RefreshCw, Activity } from "lucide-react";

const TRANSACTIONS = [
  { id: "0x12..a94", type: "Inférence Llama 3", typeLabel: "API Call", amount: "-1.24 ETH", usd: "$3,450.12", status: "success", time: "Il y a 2 min", block: "18,493,201", from: "0x44..f2a", to: "Nexus Router" },
  { id: "0x9f..2b1", type: "Récompense Validation", typeLabel: "Mining", amount: "+0.45 ETH", usd: "$1,250.80", status: "success", time: "Il y a 1 h", block: "18,493,180", from: "Staking Pool", to: "Vous" },
  { id: "0x3c..8e7", type: "Entraînement Nœud", typeLabel: "Compute", amount: "-5.00 ETH", usd: "$13,900.50", status: "pending", time: "Il y a 3 h", block: "En attente", from: "Vous", to: "Training Cluster" },
  { id: "0x7a..0d3", type: "Frais d'accès API", typeLabel: "API Call", amount: "-0.15 ETH", usd: "$417.02", status: "success", time: "Il y a 5 h", block: "18,493,002", from: "0x44..f2a", to: "Nexus Router" },
  { id: "0xb4..e92", type: "Mise en jeu (Staking)", typeLabel: "Staking", amount: "-10.00 ETH", usd: "$27,801.00", status: "success", time: "Il y a 1 j", block: "18,489,450", from: "Vous", to: "Staking Contract" },
  { id: "0x2d..9c4", type: "Distribution Token", typeLabel: "Airdrop", amount: "+250 NEXUS", usd: "$500.00", status: "success", time: "Il y a 2 j", block: "18,485,112", from: "Treasury", to: "Vous" },
  { id: "0xe1..5a8", type: "Retrait", typeLabel: "Transfer", amount: "-2.50 ETH", usd: "$6,950.25", status: "failed", time: "Il y a 3 j", block: "18,480,999", from: "Vous", to: "Exchange" },
];

export function DashboardTxs() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col gap-3 mb-6 border-b border-white/[0.05] pb-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] w-fit mb-1 backdrop-blur-md">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
          <span className="text-[10px] font-mono tracking-wider text-emerald-400 uppercase">LEDGER NET</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40">
              Transactions
            </h1>
            <p className="text-white/40 text-xs mt-1 max-w-lg leading-relaxed">
              Historique immuable de vos activités réseau et d'intelligence artificielle.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] text-white/90 text-xs font-medium transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_15px_rgba(255,255,255,0.03)] active:scale-[0.98] flex items-center gap-1.5">
              <Download size={12} /> Exporter
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-xl bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/[0.05] p-5 relative overflow-hidden group hover:border-white/[0.08] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-500"
      >
        {/* Glow Effects */}
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[80px] rounded-full pointer-events-none mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5 relative z-10 border-b border-white/[0.05] pb-5 pt-2">
          <div className="relative w-full sm:w-64 group/search">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-md blur opacity-0 group-focus-within/search:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 text-white/30 group-focus-within/search:text-blue-400 transition-colors" size={12} />
              <input 
                type="text" 
                placeholder="Rechercher (Tx, Adresse...)" 
                className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-md pl-7 pr-3 py-1.5 text-xs text-white/90 placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] transition-all"
              />
              <div className="absolute right-2 px-1 py-0.5 rounded border border-white/10 bg-white/5 text-[8px] text-white/40 font-mono hidden sm:block">
                ⌘K
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-3 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] text-white/70 text-xs flex items-center justify-center gap-1.5 transition-all">
              <Filter size={12} /> Filtrer
            </button>
            <button className="flex-1 sm:flex-none px-3 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] text-white/70 text-xs flex items-center justify-center gap-1.5 transition-all">
              <RefreshCw size={12} /> Sync
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[9px] uppercase tracking-wider text-white/40 font-mono border-b border-white/[0.05]">
                <th className="pb-3 px-3 font-medium">Transaction</th>
                <th className="pb-3 px-3 font-medium">Type</th>
                <th className="pb-3 px-3 font-medium">Réseau / Bloc</th>
                <th className="pb-3 px-3 font-medium text-right">Montant</th>
                <th className="pb-3 px-3 font-medium text-right">Statut</th>
                <th className="pb-3 px-3 font-medium text-center"></th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {TRANSACTIONS.map((tx, i) => (
                <tr key={i} className="border-b border-white/[0.02] hover:bg-[#050505] transition-colors group/row cursor-pointer">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="relative flex items-center justify-center w-8 h-8 rounded-md bg-[#050505] border border-white/[0.08] shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] group-hover/row:border-white/[0.15] transition-colors">
                        {tx.amount.startsWith('+') ? (
                          <ArrowDownLeft size={14} className="text-emerald-400" />
                        ) : tx.amount.startsWith('-') ? (
                          <ArrowUpRight size={14} className="text-rose-400" />
                        ) : (
                          <Clock size={14} className="text-amber-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white/90 font-medium group-hover/row:text-white transition-colors">{tx.type}</p>
                        <div className="flex items-center gap-2 text-[9px] text-white/40 mt-0.5 font-mono">
                          <span className="text-blue-400/80">{tx.id}</span> • {tx.time}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-white/60">
                      {tx.typeLabel}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-white/70 text-[11px] font-mono">{tx.from} → {tx.to}</p>
                    <p className="text-[9px] text-white/30 font-mono mt-0.5">Bloc: {tx.block}</p>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <p className={`font-medium font-mono text-[11px] ${tx.amount.startsWith('+') ? 'text-emerald-400' : 'text-white/90'}`}>
                      {tx.amount}
                    </p>
                    <p className="text-[9px] text-white/40 mt-0.5 font-mono">{tx.usd}</p>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex justify-end">
                      {tx.status === "success" ? (
                        <span className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                          <div className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> OK
                        </span>
                      ) : tx.status === "pending" ? (
                        <span className="flex items-center gap-1.5 text-[9px] font-mono text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                          <div className="w-1 h-1 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" /> WAIT
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[9px] font-mono text-rose-400 px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]">
                          <div className="w-1 h-1 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]" /> FAIL
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button className="text-white/30 hover:text-white/90 p-1 rounded hover:bg-white/[0.08] transition-all border border-transparent hover:border-white/[0.05]">
                      <MoreVertical size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination/Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.05] relative z-10">
          <p className="text-[10px] text-white/40 font-mono">Affichage de 7 / 124 txs</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-md border border-white/[0.08] bg-[#050505] text-[10px] font-medium text-white/40 hover:text-white/90 hover:border-white/[0.15] transition-all disabled:opacity-50">
              Précédent
            </button>
            <button className="px-3 py-1.5 rounded-md border border-white/[0.08] bg-[#050505] text-[10px] font-medium text-white/40 hover:text-white/90 hover:border-white/[0.15] transition-all">
              Suivant
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}