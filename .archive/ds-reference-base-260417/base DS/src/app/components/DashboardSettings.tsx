import { motion } from "motion/react";
import { User, Bell, Shield, Key, Sliders, Monitor, Globe, Smartphone, Save, Settings } from "lucide-react";
import { useState } from "react";

const SETTINGS_SECTIONS = [
  { id: "profile", name: "Profil", icon: User },
  { id: "security", name: "Sécurité", icon: Shield },
  { id: "api", name: "Clés API", icon: Key },
  { id: "nodes", name: "Nœuds & Calcul", icon: Sliders },
  { id: "notifications", name: "Notifications", icon: Bell },
  { id: "appearance", name: "Apparence", icon: Monitor },
];

export function DashboardSettings() {
  const [activeSection, setActiveSection] = useState("api");

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col gap-4 mb-10 border-b border-white/[0.05] pb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] w-fit mb-2 backdrop-blur-md">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" />
          <span className="text-[10px] font-mono tracking-wider text-blue-400 uppercase">SYS CONFIG</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40">
              Paramètres
            </h1>
            <p className="text-white/40 text-sm mt-2 max-w-lg leading-relaxed">
              Gérez vos préférences système, la sécurité globale et vos accès API.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 rounded-lg bg-white text-black hover:bg-white/90 text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2),inset_0_-2px_0_rgba(0,0,0,0.2)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4),inset_0_-2px_0_rgba(0,0,0,0.2)] active:scale-[0.98]">
              <Save size={14} strokeWidth={2} /> Sauvegarder
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0 space-y-2 relative z-10">
          <p className="text-[10px] uppercase tracking-wider text-white/40 font-mono mb-4 px-2">Menu Réglages</p>
          {SETTINGS_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
                activeSection === section.id
                  ? "bg-white/[0.06] border border-white/[0.05] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_20px_rgba(255,255,255,0.03)]"
                  : "text-white/40 hover:text-white/90 hover:bg-white/[0.03] border border-transparent hover:border-white/[0.05]"
              }`}
            >
              <section.icon size={16} className={activeSection === section.id ? "text-white" : "text-white/40"} />
              {section.name}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <motion.div 
          key={activeSection}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 rounded-2xl bg-[#0a0a0a]/75 backdrop-blur-2xl border border-white/[0.05] p-8 relative overflow-hidden group hover:border-white/[0.08] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-500"
        >
          <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen opacity-50" />

          {activeSection === "api" && (
            <div className="relative z-10 space-y-8">
              <div className="border-b border-white/[0.05] pb-6">
                <p className="text-[10px] uppercase tracking-wider text-white/40 font-mono mb-2">Authentification</p>
                <h2 className="text-xl font-medium text-white/90 mb-2">Clés d'accès API</h2>
                <p className="text-sm text-white/40">Gérez les clés utilisées pour authentifier vos requêtes vers les nœuds d'inférence Nexus.</p>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: "Clé de Production (Principale)", key: "nk_live_8f72...391a", created: "Il y a 3 mois", lastUsed: "Aujourd'hui" },
                  { name: "Environnement de Test", key: "nk_test_4b29...88cd", created: "Il y a 1 semaine", lastUsed: "Il y a 2 jours" },
                ].map((apiKey, i) => (
                  <div key={i} className="p-5 rounded-xl bg-transparent hover:bg-[#050505] border border-white/[0.05] hover:border-white/[0.08] transition-colors group/key">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                      <div>
                        <h3 className="text-sm font-medium text-white/90 group-hover/key:text-white">{apiKey.name}</h3>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-white/40 font-mono">
                          <span>Créée {apiKey.created}</span>
                          <span>•</span>
                          <span>Dernière utilisation: {apiKey.lastUsed}</span>
                        </div>
                      </div>
                      <button className="px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 text-xs font-medium transition-all shadow-[0_0_15px_rgba(244,63,94,0.1)] hover:shadow-[0_0_25px_rgba(244,63,94,0.2)] active:scale-[0.98]">
                        Révoquer
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#050505] border border-white/[0.08] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]">
                      <code className="text-xs text-blue-400/90 font-mono tracking-wider">{apiKey.key}</code>
                      <button className="text-white/30 hover:text-white/90 transition-colors p-1">
                        <Key size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-white/[0.05]">
                <button className="px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] text-white/90 text-sm font-medium transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_20px_rgba(255,255,255,0.03)] active:scale-[0.98] flex items-center justify-center w-full sm:w-auto">
                  + Générer une nouvelle clé
                </button>
              </div>
            </div>
          )}

          {activeSection === "nodes" && (
            <div className="relative z-10 space-y-8">
              <div className="border-b border-white/[0.05] pb-6">
                <p className="text-[10px] uppercase tracking-wider text-white/40 font-mono mb-2">Déploiement</p>
                <h2 className="text-xl font-medium text-white/90 mb-2">Configuration de Calcul</h2>
                <p className="text-sm text-white/40">Paramètres de déploiement et limites de ressources pour vos agents IA.</p>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-wider text-white/40 font-mono block">Zone de Déploiement Préférée</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {['US-East (Optimisé)', 'EU-West', 'Asia-Pacific'].map((region, i) => (
                      <div key={i} className={`p-4 rounded-xl border cursor-pointer transition-all ${i === 0 ? 'bg-[#050505] border-blue-500/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2),0_0_15px_rgba(59,130,246,0.1)]' : 'bg-transparent border-white/[0.05] hover:bg-white/[0.02] hover:border-white/[0.1]'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-sm font-medium ${i === 0 ? 'text-white' : 'text-white/60'}`}>{region}</span>
                          {i === 0 && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
                        </div>
                        <span className="text-[10px] text-white/40 font-mono">Latence: {i === 0 ? '12ms' : i === 1 ? '85ms' : '140ms'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/[0.05]">
                  <div className="flex justify-between items-center">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-white/40 font-mono block mb-1">Auto-Scaling</label>
                      <span className="text-sm text-white/60">Augmenter les ressources GPU lors des pics de charge.</span>
                    </div>
                    <div className="w-12 h-6 bg-emerald-500/20 rounded-full border border-emerald-500/30 relative cursor-pointer shadow-[0_0_10px_rgba(52,211,153,0.1)]">
                      <div className="absolute right-1 top-1 bottom-1 w-4 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 pt-6 border-t border-white/[0.05]">
                  <div className="flex justify-between items-center">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-white/40 font-mono block mb-1">Limite de Dépense (ETH)</label>
                      <span className="text-sm text-white/60">Coupe l'accès API si la limite est atteinte.</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 p-4 rounded-xl bg-[#050505] border border-white/[0.05]">
                    <input 
                      type="range" 
                      min="0" 
                      max="10" 
                      step="0.1" 
                      defaultValue="2.5" 
                      className="flex-1 h-1.5 bg-white/[0.08] rounded-full appearance-none cursor-pointer accent-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"
                    />
                    <span className="text-sm font-medium text-blue-400 bg-blue-500/10 px-4 py-1.5 rounded-lg border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)] font-mono">2.5 ETH</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other sections */}
          {(activeSection !== "api" && activeSection !== "nodes") && (
            <div className="relative z-10 flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/[0.08] flex items-center justify-center mb-6 shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)]">
                <Sliders size={24} className="text-white/40" />
              </div>
              <h2 className="text-lg font-medium text-white/90 mb-2">Section en développement</h2>
              <p className="text-sm text-white/40 max-w-sm leading-relaxed">Cette page de paramètres sera disponible dans la prochaine mise à jour majeure du réseau Nexus.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}