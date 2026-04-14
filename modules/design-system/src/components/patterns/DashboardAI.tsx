import { motion } from "motion/react";
import { Cpu, Activity, Zap, Database, Brain, Network, Bot, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";

const PERFORMANCE_DATA = [
  { time: "00:00", gpt4: 120, claude: 80, llama: 250 },
  { time: "04:00", gpt4: 150, claude: 90, llama: 300 },
  { time: "08:00", gpt4: 400, claude: 200, llama: 500 },
  { time: "12:00", gpt4: 800, claude: 450, llama: 900 },
  { time: "16:00", gpt4: 650, claude: 380, llama: 750 },
  { time: "20:00", gpt4: 300, claude: 150, llama: 400 },
  { time: "24:00", gpt4: 140, claude: 85, llama: 280 },
];

const MODELS = [
  { name: "GPT-4o", status: "Actif", load: "42%", loadNum: 42, latency: "230ms", requests: "1.2M", icon: Brain, color: "text-purple-400", bg: "bg-purple-500", glow: "from-purple-500 to-indigo-500" },
  { name: "Claude 3.5", status: "Actif", load: "28%", loadNum: 28, latency: "180ms", requests: "850K", icon: Bot, color: "text-orange-400", bg: "bg-orange-500", glow: "from-orange-500 to-rose-500" },
  { name: "Llama 3 70B", status: "Surchargé", load: "94%", loadNum: 94, latency: "450ms", requests: "3.4M", icon: Database, color: "text-blue-400", bg: "bg-blue-500", glow: "from-blue-500 to-cyan-500" },
  { name: "Mistral 8x22B", status: "Veille", load: "5%", loadNum: 5, latency: "120ms", requests: "120K", icon: Network, color: "text-emerald-400", bg: "bg-emerald-500", glow: "from-emerald-500 to-teal-500" },
];

export function DashboardAI() {
  const [activeTab, setActiveTab] = useState("24h");

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col gap-3 mb-6 border-b border-white/[0.05] pb-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.05] w-fit mb-1">
          <Brain size={12} className="text-purple-400" />
          <span className="text-[10px] font-mono tracking-wider text-white/70">AI ENGINE</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40">
              Analytique IA
            </h1>
            <p className="text-white/40 text-xs mt-1 max-w-lg leading-relaxed">
              Surveillez les performances, la latence et la répartition de charge de vos modèles.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] text-white/90 text-xs font-medium transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] active:scale-[0.98]">
              Générer Rapport
            </button>
            <button className="px-3 py-1.5 rounded-md bg-white text-black hover:bg-white/90 text-xs font-medium transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.2)] active:scale-[0.98]">
              <Zap size={12} strokeWidth={2} /> Optimiser
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Requêtes Totales", value: "5.6M", change: "+12.4%", icon: Activity, trend: "up", glow: "bg-purple-500/10", iconColor: "text-purple-400" },
          { title: "Latence Moyenne", value: "245ms", change: "-15ms", icon: Zap, trend: "down", glow: "bg-blue-500/10", iconColor: "text-blue-400" },
          { title: "Taux de Réussite", value: "99.98%", change: "+0.02%", icon: Cpu, trend: "up", glow: "bg-emerald-500/10", iconColor: "text-emerald-400" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            whileHover={{ y: -2 }}
            className="p-5 rounded-xl bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/[0.05] relative overflow-hidden group hover:border-white/[0.1] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-500"
          >
            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white/30" />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/30" />
            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-white/30" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white/30" />

            <div className={`absolute top-[10%] right-[10%] w-[30%] h-[30%] ${stat.glow} blur-[30px] rounded-full pointer-events-none mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-3">
                <div className="w-8 h-8 rounded-md bg-[#050505] border border-white/[0.08] flex items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
                  <stat.icon size={14} className={stat.iconColor} />
                </div>
                <span className={`flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded ${stat.trend === 'up' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'}`}>
                  {stat.trend === 'up' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  {stat.change}
                </span>
              </div>
              <p className="text-[9px] uppercase tracking-wider text-white/40 font-mono mb-1">{stat.title}</p>
              <p className="text-2xl font-medium tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="rounded-xl bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/[0.05] p-5 relative overflow-hidden group hover:border-white/[0.08] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-500"
      >
        {/* Corner Markers */}
        <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white/30" />
        <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/30" />
        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-white/30" />
        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white/30" />
        
        
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 relative z-10 border-b border-white/[0.05] pb-4 pt-2">
          <div>
            <p className="text-[9px] uppercase tracking-wider text-white/40 font-mono mb-1">Metrics</p>
            <h2 className="text-sm font-medium text-white/90">Volume d'Inférence</h2>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-3 text-[10px] font-mono text-white/60 bg-[#050505] p-1.5 rounded-md border border-white/[0.05]">
              <div className="flex items-center gap-1.5 px-1"><div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"/> GPT-4o</div>
              <div className="flex items-center gap-1.5 px-1"><div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"/> Claude 3.5</div>
              <div className="flex items-center gap-1.5 px-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"/> Llama 3</div>
            </div>
            
            <div className="flex items-center p-1 rounded-md bg-white/[0.02] border border-white/[0.05] relative">
              {["1h", "24h", "7j"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-0.5 text-[10px] font-medium z-10 transition-colors ${activeTab === tab ? "text-white" : "text-white/40 hover:text-white/70"}`}
                >
                  {tab}
                </button>
              ))}
              <motion.div 
                className="absolute top-1 bottom-1 w-[calc(33.33%-2px)] bg-white/[0.08] border border-white/[0.05] rounded shadow-[0_1px_5px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]"
                initial={false}
                animate={{ 
                  left: activeTab === "1h" ? "4px" : 
                        activeTab === "24h" ? "calc(33.33% + 1px)" : 
                        "calc(66.66% - 1px)" 
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            </div>
          </div>
        </div>

        <div className="h-[250px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PERFORMANCE_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGpt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorClaude" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLlama" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.02)" vertical={false} />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', boxShadow: '0 8px 30px rgba(0,0,0,0.5)', fontSize: '11px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="gpt4" stroke="#a855f7" strokeWidth={1.5} fillOpacity={1} fill="url(#colorGpt)" />
              <Area type="monotone" dataKey="claude" stroke="#f97316" strokeWidth={1.5} fillOpacity={1} fill="url(#colorClaude)" />
              <Area type="monotone" dataKey="llama" stroke="#3b82f6" strokeWidth={1.5} fillOpacity={1} fill="url(#colorLlama)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Models List */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="rounded-xl bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/[0.05] p-5 relative overflow-hidden group hover:border-white/[0.08] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-500"
      >
        {/* Corner Markers */}
        <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white/30" />
        <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/30" />
        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-white/30" />
        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white/30" />
        
        

        <div className="flex items-center justify-between mb-4 relative z-10 border-b border-white/[0.05] pb-4 pt-2">
          <div>
            <p className="text-[9px] uppercase tracking-wider text-white/40 font-mono mb-1">Topology</p>
            <h2 className="text-sm font-medium text-white/90">État des Modèles Déployés</h2>
          </div>
        </div>
        
        <div className="space-y-2 relative z-10">
          {MODELS.map((model, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-transparent hover:bg-[#050505] border border-transparent hover:border-white/[0.05] transition-all cursor-pointer group/model">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-md bg-[#050505] border border-white/[0.08] flex items-center justify-center ${model.color} shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] group-hover/model:border-white/[0.15] transition-colors`}>
                  <model.icon size={14} />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-white/90 group-hover/model:text-white transition-colors">{model.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5 text-[9px] font-mono text-white/40">
                    {model.status === 'Actif' ? (
                       <span className="flex items-center gap-1 text-emerald-400">
                         <div className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> Actif
                       </span>
                    ) : model.status === 'Surchargé' ? (
                       <span className="flex items-center gap-1 text-rose-400">
                         <div className="w-1 h-1 rounded-full bg-rose-400 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]" /> Surchargé
                       </span>
                    ) : (
                       <span className="flex items-center gap-1 text-white/40">
                         <div className="w-1 h-1 rounded-full bg-white/20" /> Veille
                       </span>
                    )}
                    <span>•</span>
                    <span>{model.requests} reqs</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="hidden sm:block text-right">
                  <p className="text-[8px] uppercase tracking-wider text-white/40 font-mono mb-0.5">Latence</p>
                  <p className="text-[10px] font-mono text-white/80">{model.latency}</p>
                </div>
                <div className="w-20 sm:w-28">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-[8px] uppercase tracking-wider text-white/40 font-mono">Charge</span>
                    <span className="text-[9px] font-mono text-white/60">{model.load}</span>
                  </div>
                  <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${model.glow} rounded-full relative shadow-[0_0_10px_rgba(255,255,255,0.1)]`} 
                      style={{ width: model.load }} 
                    >
                      {model.loadNum > 0 && (
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 blur-[1px]" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}