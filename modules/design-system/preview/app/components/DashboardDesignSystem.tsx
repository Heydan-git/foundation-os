import { motion, AnimatePresence } from "motion/react";
import {
  Zap, Search, Bell, Activity, ArrowUpRight, Copy, CheckCircle2,
  ShieldAlert, Cpu, Hexagon, Sparkles, Layers, Fingerprint, Database,
  ArrowRight, Check, AlertCircle, AlertTriangle, Info, ChevronDown,
  Loader2, User, Users, Lock, MoreVertical, Download, RefreshCw,
  HelpCircle, X, Filter, BarChart2, Eye, EyeOff, ChevronRight,
  Home, Settings, Terminal, Clock, Globe, Wallet,
  FileText, Inbox, Plus, Minus, ExternalLink, Hash, Shield,
  Maximize2, Star, TrendingUp, TrendingDown, Columns3, Table2,
  ChevronLeft, ChevronsLeft, ChevronsRight, Wifi, ArrowDownUp,
  Repeat, Droplets, Flame, Gauge, PanelLeftOpen
} from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";

/* ══════════════════════════════════════════════════════════════
   TOKEN REFERENCE (mirrors theme.css --ds-* variables)
   ══════════════════════════════════════════════════════════════
   Surfaces:   bg-ds-surface-{0|1|2|3}
   Foreground: text-ds-fg/{opacity}
   Border:     border-ds-border/{opacity}
   Status:     {bg|text|border}-ds-{emerald|amber|rose|blue}/{opacity}
   Accent:     {bg|text|border}-ds-{purple|cyan|teal|sky|violet|indigo|orange}/{opacity}
   Spacing:    p-ds-{1..10} gap-ds-{1..10} m-ds-{1..10}
   Text size:  text-ds-{2xs|xs|sm|md|base|lg|xl|2xl|display}
   Radius:     rounded-ds-{sm|md|lg|xl|full}
   ══════════════════════════════════════════════════════════════ */

/* ─── Shared UI Primitives ─── */
const SectionHeader = ({ icon: Icon, iconColor, glowColor, lineColor, label }: {
  icon: any; iconColor: string; glowColor: string; lineColor: string; label: string
}) => (
  <div className="flex items-center gap-ds-3">
    <div className={`w-8 h-ds-px bg-gradient-to-r ${lineColor} to-transparent`} />
    <h2 className="text-ds-lg text-ds-fg/90 flex items-center gap-ds-2">
      <div className="relative flex items-center justify-center w-ds-5 h-ds-5">
        <div className={`absolute inset-0 rounded-ds-sm blur-[6px] ${glowColor}`} />
        <Icon size={12} className={`${iconColor} relative z-10`} />
      </div>
      {label}
    </h2>
  </div>
);

const GlassCard = ({ children, className = "", glow }: { children: React.ReactNode; className?: string; glow?: string }) => (
  <div className={`rounded-ds-xl bg-ds-surface-2/80 backdrop-blur-2xl border border-ds-border/5 relative overflow-hidden group hover:border-ds-border/8 hover:shadow-[var(--ds-shadow-card)] transition-all duration-500 ${className}`}>
    <div className="absolute inset-x-0 top-0 h-ds-px bg-gradient-to-r from-transparent via-ds-fg/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    {glow && <div className={`absolute w-[40%] h-[40%] ${glow} blur-[80px] rounded-ds-full pointer-events-none mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />}
    {children}
  </div>
);

const SubLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-ds-sm uppercase tracking-wider text-ds-fg/40 font-mono mb-ds-3 block">{children}</span>
);

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-ds-sm uppercase tracking-wider text-ds-fg/40 font-mono mb-ds-4">{children}</h3>
);

/* ─── Animated Counter Hook ─── */
function useAnimatedNumber(target: number, duration = 800) {
  const [val, setVal] = useState(0);
  const ref = useRef<number>(0);
  useEffect(() => {
    const start = ref.current;
    const diff = target - start;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      const current = start + diff * eased;
      setVal(current);
      if (elapsed < 1) requestAnimationFrame(step);
      else ref.current = target;
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return val;
}

/* ─── Copy Button Component ─── */
function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={handleCopy} className={`relative transition-colors ${className}`} title="Copier">
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div key="check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }}>
            <Check size={10} className="text-ds-emerald" />
          </motion.div>
        ) : (
          <motion.div key="copy" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }}>
            <Copy size={10} className="text-ds-fg/30 hover:text-ds-fg/80" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

/* ─── Number Stepper Component ─── */
function NumberStepper({ min = 0, max = 100, step = 1, defaultValue = 1, unit = "" }: { min?: number; max?: number; step?: number; defaultValue?: number; unit?: string }) {
  const [val, setVal] = useState(defaultValue);
  return (
    <div className="flex items-center gap-0 rounded-ds-md border border-ds-border/8 bg-ds-surface-1 overflow-hidden">
      <button onClick={() => setVal(Math.max(min, val - step))} className="px-ds-2 py-ds-1_5 text-ds-fg/40 hover:text-ds-fg/80 hover:bg-ds-fg/[0.03] transition-all border-r border-ds-border/5">
        <Minus size={12} />
      </button>
      <span className="px-ds-3 py-ds-1_5 text-ds-base font-mono text-ds-fg/90 min-w-[48px] text-center">{val}{unit && <span className="text-ds-fg/40 ml-0.5">{unit}</span>}</span>
      <button onClick={() => setVal(Math.min(max, val + step))} className="px-ds-2 py-ds-1_5 text-ds-fg/40 hover:text-ds-fg/80 hover:bg-ds-fg/[0.03] transition-all border-l border-ds-border/5">
        <Plus size={12} />
      </button>
    </div>
  );
}

export function DashboardDesignSystem() {
  const [activeTab, setActiveTab] = useState("24h");
  const [checks, setChecks] = useState<Record<string, boolean>>({ opt1: false, opt2: true, opt3: false });
  const [selectedRadio, setSelectedRadio] = useState("beta");
  const [toggles, setToggles] = useState<Record<string, boolean>>({ auto: false, perf: true, notif: true, dark: true });
  const [sliderVal, setSliderVal] = useState(80);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState("overview");
  const [selectOpen, setSelectOpen] = useState(false);
  const [selectValue, setSelectValue] = useState("Ethereum Mainnet");
  const [showPassword, setShowPassword] = useState(false);
  const [tablePage, setTablePage] = useState(1);
  const [starredRows, setStarredRows] = useState<Set<number>>(new Set([0, 2]));
  const [tags, setTags] = useState(['DeFi', 'Web3', 'AI Agent', 'Smart Contract', 'L2', 'ZK-Proof']);
  const [gasSpeed, setGasSpeed] = useState<'slow' | 'standard' | 'fast'>('standard');

  const animatedTVL = useAnimatedNumber(4.2, 1200);
  const animatedGas = useAnimatedNumber(gasSpeed === 'slow' ? 12 : gasSpeed === 'standard' ? 24 : 48, 400);

  const toggleCheck = useCallback((key: string) => setChecks(p => ({ ...p, [key]: !p[key] })), []);
  const toggleToggle = useCallback((key: string) => setToggles(p => ({ ...p, [key]: !p[key] })), []);
  const toggleStar = useCallback((idx: number) => setStarredRows(p => {
    const n = new Set(p);
    n.has(idx) ? n.delete(idx) : n.add(idx);
    return n;
  }), []);
  const removeTag = useCallback((tag: string) => setTags(p => p.filter(t => t !== tag)), []);

  return (
    <div className="space-y-ds-6 max-w-5xl mx-auto pb-ds-10 relative">

      {/* ─── Header ─── */}
      <div className="flex flex-col gap-ds-3 mb-ds-6 border-b border-ds-border/5 pb-ds-6 relative z-10">
        <div className="inline-flex items-center gap-ds-2 px-ds-2 py-ds-1 rounded-ds-md bg-ds-fg/[0.03] border border-ds-border/5 w-fit mb-ds-1">
          <Sparkles size={12} className="text-ds-purple" />
          <span className="text-ds-sm text-ds-fg/70 tracking-wider">NEXUS UI v4.0 &mdash; Fully Tokenized</span>
        </div>
        <h1 className="text-ds-display tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-ds-fg via-ds-fg/90 to-ds-fg/40">
          Design System & HUD
        </h1>
        <p className="text-ds-fg/40 text-ds-base max-w-xl leading-relaxed">
          Composants interactifs, variantes d'etat, elements crypto-natifs et controles avances.
          Chaque valeur est issue d'un token semantique defini dans <code className="text-ds-blue font-mono">theme.css</code>.
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 0: Design Token Reference
         ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-ds-4 relative z-10">
        <SectionHeader icon={PanelLeftOpen} iconColor="text-ds-cyan" glowColor="bg-ds-cyan/30" lineColor="from-ds-cyan" label="Token Reference" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-ds-4">
          {/* Color Tokens */}
          <GlassCard className="p-ds-6">
            <CardTitle>Couleurs Semantiques</CardTitle>
            <div className="space-y-ds-3">
              <SubLabel>Surfaces</SubLabel>
              <div className="grid grid-cols-4 gap-ds-2">
                {([
                  { name: "surface-0", cls: "bg-ds-surface-0" },
                  { name: "surface-1", cls: "bg-ds-surface-1" },
                  { name: "surface-2", cls: "bg-ds-surface-2" },
                  { name: "surface-3", cls: "bg-ds-surface-3" },
                ] as const).map(s => (
                  <div key={s.name} className="text-center">
                    <div className={`w-full aspect-square rounded-ds-lg ${s.cls} border border-ds-border/10`} />
                    <span className="text-ds-2xs text-ds-fg/40 font-mono mt-ds-1 block">{s.name}</span>
                  </div>
                ))}
              </div>

              <SubLabel>Foreground & Border</SubLabel>
              <div className="flex gap-ds-2">
                {[90, 70, 40, 20, 10, 5].map(op => (
                  <div key={op} className="flex-1 text-center">
                    <div className={`w-full h-ds-6 rounded-ds-md bg-ds-fg/${op}`} />
                    <span className="text-ds-2xs text-ds-fg/30 font-mono mt-ds-1 block">/{op}</span>
                  </div>
                ))}
              </div>

              <SubLabel>Status & Accent</SubLabel>
              <div className="grid grid-cols-5 gap-ds-2">
                {([
                  { name: "blue", cls: "bg-ds-blue" },
                  { name: "purple", cls: "bg-ds-purple" },
                  { name: "emerald", cls: "bg-ds-emerald" },
                  { name: "amber", cls: "bg-ds-amber" },
                  { name: "rose", cls: "bg-ds-rose" },
                  { name: "cyan", cls: "bg-ds-cyan" },
                  { name: "teal", cls: "bg-ds-teal" },
                  { name: "sky", cls: "bg-ds-sky" },
                  { name: "violet", cls: "bg-ds-violet" },
                  { name: "orange", cls: "bg-ds-orange" },
                ] as const).map(c => (
                  <div key={c.name} className="text-center">
                    <div className={`w-full h-ds-5 rounded-ds-md ${c.cls}`} />
                    <span className="text-ds-2xs text-ds-fg/30 font-mono mt-ds-1 block">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Typography Tokens */}
          <GlassCard className="p-ds-6">
            <CardTitle>Echelle Typographique</CardTitle>
            <div className="space-y-ds-2">
              {([
                { name: "display", cls: "text-ds-display", px: "30" },
                { name: "2xl", cls: "text-ds-2xl", px: "24" },
                { name: "xl", cls: "text-ds-xl", px: "18" },
                { name: "lg", cls: "text-ds-lg", px: "14" },
                { name: "base", cls: "text-ds-base", px: "12" },
                { name: "md", cls: "text-ds-md", px: "11" },
                { name: "sm", cls: "text-ds-sm", px: "10" },
                { name: "xs", cls: "text-ds-xs", px: "9" },
                { name: "2xs", cls: "text-ds-2xs", px: "8" },
              ] as const).map(t => (
                <div key={t.name} className="flex items-center justify-between py-ds-1 border-b border-ds-border/5">
                  <span className={`${t.cls} text-ds-fg/80 truncate`}>Aa</span>
                  <div className="flex items-center gap-ds-2">
                    <code className="text-ds-2xs text-ds-fg/30 font-mono">text-ds-{t.name}</code>
                    <span className="text-ds-2xs text-ds-blue font-mono">{t.px}px</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Spacing & Radius Tokens */}
          <GlassCard className="p-ds-6">
            <CardTitle>Spacing & Radius</CardTitle>
            <SubLabel>Echelle d'espacement</SubLabel>
            <div className="space-y-ds-1_5 mb-ds-4">
              {([
                { name: "1", val: "4px" }, { name: "2", val: "8px" }, { name: "3", val: "12px" },
                { name: "4", val: "16px" }, { name: "5", val: "20px" }, { name: "6", val: "24px" },
                { name: "8", val: "32px" }, { name: "10", val: "40px" },
              ] as const).map(s => (
                <div key={s.name} className="flex items-center gap-ds-2">
                  <code className="text-ds-2xs text-ds-fg/30 font-mono w-10 text-right shrink-0">ds-{s.name}</code>
                  <div className="flex-1 flex items-center gap-ds-1_5">
                    <div className="bg-ds-blue/40 rounded-ds-sm h-ds-2" style={{ width: `${parseInt(s.val) * 2}px` }} />
                    <span className="text-ds-2xs text-ds-fg/20 font-mono">{s.val}</span>
                  </div>
                </div>
              ))}
            </div>

            <SubLabel>Border Radius</SubLabel>
            <div className="flex gap-ds-3 items-end">
              {([
                { name: "sm", cls: "rounded-ds-sm", val: "4px" },
                { name: "md", cls: "rounded-ds-md", val: "6px" },
                { name: "lg", cls: "rounded-ds-lg", val: "8px" },
                { name: "xl", cls: "rounded-ds-xl", val: "12px" },
                { name: "full", cls: "rounded-ds-full", val: "∞" },
              ] as const).map(r => (
                <div key={r.name} className="text-center flex-1">
                  <div className={`w-ds-10 h-ds-10 mx-auto bg-ds-blue/20 border border-ds-blue/40 ${r.cls}`} />
                  <span className="text-ds-2xs text-ds-fg/30 font-mono mt-ds-1 block">{r.name}</span>
                  <span className="text-ds-2xs text-ds-fg/20 font-mono">{r.val}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: Premium Gradients & Color Palette
         ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-ds-4 relative z-10">
        <SectionHeader icon={Hexagon} iconColor="text-ds-blue" glowColor="bg-ds-blue/30" lineColor="from-ds-blue" label="Gradients & Palette" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-ds-3">
          {[
            { name: "Cyberpunk", from: "from-ds-blue", to: "to-ds-purple", shadow: "shadow-[0_0_20px_rgba(168,85,247,0.15)]" },
            { name: "Biosphere", from: "from-ds-emerald", to: "to-ds-cyan", shadow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]" },
            { name: "Eruption", from: "from-ds-orange", to: "to-ds-rose", shadow: "shadow-[0_0_20px_rgba(244,63,94,0.15)]" },
            { name: "Aurora", from: "from-ds-violet", to: "to-ds-purple", shadow: "shadow-[0_0_20px_rgba(192,38,211,0.15)]" },
            { name: "Glacier", from: "from-ds-sky", to: "to-ds-indigo", shadow: "shadow-[0_0_20px_rgba(56,189,248,0.15)]" },
            { name: "Solar", from: "from-ds-amber", to: "to-ds-orange", shadow: "shadow-[0_0_20px_rgba(251,191,36,0.15)]" },
          ].map((grad, i) => (
            <motion.div
              whileHover={{ y: -2 }}
              key={i}
              className={`p-ds-px rounded-ds-xl bg-gradient-to-br ${grad.from} ${grad.to} opacity-90 hover:opacity-100 transition-all duration-500 cursor-pointer ${grad.shadow} group/grad`}
            >
              <div className="h-full w-full bg-ds-surface-1/95 backdrop-blur-xl rounded-ds-xl p-ds-3 flex flex-col justify-between min-h-[72px] relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-ds-sm text-ds-fg/90">{grad.name}</span>
                  <div className={`w-ds-2 h-ds-2 rounded-ds-full bg-gradient-to-br ${grad.from} ${grad.to} shadow-[0_0_6px_rgba(255,255,255,0.15)]`} />
                </div>
                <code className="text-ds-2xs text-ds-fg/25 font-mono group-hover/grad:text-ds-fg/50 transition-colors">
                  {grad.from.replace('from-ds-', '')}
                </code>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: HUD Cards & Elevation
         ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-ds-4 relative z-10 pt-ds-4">
        <SectionHeader icon={Layers} iconColor="text-ds-purple" glowColor="bg-ds-purple/30" lineColor="from-ds-purple" label="HUD Cartes & Elevation" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-ds-4">
          {/* Premium Metric Card */}
          <GlassCard className="p-ds-5" glow="top-[-20%] left-[-10%] bg-ds-blue/10">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-ds-4 mt-ds-2">
                <div className="w-ds-8 h-ds-8 rounded-ds-md bg-gradient-to-br from-ds-blue/10 to-ds-purple/10 border border-ds-border/10 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] group-hover:border-ds-border/20 transition-colors">
                  <Database size={14} className="text-ds-blue" />
                </div>
                <div className="inline-flex items-center gap-ds-2 px-ds-2_5 py-ds-1 rounded-ds-full bg-ds-emerald/10 border border-ds-emerald/20 backdrop-blur-md">
                  <div className="w-ds-1_5 h-ds-1_5 rounded-ds-full bg-ds-emerald animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span className="text-ds-sm font-mono tracking-wider text-ds-emerald uppercase">En ligne</span>
                </div>
              </div>
              <h3 className="text-ds-fg/40 text-ds-base mb-ds-1 font-mono tracking-wide">Volume Traite (24h)</h3>
              <div className="flex items-end gap-ds-2">
                <span className="text-ds-display tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-ds-fg to-ds-fg/70">$14.2M</span>
                <span className="text-ds-emerald text-ds-md mb-ds-1_5 flex items-center gap-0.5 bg-ds-emerald/10 px-ds-1_5 py-0.5 rounded-ds-sm">
                  <ArrowUpRight size={10} /> 8.4%
                </span>
              </div>
              <div className="mt-ds-4 pt-ds-4 border-t border-ds-border/5">
                <div className="flex justify-between text-ds-sm mb-ds-1_5 font-mono">
                  <span className="text-ds-fg/40">Capacite Reseau</span>
                  <span className="text-ds-fg/80">82%</span>
                </div>
                <div className="h-ds-1 w-full bg-ds-fg/[0.03] rounded-ds-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-ds-blue to-ds-purple shadow-[0_0_10px_rgba(168,85,247,0.5)] rounded-ds-full relative"
                    initial={{ width: "0%" }}
                    animate={{ width: "82%" }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-3 bg-ds-fg/50 blur-[1px]" />
                  </motion.div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Interactive List Card */}
          <GlassCard glow="bottom-[-20%] left-[-10%] bg-ds-emerald/10">
            <div className="p-ds-3 border-b border-ds-border/5 mt-ds-1 relative z-10 flex items-center justify-between">
              <h3 className="text-ds-base text-ds-fg/90">Noeuds Actifs</h3>
              <span className="text-ds-xs font-mono text-ds-fg/30">3 / 7 en ligne</span>
            </div>
            <div className="p-ds-1_5 space-y-0.5 relative z-10">
              {[
                { name: "Alpha Cluster", status: "Optimal", ping: "12ms", icon: Cpu, colorClass: "text-ds-emerald", bgClass: "bg-ds-emerald/10", borderClass: "border-ds-emerald/20" },
                { name: "Beta Gateway", status: "Charge elevee", ping: "84ms", icon: Activity, colorClass: "text-ds-amber", bgClass: "bg-ds-amber/10", borderClass: "border-ds-amber/20" },
                { name: "Gamma Storage", status: "Synchronisation", ping: "45ms", icon: Database, colorClass: "text-ds-blue", bgClass: "bg-ds-blue/10", borderClass: "border-ds-blue/20" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 2 }}
                  className="flex items-center justify-between p-ds-2_5 rounded-ds-lg bg-transparent hover:bg-ds-fg/[0.03] border border-transparent hover:border-ds-border/5 transition-all cursor-pointer group/item"
                >
                  <div className="flex items-center gap-ds-3">
                    <div className={`w-7 h-7 rounded-ds-md ${item.bgClass} flex items-center justify-center border ${item.borderClass}`}>
                      <item.icon size={12} className={item.colorClass} />
                    </div>
                    <div>
                      <h4 className="text-ds-md text-ds-fg/90 group-hover/item:text-ds-fg transition-colors">{item.name}</h4>
                      <p className="text-ds-xs text-ds-fg/40 mt-0.5 font-mono">{item.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-ds-2">
                    <span className="text-ds-xs font-mono text-ds-fg/30 group-hover/item:text-ds-fg/60 transition-colors">{item.ping}</span>
                    <ArrowRight size={12} className="text-ds-fg/20 group-hover/item:text-ds-fg/80 group-hover/item:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: Buttons, Controls & Micro-interactions
         ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-ds-4 relative z-10 pt-ds-4">
        <SectionHeader icon={Fingerprint} iconColor="text-ds-rose" glowColor="bg-ds-rose/30" lineColor="from-ds-rose" label="Boutons, Controles & Micro-interactions" />

        <GlassCard className="p-ds-6" glow="top-[-20%] right-[-10%] bg-ds-rose/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-ds-8 relative z-10">
            {/* Buttons */}
            <div className="space-y-ds-5">
              <div>
                <SubLabel>Primary & Sizes</SubLabel>
                <div className="flex flex-wrap items-center gap-ds-3">
                  <button className="px-ds-2 py-ds-1 rounded-ds-sm bg-ds-fg text-ds-surface-0 hover:bg-ds-fg/90 text-ds-xs transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] active:scale-[0.97]">XS</button>
                  <button className="px-ds-3 py-ds-1_5 rounded-ds-md bg-ds-fg text-ds-surface-0 hover:bg-ds-fg/90 text-ds-sm transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] active:scale-[0.97]">Small</button>
                  <button className="px-ds-4 py-ds-2 rounded-ds-lg bg-ds-fg text-ds-surface-0 hover:bg-ds-fg/90 text-ds-base transition-all flex items-center gap-ds-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] active:scale-[0.97]">
                    <Zap size={14} /> Default
                  </button>
                  <button className="px-ds-5 py-ds-2_5 rounded-ds-lg bg-ds-fg text-ds-surface-0 hover:bg-ds-fg/90 text-ds-base transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] active:scale-[0.97]">Large</button>
                </div>
              </div>

              <div>
                <SubLabel>Variants</SubLabel>
                <div className="flex flex-wrap items-center gap-ds-3">
                  <button className="px-ds-3 py-ds-2 rounded-ds-md bg-ds-fg/[0.03] border border-ds-border/8 hover:bg-ds-fg/8 hover:border-ds-border/15 text-ds-fg/90 text-ds-base transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] active:scale-[0.97]">Glass</button>
                  <button className="px-ds-3 py-ds-2 rounded-ds-md bg-gradient-to-r from-ds-blue/10 to-ds-purple/10 border border-ds-blue/20 hover:border-ds-blue/40 text-ds-blue text-ds-base transition-all shadow-[0_0_10px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] active:scale-[0.97]">Gradient</button>
                  <button className="px-ds-3 py-ds-2 rounded-ds-md bg-ds-emerald/10 border border-ds-emerald/20 hover:bg-ds-emerald/20 text-ds-emerald text-ds-base transition-all shadow-[0_0_10px_rgba(52,211,153,0.1)] active:scale-[0.97]">Success</button>
                  <button className="px-ds-3 py-ds-2 rounded-ds-md bg-ds-rose/10 border border-ds-rose/20 hover:bg-ds-rose/20 text-ds-rose text-ds-base transition-all shadow-[0_0_10px_rgba(244,63,94,0.1)] active:scale-[0.97]">Danger</button>
                  <button className="px-ds-3 py-ds-2 rounded-ds-md text-ds-fg/40 hover:text-ds-fg/90 hover:bg-ds-fg/[0.03] text-ds-base transition-all border border-transparent hover:border-ds-border/5">Ghost</button>
                  <button className="px-ds-3 py-ds-2 rounded-ds-md text-ds-blue hover:text-ds-blue/80 text-ds-base transition-all underline underline-offset-2 decoration-ds-blue/30 hover:decoration-ds-blue/60">Link</button>
                </div>
              </div>

              <div>
                <SubLabel>Icon & Combos</SubLabel>
                <div className="flex flex-wrap items-center gap-ds-2">
                  {[
                    { icon: Filter, label: "Filter" },
                    { icon: RefreshCw, label: "Refresh" },
                    { icon: Download, label: "Download" },
                    { icon: Plus, label: "Add" },
                    { icon: MoreVertical, label: "More" },
                  ].map((btn, i) => (
                    <button key={i} className="p-ds-2 rounded-ds-md bg-ds-fg/[0.03] border border-ds-border/8 hover:bg-ds-fg/8 hover:border-ds-border/15 text-ds-fg/60 hover:text-ds-fg/90 transition-all active:scale-[0.95]" title={btn.label}>
                      <btn.icon size={14} />
                    </button>
                  ))}
                  <div className="w-ds-px h-ds-6 bg-ds-border/5 mx-ds-1" />
                  <NumberStepper min={1} max={50} defaultValue={5} />
                </div>
              </div>

              <div>
                <SubLabel>States</SubLabel>
                <div className="flex flex-wrap items-center gap-ds-3">
                  <button disabled className="px-ds-4 py-ds-2 rounded-ds-md bg-ds-fg/5 border border-ds-border/5 text-ds-fg/30 text-ds-base cursor-not-allowed">Disabled</button>
                  <button disabled className="px-ds-4 py-ds-2 rounded-ds-md bg-ds-fg text-ds-surface-0/50 text-ds-base flex items-center gap-ds-2 cursor-not-allowed opacity-70">
                    <Loader2 size={12} className="animate-spin" /> Loading...
                  </button>
                  <button className="px-ds-4 py-ds-2 rounded-ds-md bg-ds-emerald/10 border border-ds-emerald/30 text-ds-emerald text-ds-base flex items-center gap-ds-2 shadow-[0_0_12px_rgba(52,211,153,0.15)]">
                    <CheckCircle2 size={12} /> Success
                  </button>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-ds-6">
              {/* Segmented Control */}
              <div>
                <SubLabel>Segmented Control</SubLabel>
                <div className="flex items-center p-ds-1 rounded-ds-md bg-ds-fg/[0.02] border border-ds-border/5 relative">
                  {["1h", "24h", "7j", "30j"].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-ds-1_5 text-ds-sm z-10 transition-colors ${activeTab === tab ? "text-ds-fg" : "text-ds-fg/40 hover:text-ds-fg/70"}`}>
                      {tab}
                    </button>
                  ))}
                  <motion.div
                    className="absolute top-1 bottom-1 w-[calc(25%-2px)] bg-ds-fg/8 border border-ds-border/5 rounded-ds-sm shadow-[0_2px_10px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]"
                    initial={false}
                    animate={{
                      left: activeTab === "1h" ? "4px" :
                            activeTab === "24h" ? "calc(25% + 2px)" :
                            activeTab === "7j" ? "calc(50% + 0px)" :
                            "calc(75% - 2px)"
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                </div>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-2 gap-ds-4">
                <div className="space-y-ds-1_5">
                  <SubLabel>Recherche</SubLabel>
                  <div className="relative group/search">
                    <div className="absolute inset-0 bg-gradient-to-r from-ds-blue/10 to-ds-purple/10 rounded-ds-md blur opacity-0 group-focus-within/search:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex items-center">
                      <Search className="absolute left-2.5 text-ds-fg/30 group-focus-within/search:text-ds-blue transition-colors" size={12} />
                      <input type="text" placeholder="Rechercher..." className="w-full bg-ds-surface-2 border border-ds-border/8 hover:border-ds-border/15 rounded-ds-md pl-7 pr-8 py-ds-1_5 text-ds-base text-ds-fg/90 placeholder:text-ds-fg/30 focus:outline-none focus:border-ds-blue/50 shadow-[var(--ds-shadow-inset)] transition-all" />
                      <div className="absolute right-2 px-ds-1 py-0.5 rounded-ds-sm border border-ds-border/10 bg-ds-fg/5 text-ds-2xs text-ds-fg/40 font-mono">
                        ⌘K
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-ds-1_5">
                  <SubLabel>Montant</SubLabel>
                  <div className="relative">
                    <input type="text" defaultValue="0.05" className="w-full bg-ds-surface-2 border border-ds-border/8 hover:border-ds-border/15 rounded-ds-md px-ds-3 py-ds-1_5 text-ds-lg font-mono text-ds-fg/90 focus:outline-none focus:border-ds-fg/30 shadow-[var(--ds-shadow-inset)] transition-all text-right pr-10" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-ds-fg/60 font-mono text-ds-sm uppercase">ETH</div>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-ds-3">
                <SubLabel>Jauges</SubLabel>
                <div className="space-y-ds-1_5">
                  <div className="flex justify-between text-ds-xs font-mono text-ds-fg/60">
                    <span>API Usage</span>
                    <span className="text-ds-purple">72%</span>
                  </div>
                  <div className="h-ds-1_5 w-full bg-ds-surface-1 rounded-ds-full overflow-hidden border border-ds-border/5">
                    <motion.div
                      className="h-full bg-gradient-to-r from-ds-purple to-ds-purple/70 rounded-ds-full relative shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                      initial={{ width: "0%" }}
                      animate={{ width: "72%" }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                    >
                      <div className="absolute right-0 top-0 bottom-0 w-4 bg-ds-fg/50 blur-[2px]" />
                    </motion.div>
                  </div>
                </div>
                <div className="flex items-center gap-ds-4 p-ds-2 rounded-ds-md bg-ds-fg/[0.02] border border-ds-border/5">
                  <div className="relative w-ds-8 h-ds-8">
                    <svg className="w-8 h-8 transform -rotate-90">
                      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-ds-fg/10" />
                      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray="87.96" strokeDashoffset="22" className="text-ds-blue drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-ds-2xs font-mono text-ds-fg/90">75%</div>
                  </div>
                  <div>
                    <span className="text-ds-base text-ds-fg/70 font-mono block">Sante Reseau</span>
                    <span className="text-ds-xs text-ds-fg/40 font-mono">Derniere verif: 2min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: Form Elements (Interactive)
         ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-ds-4 relative z-10 pt-ds-4">
        <SectionHeader icon={CheckCircle2} iconColor="text-ds-emerald" glowColor="bg-ds-emerald/30" lineColor="from-ds-emerald" label="Formulaires Interactifs" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-ds-6">
          {/* Inputs with states */}
          <GlassCard className="p-ds-6">
            <CardTitle>Champs Texte</CardTitle>
            <div className="space-y-ds-4">
              <div className="space-y-ds-1_5">
                <label className="text-ds-sm text-ds-fg/60 font-mono">Defaut</label>
                <input type="text" placeholder="Entrez une valeur..." className="w-full bg-ds-surface-1 border border-ds-border/8 hover:border-ds-border/15 rounded-ds-md px-ds-3 py-ds-2 text-ds-base text-ds-fg/90 placeholder:text-ds-fg/30 focus:outline-none focus:border-ds-blue/50 shadow-[var(--ds-shadow-inset)] transition-all" />
              </div>
              <div className="space-y-ds-1_5">
                <label className="text-ds-sm text-ds-fg/60 font-mono flex items-center gap-ds-1"><Check size={10} className="text-ds-emerald" /> Succes</label>
                <input type="text" defaultValue="Valeur validee" className="w-full bg-ds-surface-1 border border-ds-emerald/30 rounded-ds-md px-ds-3 py-ds-2 text-ds-base text-ds-fg/90 focus:outline-none focus:border-ds-emerald/50 shadow-[var(--ds-shadow-inset),0_0_10px_rgba(52,211,153,0.1)] transition-all" />
              </div>
              <div className="space-y-ds-1_5">
                <label className="text-ds-sm text-ds-rose font-mono flex items-center gap-ds-1"><AlertCircle size={10} /> Erreur</label>
                <div className="relative">
                  <input type="text" defaultValue="Valeur incorrecte" className="w-full bg-ds-surface-1 border border-ds-rose/30 rounded-ds-md px-ds-3 py-ds-2 pr-8 text-ds-base text-ds-fg/90 focus:outline-none focus:border-ds-rose/50 shadow-[var(--ds-shadow-inset),0_0_10px_rgba(244,63,94,0.1)] transition-all" />
                  <AlertCircle size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ds-rose/70" />
                </div>
                <p className="text-ds-xs text-ds-rose/70 font-mono">Ce champ est requis</p>
              </div>
              <div className="space-y-ds-1_5">
                <label className="text-ds-sm text-ds-fg/60 font-mono">Mot de passe</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} defaultValue="secure123" className="w-full bg-ds-surface-1 border border-ds-border/8 hover:border-ds-border/15 rounded-ds-md px-ds-3 py-ds-2 pr-8 text-ds-base text-ds-fg/90 focus:outline-none focus:border-ds-blue/50 shadow-[var(--ds-shadow-inset)] transition-all" />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ds-fg/30 hover:text-ds-fg/70 transition-colors">
                    {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
              </div>
              <div className="space-y-ds-1_5">
                <label className="text-ds-sm text-ds-fg/60 font-mono">Textarea</label>
                <textarea placeholder="Description..." rows={3} className="w-full bg-ds-surface-1 border border-ds-border/8 hover:border-ds-border/15 rounded-ds-md px-ds-3 py-ds-2 text-ds-base text-ds-fg/90 placeholder:text-ds-fg/30 focus:outline-none focus:border-ds-blue/50 shadow-[var(--ds-shadow-inset)] transition-all resize-none" />
              </div>
              <div className="space-y-ds-1_5">
                <label className="text-ds-sm text-ds-fg/40 font-mono">Disabled</label>
                <input type="text" disabled placeholder="Non editable" className="w-full bg-ds-surface-1/50 border border-ds-border/[0.04] rounded-ds-md px-ds-3 py-ds-2 text-ds-base text-ds-fg/30 cursor-not-allowed" />
              </div>
            </div>
          </GlassCard>

          {/* Checkboxes & Radios */}
          <GlassCard className="p-ds-6">
            <CardTitle>Selection (interactif)</CardTitle>
            <div className="space-y-ds-6">
              <div className="space-y-ds-3">
                <span className="text-ds-sm text-ds-fg/40 font-mono">Checkboxes</span>
                {[
                  { key: "opt1", label: "Notifications push" },
                  { key: "opt2", label: "Alertes de securite" },
                  { key: "opt3", label: "Newsletter hebdo" },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-ds-3 cursor-pointer group/cb" onClick={() => toggleCheck(item.key)}>
                    <motion.div
                      className={`w-ds-4 h-ds-4 rounded-ds-sm flex items-center justify-center transition-all ${
                        checks[item.key]
                          ? 'bg-ds-blue/20 border border-ds-blue/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                          : 'bg-ds-surface-1 border border-ds-border/10 group-hover/cb:border-ds-border/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]'
                      }`}
                      whileTap={{ scale: 0.85 }}
                    >
                      <AnimatePresence>
                        {checks[item.key] && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}>
                            <Check size={10} strokeWidth={3} className="text-ds-blue" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    <span className={`text-ds-base ${checks[item.key] ? 'text-ds-fg/90' : 'text-ds-fg/70 group-hover/cb:text-ds-fg/90'} transition-colors`}>{item.label}</span>
                  </label>
                ))}
                <label className="flex items-center gap-ds-3 cursor-not-allowed opacity-40">
                  <div className="w-ds-4 h-ds-4 rounded-ds-sm bg-ds-surface-1 border border-ds-border/10" />
                  <span className="text-ds-base text-ds-fg/70">Desactivee</span>
                </label>
              </div>

              <div className="space-y-ds-3">
                <span className="text-ds-sm text-ds-fg/40 font-mono">Radio Buttons</span>
                {[
                  { value: "alpha", label: "Reseau Alpha", sublabel: "Low latency" },
                  { value: "beta", label: "Reseau Beta", sublabel: "High throughput" },
                  { value: "gamma", label: "Reseau Gamma", sublabel: "Balanced" },
                ].map((item) => (
                  <label key={item.value} className="flex items-center gap-ds-3 cursor-pointer group/rad" onClick={() => setSelectedRadio(item.value)}>
                    <div className={`w-ds-4 h-ds-4 rounded-ds-full flex items-center justify-center transition-all ${
                      selectedRadio === item.value
                        ? 'bg-ds-surface-1 border border-ds-purple/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                        : 'bg-ds-surface-1 border border-ds-border/10 group-hover/rad:border-ds-border/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]'
                    }`}>
                      <AnimatePresence>
                        {selectedRadio === item.value && (
                          <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="w-ds-2 h-ds-2 rounded-ds-full bg-ds-purple shadow-[0_0_5px_rgba(168,85,247,0.8)]"
                          />
                        )}
                      </AnimatePresence>
                    </div>
                    <div>
                      <span className={`text-ds-base ${selectedRadio === item.value ? 'text-ds-fg/90' : 'text-ds-fg/70'} transition-colors block`}>{item.label}</span>
                      <span className="text-ds-xs text-ds-fg/30 font-mono">{item.sublabel}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Toggles & Sliders */}
          <GlassCard className="p-ds-6">
            <CardTitle>Toggles & Sliders</CardTitle>
            <div className="space-y-ds-5">
              {[
                { key: "auto", label: "Auto-Scaling", desc: "Ajustement dynamique" },
                { key: "perf", label: "Mode Haute Perf.", desc: "Performances max" },
                { key: "notif", label: "Notifications", desc: "Push & in-app" },
                { key: "dark", label: "Mode Sombre", desc: "Theme UI" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-ds-base text-ds-fg/90">{item.label}</p>
                    <p className={`text-ds-xs font-mono mt-0.5 transition-colors ${toggles[item.key] ? 'text-ds-emerald drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]' : 'text-ds-fg/40'}`}>
                      {toggles[item.key] ? 'Actif' : 'Inactif'}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleToggle(item.key)}
                    className={`w-9 h-5 rounded-ds-full relative transition-all duration-300 ${
                      toggles[item.key]
                        ? 'bg-ds-emerald/20 border border-ds-emerald/30 shadow-[0_0_10px_rgba(52,211,153,0.1)]'
                        : 'bg-ds-surface-1 border border-ds-border/10 hover:border-ds-border/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]'
                    }`}
                  >
                    <motion.div
                      className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-ds-full transition-colors ${
                        toggles[item.key] ? 'bg-ds-emerald shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-ds-fg/30'
                      }`}
                      animate={{ left: toggles[item.key] ? 19 : 3 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              ))}

              <div className="pt-ds-4 border-t border-ds-border/5 space-y-ds-2">
                <div className="flex justify-between items-center text-ds-sm font-mono text-ds-fg/40">
                  <span>Limite GPU</span>
                  <span className="text-ds-blue">{sliderVal}%</span>
                </div>
                <input
                  type="range" min={0} max={100}
                  value={sliderVal}
                  onChange={(e) => setSliderVal(Number(e.target.value))}
                  className="w-full h-1.5 bg-ds-surface-1 rounded-ds-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-ds-fg [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-ds-blue [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(255,255,255,0.5)] [&::-webkit-slider-thumb]:cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, rgba(59,130,246,0.5) 0%, rgba(59,130,246,1) ${sliderVal}%, #050505 ${sliderVal}%)`
                  }}
                />
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5: Crypto-Native Components
         ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-ds-4 relative z-10 pt-ds-4">
        <SectionHeader icon={Wallet} iconColor="text-ds-sky" glowColor="bg-ds-sky/30" lineColor="from-ds-sky" label="Composants Crypto-Natifs" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-ds-6">
          {/* Wallet Balance */}
          <GlassCard className="p-ds-5" glow="top-[-20%] left-[-10%] bg-ds-sky/10">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-ds-4">
                <div className="flex items-center gap-ds-2">
                  <div className="w-7 h-7 rounded-ds-full bg-gradient-to-br from-ds-blue/20 to-ds-purple/20 border border-ds-border/10 flex items-center justify-center">
                    <Wallet size={12} className="text-ds-blue" />
                  </div>
                  <div>
                    <p className="text-ds-sm text-ds-fg/40 font-mono">Wallet Principal</p>
                    <div className="flex items-center gap-ds-1_5">
                      <code className="text-ds-sm text-ds-blue/80 font-mono">0x8A9F...2F9C</code>
                      <CopyButton text="0x8A9F12345678902F9C" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-ds-3">
                <div>
                  <p className="text-ds-xs text-ds-fg/40 font-mono uppercase tracking-wider mb-ds-1">Solde Total</p>
                  <div className="flex items-end gap-ds-2">
                    <span className="text-ds-2xl tracking-tighter text-ds-fg/90">${animatedTVL.toFixed(2)}M</span>
                    <span className="text-ds-emerald text-ds-sm font-mono mb-ds-1 flex items-center gap-0.5 bg-ds-emerald/10 px-ds-1_5 py-0.5 rounded-ds-sm">
                      <TrendingUp size={9} /> +5.2%
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-ds-2 pt-ds-3 border-t border-ds-border/5">
                  {[
                    { token: "ETH", amount: "12.45", usd: "$38,240", icon: "⟠" },
                    { token: "USDC", amount: "4,200", usd: "$4,200", icon: "◉" },
                  ].map((t, i) => (
                    <div key={i} className="p-ds-2 rounded-ds-md bg-ds-fg/[0.02] border border-ds-border/[0.03]">
                      <div className="flex items-center gap-ds-1_5 mb-ds-1">
                        <span className="text-ds-md">{t.icon}</span>
                        <span className="text-ds-sm text-ds-fg/70 font-mono">{t.token}</span>
                      </div>
                      <p className="text-ds-base text-ds-fg/90 font-mono">{t.amount}</p>
                      <p className="text-ds-xs text-ds-fg/40 font-mono">{t.usd}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Gas Estimator */}
          <GlassCard className="p-ds-5">
            <div className="relative z-10">
              <div className="flex items-center gap-ds-2 mb-ds-4">
                <Gauge size={14} className="text-ds-amber" />
                <h3 className="text-ds-base text-ds-fg/90">Estimation Gas</h3>
              </div>
              <div className="flex gap-ds-2 mb-ds-4">
                {([
                  { key: 'slow' as const, label: 'Lent', time: '~5 min', icon: '🐢' },
                  { key: 'standard' as const, label: 'Standard', time: '~2 min', icon: '⚡' },
                  { key: 'fast' as const, label: 'Rapide', time: '~30s', icon: '🚀' },
                ]).map((opt) => (
                  <button key={opt.key} onClick={() => setGasSpeed(opt.key)} className={`flex-1 p-ds-2_5 rounded-ds-lg border text-center transition-all ${
                    gasSpeed === opt.key
                      ? 'bg-ds-amber/10 border-ds-amber/30 shadow-[0_0_12px_rgba(251,191,36,0.1)]'
                      : 'bg-ds-fg/[0.02] border-ds-border/5 hover:border-ds-border/10'
                  }`}>
                    <span className="text-ds-lg block mb-ds-1">{opt.icon}</span>
                    <span className={`text-ds-sm block ${gasSpeed === opt.key ? 'text-ds-amber' : 'text-ds-fg/60'}`}>{opt.label}</span>
                    <span className={`text-ds-xs font-mono block mt-0.5 ${gasSpeed === opt.key ? 'text-ds-amber/80' : 'text-ds-fg/30'}`}>{opt.time}</span>
                  </button>
                ))}
              </div>
              <div className="p-ds-3 rounded-ds-md bg-ds-surface-1 border border-ds-border/5 space-y-ds-2">
                <div className="flex justify-between text-ds-sm">
                  <span className="text-ds-fg/40 font-mono">Gas Price</span>
                  <span className="text-ds-amber font-mono">{animatedGas.toFixed(0)} Gwei</span>
                </div>
                <div className="flex justify-between text-ds-sm">
                  <span className="text-ds-fg/40 font-mono">Cout estime</span>
                  <span className="text-ds-fg/80 font-mono">~${(animatedGas * 0.052).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Swap Preview */}
          <GlassCard className="p-ds-5">
            <div className="relative z-10">
              <div className="flex items-center gap-ds-2 mb-ds-4">
                <Repeat size={14} className="text-ds-purple" />
                <h3 className="text-ds-base text-ds-fg/90">Swap Preview</h3>
              </div>
              <div className="space-y-ds-2">
                <div className="p-ds-3 rounded-ds-lg bg-ds-surface-1 border border-ds-border/5">
                  <div className="flex items-center justify-between mb-ds-2">
                    <span className="text-ds-xs text-ds-fg/40 font-mono uppercase">From</span>
                    <span className="text-ds-xs text-ds-fg/30 font-mono">Balance: 12.45</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <input type="text" defaultValue="1.0" className="bg-transparent text-ds-xl text-ds-fg/90 font-mono w-20 focus:outline-none" />
                    <div className="flex items-center gap-ds-1_5 px-ds-2_5 py-ds-1 rounded-ds-full bg-ds-fg/5 border border-ds-border/8">
                      <span className="text-ds-md">⟠</span>
                      <span className="text-ds-md text-ds-fg/90">ETH</span>
                      <ChevronDown size={10} className="text-ds-fg/40" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-center -my-1 relative z-10">
                  <button className="w-7 h-7 rounded-ds-full bg-ds-surface-2 border border-ds-border/10 flex items-center justify-center text-ds-fg/40 hover:text-ds-fg/80 hover:border-ds-border/20 transition-all hover:rotate-180 duration-300">
                    <ArrowDownUp size={12} />
                  </button>
                </div>
                <div className="p-ds-3 rounded-ds-lg bg-ds-surface-1 border border-ds-border/5">
                  <div className="flex items-center justify-between mb-ds-2">
                    <span className="text-ds-xs text-ds-fg/40 font-mono uppercase">To</span>
                    <span className="text-ds-xs text-ds-fg/30 font-mono">Balance: 4,200</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ds-xl text-ds-fg/60 font-mono">3,064.12</span>
                    <div className="flex items-center gap-ds-1_5 px-ds-2_5 py-ds-1 rounded-ds-full bg-ds-fg/5 border border-ds-border/8">
                      <span className="text-ds-md">◉</span>
                      <span className="text-ds-md text-ds-fg/90">USDC</span>
                      <ChevronDown size={10} className="text-ds-fg/40" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-ds-2 text-ds-xs font-mono">
                  <span className="text-ds-fg/30">1 ETH ≈ 3,064.12 USDC</span>
                  <span className="text-ds-fg/30">Slippage: 0.5%</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 6: Navigation, Select & Shortcuts
         ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-ds-4 relative z-10 pt-ds-4">
        <SectionHeader icon={Columns3} iconColor="text-ds-cyan" glowColor="bg-ds-cyan/30" lineColor="from-ds-cyan" label="Navigation, Select & Raccourcis" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-ds-6">
          {/* Breadcrumbs & Tabs */}
          <GlassCard className="p-ds-6">
            <CardTitle>Breadcrumbs</CardTitle>
            <nav className="flex items-center gap-ds-1_5 text-ds-md mb-ds-6">
              <a className="text-ds-fg/40 hover:text-ds-fg/80 transition-colors cursor-pointer flex items-center gap-ds-1"><Home size={10} /> Home</a>
              <ChevronRight size={10} className="text-ds-fg/20" />
              <a className="text-ds-fg/40 hover:text-ds-fg/80 transition-colors cursor-pointer">Dashboard</a>
              <ChevronRight size={10} className="text-ds-fg/20" />
              <span className="text-ds-fg/90">Analytics</span>
            </nav>

            <CardTitle>Tabs</CardTitle>
            <div className="border-b border-ds-border/5">
              <div className="flex gap-0">
                {["Overview", "Analytics", "Logs", "Settings"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveNavTab(tab.toLowerCase())}
                    className={`relative px-ds-3 py-ds-2 text-ds-md transition-all ${
                      activeNavTab === tab.toLowerCase() ? 'text-ds-fg/90' : 'text-ds-fg/40 hover:text-ds-fg/70'
                    }`}
                  >
                    {tab}
                    {activeNavTab === tab.toLowerCase() && (
                      <motion.div layoutId="activeTabLine" className="absolute bottom-0 left-0 right-0 h-[2px] bg-ds-blue" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-ds-3 p-ds-3 rounded-ds-md bg-ds-fg/[0.02] border border-ds-border/[0.03]">
              <p className="text-ds-sm text-ds-fg/50 font-mono">
                {activeNavTab === "overview" && "Vue d'ensemble du systeme et metriques cles."}
                {activeNavTab === "analytics" && "Analyse detaillee des performances reseau."}
                {activeNavTab === "logs" && "Journal d'activite en temps reel."}
                {activeNavTab === "settings" && "Configuration et preferences systeme."}
              </p>
            </div>
          </GlassCard>

          {/* Select / Dropdown */}
          <GlassCard className="p-ds-6">
            <CardTitle>Select (Dropdown)</CardTitle>
            <div className="relative">
              <button
                onClick={() => setSelectOpen(!selectOpen)}
                className={`w-full flex items-center justify-between px-ds-3 py-ds-2 bg-ds-surface-1 border rounded-ds-md text-ds-base text-ds-fg/90 transition-all ${selectOpen ? 'border-ds-blue/50 shadow-[0_0_12px_rgba(59,130,246,0.1)]' : 'border-ds-border/8 hover:border-ds-border/15'}`}
              >
                <div className="flex items-center gap-ds-2">
                  <Globe size={12} className="text-ds-blue" />
                  <span>{selectValue}</span>
                </div>
                <motion.div animate={{ rotate: selectOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={12} className="text-ds-fg/40" />
                </motion.div>
              </button>
              <AnimatePresence>
                {selectOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-ds-1 bg-ds-surface-2 border border-ds-border/10 rounded-ds-lg shadow-[var(--ds-shadow-dropdown),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden z-50"
                  >
                    {["Ethereum Mainnet", "Polygon", "Arbitrum One", "Optimism", "Base"].map((net) => (
                      <button key={net} onClick={() => { setSelectValue(net); setSelectOpen(false); }} className={`w-full flex items-center justify-between px-ds-3 py-ds-2 text-ds-base transition-colors ${
                        selectValue === net ? 'bg-ds-blue/10 text-ds-blue' : 'text-ds-fg/70 hover:bg-ds-fg/[0.03]'
                      }`}>
                        {net}
                        {selectValue === net && <Check size={12} />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <h3 className="text-ds-sm uppercase tracking-wider text-ds-fg/40 font-mono mt-ds-6 mb-ds-4">Raccourcis Clavier</h3>
            <div className="space-y-ds-2">
              {[
                { keys: ["⌘", "K"], desc: "Recherche rapide" },
                { keys: ["⌘", "⇧", "P"], desc: "Palette de commandes" },
                { keys: ["⌘", "D"], desc: "Deployer" },
                { keys: ["Esc"], desc: "Fermer" },
              ].map((shortcut, i) => (
                <div key={i} className="flex items-center justify-between py-ds-1">
                  <span className="text-ds-sm text-ds-fg/60">{shortcut.desc}</span>
                  <div className="flex items-center gap-ds-1">
                    {shortcut.keys.map((k, j) => (
                      <kbd key={j} className="px-ds-1_5 py-0.5 rounded-ds-sm border border-ds-border/10 bg-ds-fg/5 text-ds-xs text-ds-fg/50 font-mono min-w-[20px] text-center shadow-[0_1px_0_rgba(255,255,255,0.05)]">
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Tooltip & Empty State */}
          <GlassCard className="p-ds-6">
            <CardTitle>Tooltip</CardTitle>
            <div className="flex justify-center gap-ds-4 mb-ds-6">
              <div className="relative group/tooltip inline-block">
                <button className="p-ds-2 rounded-ds-full bg-ds-fg/[0.03] border border-ds-border/5 text-ds-fg/60 hover:text-ds-fg/90 hover:bg-ds-fg/[0.06] transition-all">
                  <HelpCircle size={16} />
                </button>
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-ds-3 py-ds-1_5 rounded-ds-md bg-ds-surface-2 border border-ds-border/10 shadow-[0_10px_20px_rgba(0,0,0,0.5)] opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50">
                  <span className="text-ds-sm text-ds-fg/90 font-mono">Details API</span>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-ds-border/10" />
                </div>
              </div>
            </div>

            <CardTitle>Empty State</CardTitle>
            <div className="flex flex-col items-center justify-center py-ds-5 px-ds-4 rounded-ds-lg border border-dashed border-ds-border/8 bg-ds-fg/[0.01]">
              <div className="w-ds-10 h-ds-10 rounded-ds-full bg-ds-fg/[0.03] border border-ds-border/5 flex items-center justify-center mb-ds-3">
                <Inbox size={18} className="text-ds-fg/20" />
              </div>
              <p className="text-ds-base text-ds-fg/50 mb-ds-1">Aucune donnee</p>
              <p className="text-ds-sm text-ds-fg/30 mb-ds-3 text-center">Connectez un wallet pour commencer.</p>
              <button className="px-ds-3 py-ds-1_5 rounded-ds-md bg-ds-fg/5 border border-ds-border/8 text-ds-sm text-ds-fg/70 hover:bg-ds-fg/10 transition-all flex items-center gap-ds-1_5">
                <Plus size={10} /> Connecter
              </button>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 7: Typography
         ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-ds-4 relative z-10 border-t border-ds-border/5 pt-ds-8 mt-ds-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-ds-8">
          <div>
            <h2 className="text-ds-lg text-ds-fg/90 mb-ds-4">Hierarchie Typographique</h2>
            <div className="space-y-ds-4">
              {[
                { level: "Display H1", el: <h1 className="text-ds-display tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-ds-fg to-ds-fg/50">Dashboard</h1> },
                { level: "Heading H2", el: <h2 className="text-ds-xl text-ds-fg/90">Analytique Data</h2> },
                { level: "Heading H3", el: <h3 className="text-ds-lg text-ds-fg/80">Metriques Reseau</h3> },
                { level: "Body Text", el: <p className="text-ds-base text-ds-fg/60 leading-relaxed">Les modeles d'IA traitent les transactions avec une latence de 24ms. <span className="text-ds-fg">Reseau stable.</span></p> },
                { level: "Caption", el: <p className="text-ds-sm text-ds-fg/40 leading-relaxed">Derniere mise a jour il y a 2 minutes · Bloc #18,429,012</p> },
              ].map((t, i) => (
                <div key={i} className="pb-ds-3 border-b border-ds-border/5">
                  <p className="text-ds-xs uppercase tracking-wider text-ds-fg/40 font-mono mb-ds-1">{t.level}</p>
                  {t.el}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-ds-lg text-ds-fg/90 mb-ds-4">Donnees & Monospace</h2>
            <div className="space-y-ds-4">
              <div className="pb-ds-3 border-b border-ds-border/5 flex items-end gap-ds-2">
                <div>
                  <p className="text-ds-xs uppercase tracking-wider text-ds-fg/40 font-mono mb-ds-1">Metric Value</p>
                  <p className="text-ds-display tracking-tighter text-ds-fg/90">8,492</p>
                </div>
                <span className="text-ds-emerald font-mono text-ds-sm mb-ds-1 bg-ds-emerald/10 px-ds-1 py-0.5 rounded-ds-sm">+2.4%</span>
              </div>
              <div className="pb-ds-3 border-b border-ds-border/5">
                <p className="text-ds-xs uppercase tracking-wider text-ds-fg/40 font-mono mb-ds-1">Hash / Address</p>
                <div className="flex items-center gap-ds-2">
                  <code className="px-ds-1_5 py-0.5 rounded-ds-sm bg-ds-surface-1 border border-ds-border/8 text-ds-sm text-ds-blue/90 font-mono">0x8A9F...2F9C</code>
                  <CopyButton text="0x8A9F12345678902F9C" />
                  <button className="text-ds-fg/30 hover:text-ds-fg/90 transition-colors p-0.5"><ExternalLink size={10} /></button>
                </div>
              </div>
              <div className="pb-ds-3 border-b border-ds-border/5">
                <p className="text-ds-xs uppercase tracking-wider text-ds-fg/40 font-mono mb-ds-1">Log</p>
                <code className="text-ds-sm text-ds-fg/40 font-mono">
                  [14:32:01] INFO: <span className="text-ds-emerald">SYNC_OK</span>
                </code>
              </div>
              <div className="pb-ds-3 border-b border-ds-border/5">
                <p className="text-ds-xs uppercase tracking-wider text-ds-fg/40 font-mono mb-ds-1">Code Block</p>
                <pre className="bg-ds-surface-1 border border-ds-border/5 rounded-ds-md p-ds-3 text-ds-sm font-mono text-ds-fg/60 overflow-x-auto">
{`const tx = await wallet.send({
  to: "0x8A9F...2F9C",
  value: parseEther("0.05"),
  gasLimit: 21000n,
});`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 8: Notifications, Alerts & Modal
         ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-ds-4 relative z-10 pt-ds-4">
        <SectionHeader icon={Bell} iconColor="text-ds-amber" glowColor="bg-ds-amber/30" lineColor="from-ds-amber" label="Notifications, Alertes & Modal" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-ds-6">
          <GlassCard className="p-ds-6 space-y-ds-3">
            <CardTitle>Bannieres</CardTitle>
            {[
              { icon: Info, iconCls: "text-ds-blue", bgCls: "bg-ds-blue/10", borderCls: "border-ds-blue/20", barCls: "bg-ds-blue/50", title: "Mise a jour disponible", desc: "Nouvelle version du client Nexus Node prete." },
              { icon: CheckCircle2, iconCls: "text-ds-emerald", bgCls: "bg-ds-emerald/10", borderCls: "border-ds-emerald/20", barCls: "bg-ds-emerald/50", title: "Transaction Confirmee", desc: "0.05 ETH envoyes avec succes vers 0x8A9F...2F9C." },
              { icon: AlertTriangle, iconCls: "text-ds-amber", bgCls: "bg-ds-amber/10", borderCls: "border-ds-amber/20", barCls: "bg-ds-amber/50", title: "Charge Reseau Elevee", desc: "Latence augmentee de 12ms sur les requetes." },
              { icon: ShieldAlert, iconCls: "text-ds-rose", bgCls: "bg-ds-rose/10", borderCls: "border-ds-rose/20", barCls: "bg-ds-rose/50", title: "Echec de Synchronisation", desc: "Noeud Gamma deconnecte. Reconnexion..." },
            ].map((alert, i) => (
              <div key={i} className={`p-ds-3 rounded-ds-lg ${alert.bgCls} border ${alert.borderCls} flex gap-ds-3 relative overflow-hidden`}>
                <div className={`absolute left-0 top-0 bottom-0 w-ds-1 ${alert.barCls}`} />
                <alert.icon size={14} className={`${alert.iconCls} mt-0.5 shrink-0`} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-ds-md text-ds-fg/90 mb-0.5">{alert.title}</h4>
                  <p className="text-ds-sm text-ds-fg/60 leading-relaxed">{alert.desc}</p>
                </div>
                <button className="text-ds-fg/20 hover:text-ds-fg/60 transition-colors shrink-0 mt-0.5"><X size={12} /></button>
              </div>
            ))}
          </GlassCard>

          <div className="space-y-ds-6">
            {/* Toast Variants */}
            <GlassCard className="p-ds-6">
              <CardTitle>Toasts (Variantes)</CardTitle>
              <div className="space-y-ds-2">
                {[
                  { icon: CheckCircle2, iconClass: "text-ds-emerald", bgClass: "bg-ds-emerald/10 border-ds-emerald/20", title: "Deploiement reussi", desc: "Agent Llama-3 deploye.", time: "Now" },
                  { icon: AlertTriangle, iconClass: "text-ds-amber", bgClass: "bg-ds-amber/10 border-ds-amber/20", title: "Gas eleve", desc: "Attendez un moment pour economiser.", time: "2min" },
                  { icon: ShieldAlert, iconClass: "text-ds-rose", bgClass: "bg-ds-rose/10 border-ds-rose/20", title: "Erreur reseau", desc: "Impossible de se connecter au RPC.", time: "5min" },
                  { icon: Loader2, iconClass: "text-ds-blue animate-spin", bgClass: "bg-ds-blue/10 border-ds-blue/20", title: "Transaction en cours...", desc: "Confirmation bloc #18429012", time: "" },
                ].map((toast, i) => (
                  <div key={i} className="p-ds-2_5 rounded-ds-lg bg-ds-surface-2/95 border border-ds-border/8 shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-start gap-ds-2_5">
                    <div className={`w-ds-5 h-ds-5 rounded-ds-full ${toast.bgClass} border flex items-center justify-center shrink-0 mt-0.5`}>
                      <toast.icon size={10} className={toast.iconClass} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="text-ds-md text-ds-fg/90">{toast.title}</p>
                        {toast.time && <span className="text-ds-2xs text-ds-fg/30 font-mono ml-ds-2">{toast.time}</span>}
                      </div>
                      <p className="text-ds-xs text-ds-fg/50 mt-0.5">{toast.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-ds-6">
              <CardTitle>Modal / Dialog</CardTitle>
              <button onClick={() => setModalOpen(true)} className="px-ds-4 py-ds-2 rounded-ds-md bg-ds-fg/5 border border-ds-border/8 text-ds-base text-ds-fg/80 hover:bg-ds-fg/10 hover:border-ds-border/15 transition-all flex items-center gap-ds-2">
                <Maximize2 size={12} /> Ouvrir Modal
              </button>
            </GlassCard>
          </div>
        </div>

        {/* Modal Overlay */}
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-ds-4"
              onClick={() => setModalOpen(false)}
            >
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md bg-ds-surface-2 border border-ds-border/10 rounded-ds-xl shadow-[var(--ds-shadow-modal)] overflow-hidden"
              >
                <div className="absolute inset-x-0 top-0 h-ds-px bg-gradient-to-r from-transparent via-ds-blue/40 to-transparent" />
                <div className="p-ds-5">
                  <div className="flex items-center justify-between mb-ds-4">
                    <h3 className="text-ds-lg text-ds-fg/90 flex items-center gap-ds-2">
                      <Shield size={14} className="text-ds-blue" /> Confirmer la transaction
                    </h3>
                    <button onClick={() => setModalOpen(false)} className="text-ds-fg/30 hover:text-ds-fg/80 transition-colors p-ds-1 rounded-ds-sm hover:bg-ds-fg/5">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="space-y-ds-3 mb-ds-5">
                    {[
                      { label: "Montant", value: "0.05 ETH", mono: false },
                      { label: "Destination", value: "0x8A9F...2F9C", mono: true },
                      { label: "Gas estime", value: "~$1.24", mono: false },
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between py-ds-2 border-b border-ds-border/5 text-ds-base">
                        <span className="text-ds-fg/40 font-mono">{row.label}</span>
                        <span className={`text-ds-fg/90 ${row.mono ? 'font-mono text-ds-md' : ''}`}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-ds-3">
                    <button onClick={() => setModalOpen(false)} className="flex-1 px-ds-4 py-ds-2_5 rounded-ds-lg bg-ds-fg/[0.03] border border-ds-border/8 text-ds-base text-ds-fg/70 hover:bg-ds-fg/[0.06] transition-all">Annuler</button>
                    <button onClick={() => setModalOpen(false)} className="flex-1 px-ds-4 py-ds-2_5 rounded-ds-lg bg-ds-fg text-ds-surface-0 text-ds-base hover:bg-ds-fg/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-[0.97]">Confirmer</button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 9: Accordion (Interactive)
         ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-ds-4 relative z-10 pt-ds-4">
        <SectionHeader icon={Layers} iconColor="text-ds-blue" glowColor="bg-ds-blue/30" lineColor="from-ds-blue" label="Accordion (Interactif)" />

        <GlassCard className="p-ds-6">
          <div className="space-y-ds-2 max-w-3xl mx-auto">
            {[
              {
                title: "Details de la Transaction",
                badge: "#0x8F2A...9C1",
                content: (
                  <div className="grid grid-cols-2 gap-ds-4">
                    <div>
                      <span className="text-ds-xs uppercase tracking-wider text-ds-fg/40 font-mono block mb-ds-1">Montant</span>
                      <span className="text-ds-lg text-ds-fg/90">1.24 ETH</span>
                    </div>
                    <div>
                      <span className="text-ds-xs uppercase tracking-wider text-ds-fg/40 font-mono block mb-ds-1">Frais</span>
                      <span className="text-ds-lg text-ds-fg/60">0.0012 ETH</span>
                    </div>
                    <div>
                      <span className="text-ds-xs uppercase tracking-wider text-ds-fg/40 font-mono block mb-ds-1">Confirmations</span>
                      <span className="inline-flex items-center gap-ds-1 text-ds-sm font-mono text-ds-emerald bg-ds-emerald/10 px-ds-1_5 py-0.5 rounded-ds-sm border border-ds-emerald/20">
                        12 / 12 BLOCKS
                      </span>
                    </div>
                    <div>
                      <span className="text-ds-xs uppercase tracking-wider text-ds-fg/40 font-mono block mb-ds-1">Type</span>
                      <span className="text-ds-base text-ds-fg/60">Smart Contract Call</span>
                    </div>
                  </div>
                )
              },
              { title: "Historique d'Inference API", content: (
                <div className="space-y-ds-2">
                  {["Llama-3 70B → 128 tokens, 0.8s", "GPT-4o → 256 tokens, 1.2s", "Claude 3.5 → 192 tokens, 0.6s"].map((log, i) => (
                    <div key={i} className="flex items-center gap-ds-2 text-ds-sm font-mono text-ds-fg/50">
                      <Terminal size={10} className="text-ds-blue" /> {log}
                    </div>
                  ))}
                </div>
              )},
              { title: "Logs Systeme Securises", content: (
                <div className="space-y-ds-1_5">
                  {[
                    { time: "14:32:01", level: "INFO", msg: "SYNC_OK", cls: "text-ds-emerald" },
                    { time: "14:32:08", level: "WARN", msg: "HIGH_LATENCY", cls: "text-ds-amber" },
                    { time: "14:32:15", level: "INFO", msg: "BLOCK_CONFIRMED #18429012", cls: "text-ds-blue" },
                  ].map((log, i) => (
                    <code key={i} className="text-ds-sm text-ds-fg/40 font-mono block">
                      [{log.time}] {log.level}: <span className={log.cls}>{log.msg}</span>
                    </code>
                  ))}
                </div>
              )},
            ].map((item, i) => (
              <div key={i} className={`rounded-ds-lg overflow-hidden transition-all ${openAccordion === i ? 'bg-ds-surface-1 border border-ds-border/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]' : 'bg-transparent border border-ds-border/5 hover:border-ds-border/10 hover:bg-ds-surface-1'}`}>
                <button
                  onClick={() => setOpenAccordion(openAccordion === i ? null : i)}
                  className="w-full flex items-center justify-between p-ds-4 text-left hover:bg-ds-fg/[0.02] transition-colors"
                >
                  <span className="text-ds-base text-ds-fg/90 flex items-center gap-ds-2">
                    {item.title}
                    {item.badge && <span className="font-mono text-ds-sm text-ds-fg/40">{item.badge}</span>}
                  </span>
                  <motion.div animate={{ rotate: openAccordion === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={14} className="text-ds-fg/40" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openAccordion === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                      <div className="p-ds-4 pt-0 border-t border-ds-border/5 bg-ds-fg/[0.01]">
                        <div className="mt-ds-3">{item.content}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 10: Badges, Tags & Status
         ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-ds-4 relative z-10 pt-ds-4">
        <SectionHeader icon={Hexagon} iconColor="text-ds-orange" glowColor="bg-ds-orange/30" lineColor="from-ds-orange" label="Badges, Statuts & Labels" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-ds-6">
          <GlassCard className="p-ds-6">
            <CardTitle>Statuts (Glow)</CardTitle>
            <div className="flex flex-wrap gap-ds-3">
              <span className="inline-flex items-center gap-ds-1_5 px-ds-2_5 py-ds-1 rounded-ds-full bg-ds-emerald/10 border border-ds-emerald/20 text-ds-sm font-mono text-ds-emerald">
                <div className="w-ds-1_5 h-ds-1_5 rounded-ds-full bg-ds-emerald animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> Actif
              </span>
              <span className="inline-flex items-center gap-ds-1_5 px-ds-2_5 py-ds-1 rounded-ds-full bg-ds-amber/10 border border-ds-amber/20 text-ds-sm font-mono text-ds-amber">
                <div className="w-ds-1_5 h-ds-1_5 rounded-ds-full bg-ds-amber animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" /> En attente
              </span>
              <span className="inline-flex items-center gap-ds-1_5 px-ds-2_5 py-ds-1 rounded-ds-full bg-ds-rose/10 border border-ds-rose/20 text-ds-sm font-mono text-ds-rose">
                <div className="w-ds-1_5 h-ds-1_5 rounded-ds-full bg-ds-rose shadow-[0_0_8px_rgba(244,63,94,0.8)]" /> Erreur
              </span>
              <span className="inline-flex items-center gap-ds-1_5 px-ds-2_5 py-ds-1 rounded-ds-full bg-ds-blue/10 border border-ds-blue/20 text-ds-sm font-mono text-ds-blue">
                <RefreshCw size={10} className="animate-spin" /> Synchro
              </span>
              <span className="inline-flex items-center gap-ds-1_5 px-ds-2_5 py-ds-1 rounded-ds-full bg-ds-purple/10 border border-ds-purple/20 text-ds-sm font-mono text-ds-purple">
                <Loader2 size={10} className="animate-spin" /> Processing
              </span>
              <span className="inline-flex items-center gap-ds-1_5 px-ds-2_5 py-ds-1 rounded-ds-full bg-ds-fg/[0.03] border border-ds-border/8 text-ds-sm font-mono text-ds-fg/50">
                <div className="w-ds-1_5 h-ds-1_5 rounded-ds-full bg-ds-fg/30" /> Hors-ligne
              </span>
            </div>

            <h3 className="text-ds-sm uppercase tracking-wider text-ds-fg/40 font-mono mt-ds-6 mb-ds-4">Outline Badges</h3>
            <div className="flex flex-wrap gap-ds-2">
              <span className="inline-flex items-center px-ds-2 py-0.5 rounded-ds-sm text-ds-sm border border-ds-border/10 text-ds-fg/70 bg-ds-fg/[0.02]">Alpha</span>
              <span className="inline-flex items-center px-ds-2 py-0.5 rounded-ds-sm text-ds-sm border border-ds-border/10 text-ds-fg/70 bg-ds-fg/[0.02]">
                <Lock size={10} className="mr-ds-1 opacity-60" /> Securise
              </span>
              <span className="inline-flex items-center px-ds-2 py-0.5 rounded-ds-sm text-ds-sm border border-ds-blue/30 text-ds-blue bg-ds-blue/5">Nouveau</span>
              <span className="inline-flex items-center px-ds-2 py-0.5 rounded-ds-sm text-ds-sm border border-ds-border/10 text-ds-fg/70 bg-ds-fg/[0.02]">
                <Hash size={10} className="mr-ds-1 opacity-60" /> v2.0.1
              </span>
              <span className="inline-flex items-center px-ds-2 py-0.5 rounded-ds-sm text-ds-sm border border-ds-amber/30 text-ds-amber bg-ds-amber/5">
                <Star size={10} className="mr-ds-1 opacity-60" /> Premium
              </span>
            </div>
          </GlassCard>

          <GlassCard className="p-ds-6">
            <CardTitle>Tags (Supprimables)</CardTitle>
            <div className="flex flex-wrap gap-ds-2">
              <AnimatePresence>
                {tags.map((tag) => (
                  <motion.button
                    key={tag} layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                    className="inline-flex items-center gap-ds-1_5 px-ds-2_5 py-ds-1 rounded-ds-md bg-ds-fg/[0.03] border border-ds-border/5 text-ds-md text-ds-fg/80 hover:bg-ds-fg/8 hover:border-ds-border/10 transition-all group/tag"
                    onClick={() => removeTag(tag)}
                  >
                    {tag}
                    <X size={10} className="text-ds-fg/30 group-hover/tag:text-ds-fg/80 transition-colors" />
                  </motion.button>
                ))}
              </AnimatePresence>
              <button
                onClick={() => { if (!tags.includes('NFT')) setTags([...tags, 'NFT']); else if (!tags.includes('DAO')) setTags([...tags, 'DAO']); }}
                className="inline-flex items-center gap-ds-1 px-ds-2_5 py-ds-1 rounded-ds-md bg-transparent border border-dashed border-ds-border/15 text-ds-md text-ds-fg/40 hover:text-ds-fg/80 hover:border-ds-border/30 transition-all"
              >
                + Ajouter
              </button>
            </div>

            <CardTitle>Avatars & Groupes</CardTitle>
            <div className="flex items-center gap-ds-6">
              <div className="flex items-center -space-x-2">
                {[
                  "from-ds-purple/30 to-ds-blue/30",
                  "from-ds-emerald/30 to-ds-cyan/30",
                  "from-ds-amber/30 to-ds-orange/30",
                ].map((grad, i) => (
                  <div key={i} className={`w-ds-8 h-ds-8 rounded-ds-full bg-gradient-to-br ${grad} border-2 border-ds-surface-2 flex items-center justify-center text-ds-sm text-ds-fg/60 font-mono shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>
                    N{i + 1}
                  </div>
                ))}
                <div className="w-ds-8 h-ds-8 rounded-ds-full bg-ds-surface-1 border-2 border-ds-surface-2 flex items-center justify-center text-ds-xs text-ds-fg/40 hover:text-ds-fg/80 cursor-pointer transition-colors shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]">
                  +4
                </div>
              </div>
              <div className="flex items-center gap-ds-2 px-ds-2 py-ds-1 rounded-ds-md bg-ds-fg/[0.02] border border-ds-border/5">
                <div className="relative">
                  <div className="w-ds-6 h-ds-6 rounded-ds-full bg-gradient-to-br from-ds-purple/20 to-ds-blue/20 border border-ds-border/20 flex items-center justify-center text-ds-xs text-ds-fg/70 font-mono">0x</div>
                  <div className="absolute bottom-0 right-0 w-ds-2 h-ds-2 rounded-ds-full bg-ds-emerald border border-ds-surface-2" />
                </div>
                <div>
                  <span className="text-ds-sm text-ds-fg/80 block">0x8A..2F9</span>
                  <span className="text-ds-2xs text-ds-fg/30 font-mono">Premium</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 11: Data Table & Skeletons
         ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-ds-4 relative z-10 pt-ds-4">
        <SectionHeader icon={Table2} iconColor="text-ds-teal" glowColor="bg-ds-teal/30" lineColor="from-ds-teal" label="Table de Donnees & Loading" />

        <GlassCard className="overflow-hidden">
          <div className="p-ds-4 border-b border-ds-border/5 flex items-center justify-between">
            <h3 className="text-ds-base text-ds-fg/90">Transactions Recentes</h3>
            <div className="flex items-center gap-ds-2">
              <div className="relative">
                <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-ds-fg/30" />
                <input placeholder="Filtrer..." className="bg-ds-fg/[0.03] border border-ds-border/5 rounded-ds-md pl-6 pr-2 py-ds-1 text-ds-sm text-ds-fg/80 placeholder:text-ds-fg/30 focus:outline-none focus:border-ds-border/15 w-32 transition-all" />
              </div>
              <button className="p-ds-1_5 rounded-ds-md bg-ds-fg/[0.03] border border-ds-border/5 text-ds-fg/40 hover:text-ds-fg/80 hover:bg-ds-fg/[0.06] transition-all">
                <Filter size={10} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-ds-base">
              <thead>
                <tr className="border-b border-ds-border/5">
                  <th className="text-left py-ds-2_5 px-ds-4 text-ds-xs uppercase tracking-wider text-ds-fg/40 font-mono w-8"></th>
                  <th className="text-left py-ds-2_5 px-ds-4 text-ds-xs uppercase tracking-wider text-ds-fg/40 font-mono cursor-pointer hover:text-ds-fg/70 transition-colors">
                    <span className="flex items-center gap-ds-1">Hash <ArrowDownUp size={8} className="opacity-50" /></span>
                  </th>
                  <th className="text-left py-ds-2_5 px-ds-4 text-ds-xs uppercase tracking-wider text-ds-fg/40 font-mono">Type</th>
                  <th className="text-right py-ds-2_5 px-ds-4 text-ds-xs uppercase tracking-wider text-ds-fg/40 font-mono cursor-pointer hover:text-ds-fg/70 transition-colors">
                    <span className="flex items-center justify-end gap-ds-1">Montant <ArrowDownUp size={8} className="opacity-50" /></span>
                  </th>
                  <th className="text-left py-ds-2_5 px-ds-4 text-ds-xs uppercase tracking-wider text-ds-fg/40 font-mono">Statut</th>
                  <th className="text-right py-ds-2_5 px-ds-4 text-ds-xs uppercase tracking-wider text-ds-fg/40 font-mono">Date</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { hash: "0x8A9F...2F9C", type: "Transfer", typeIcon: ArrowUpRight, amount: "0.05 ETH", statusLabel: "Confirme", statusDot: "bg-ds-emerald", statusBg: "bg-ds-emerald/10", statusBorder: "border-ds-emerald/20", statusText: "text-ds-emerald", date: "Il y a 2min" },
                  { hash: "0x3B2E...7D1A", type: "Swap", typeIcon: Repeat, amount: "1,200 USDC", statusLabel: "Confirme", statusDot: "bg-ds-emerald", statusBg: "bg-ds-emerald/10", statusBorder: "border-ds-emerald/20", statusText: "text-ds-emerald", date: "Il y a 8min" },
                  { hash: "0x6C4D...9E3B", type: "Stake", typeIcon: Droplets, amount: "2.5 ETH", statusLabel: "En attente", statusDot: "bg-ds-amber animate-pulse", statusBg: "bg-ds-amber/10", statusBorder: "border-ds-amber/20", statusText: "text-ds-amber", date: "Il y a 15min" },
                  { hash: "0x1F8G...4H2K", type: "Bridge", typeIcon: Globe, amount: "500 DAI", statusLabel: "Echoue", statusDot: "bg-ds-rose", statusBg: "bg-ds-rose/10", statusBorder: "border-ds-rose/20", statusText: "text-ds-rose", date: "Il y a 32min" },
                  { hash: "0x9K2L...5M7N", type: "Mint", typeIcon: Flame, amount: "0.08 ETH", statusLabel: "Confirme", statusDot: "bg-ds-emerald", statusBg: "bg-ds-emerald/10", statusBorder: "border-ds-emerald/20", statusText: "text-ds-emerald", date: "Il y a 1h" },
                ].map((tx, i) => (
                  <tr key={i} className="border-b border-ds-border/[0.03] hover:bg-ds-fg/[0.02] transition-colors cursor-pointer group/row">
                    <td className="py-ds-2_5 px-ds-4">
                      <button onClick={() => toggleStar(i)} className="transition-colors">
                        <Star size={10} className={starredRows.has(i) ? 'text-ds-amber fill-current' : 'text-ds-fg/20 hover:text-ds-amber'} />
                      </button>
                    </td>
                    <td className="py-ds-2_5 px-ds-4 font-mono text-ds-blue/80 text-ds-md">{tx.hash}</td>
                    <td className="py-ds-2_5 px-ds-4">
                      <span className="flex items-center gap-ds-1_5 text-ds-fg/70">
                        <tx.typeIcon size={10} className="text-ds-fg/40" /> {tx.type}
                      </span>
                    </td>
                    <td className="py-ds-2_5 px-ds-4 text-right text-ds-fg/90 font-mono">{tx.amount}</td>
                    <td className="py-ds-2_5 px-ds-4">
                      <span className={`inline-flex items-center gap-ds-1 px-ds-2 py-0.5 rounded-ds-full ${tx.statusBg} border ${tx.statusBorder} text-ds-xs font-mono ${tx.statusText}`}>
                        <div className={`w-ds-1 h-ds-1 rounded-ds-full ${tx.statusDot}`} />
                        {tx.statusLabel}
                      </span>
                    </td>
                    <td className="py-ds-2_5 px-ds-4 text-right text-ds-fg/40 text-ds-sm font-mono">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-ds-3 border-t border-ds-border/5 flex items-center justify-between">
            <span className="text-ds-sm text-ds-fg/40 font-mono">5 resultats sur 48</span>
            <div className="flex items-center gap-ds-1">
              <button className="p-ds-1 rounded-ds-sm text-ds-fg/30 hover:text-ds-fg/70 hover:bg-ds-fg/5 transition-all"><ChevronsLeft size={12} /></button>
              <button className="p-ds-1 rounded-ds-sm text-ds-fg/30 hover:text-ds-fg/70 hover:bg-ds-fg/5 transition-all"><ChevronLeft size={12} /></button>
              {[1, 2, 3].map(p => (
                <button key={p} onClick={() => setTablePage(p)} className={`w-ds-6 h-ds-6 rounded-ds-sm text-ds-sm font-mono transition-all ${tablePage === p ? 'bg-ds-fg/8 text-ds-fg/90 border border-ds-border/10' : 'text-ds-fg/40 hover:text-ds-fg/70 hover:bg-ds-fg/[0.03]'}`}>
                  {p}
                </button>
              ))}
              <span className="text-ds-fg/20 text-ds-sm px-ds-1">...</span>
              <button className="w-ds-6 h-ds-6 rounded-ds-sm text-ds-sm font-mono text-ds-fg/40 hover:text-ds-fg/70 hover:bg-ds-fg/[0.03] transition-all">10</button>
              <button className="p-ds-1 rounded-ds-sm text-ds-fg/30 hover:text-ds-fg/70 hover:bg-ds-fg/5 transition-all"><ChevronRight size={12} /></button>
              <button className="p-ds-1 rounded-ds-sm text-ds-fg/30 hover:text-ds-fg/70 hover:bg-ds-fg/5 transition-all"><ChevronsRight size={12} /></button>
            </div>
          </div>
        </GlassCard>

        {/* Skeletons */}
        <GlassCard className="p-ds-6">
          <CardTitle>Skeleton States (Shimmer)</CardTitle>
          <style>{`
            @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
            .skeleton-shimmer { position: relative; overflow: hidden; }
            .skeleton-shimmer::after { content: ''; position: absolute; inset: 0; transform: translateX(-100%); background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent); animation: shimmer 2s infinite; }
          `}</style>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-ds-6">
            <div className="space-y-ds-3">
              <span className="text-ds-xs text-ds-fg/30 font-mono">Card Skeleton</span>
              <div className="p-ds-4 rounded-ds-lg bg-ds-fg/[0.02] border border-ds-border/5 space-y-ds-3">
                <div className="flex items-center gap-ds-3">
                  <div className="w-ds-8 h-ds-8 rounded-ds-md bg-ds-fg/[0.04] skeleton-shimmer" />
                  <div className="flex-1 space-y-ds-1_5">
                    <div className="w-2/3 h-2.5 rounded-ds-sm bg-ds-fg/[0.04] skeleton-shimmer" />
                    <div className="w-1/3 h-2 rounded-ds-sm bg-ds-fg/[0.03] skeleton-shimmer" />
                  </div>
                </div>
                <div className="w-full h-ds-1_5 rounded-ds-full bg-ds-fg/[0.03] skeleton-shimmer" />
              </div>
            </div>
            <div className="space-y-ds-3">
              <span className="text-ds-xs text-ds-fg/30 font-mono">List Skeleton</span>
              <div className="space-y-ds-2">
                {[1, 2, 3].map(n => (
                  <div key={n} className="flex items-center gap-ds-3 p-ds-2 rounded-ds-md">
                    <div className="w-ds-6 h-ds-6 rounded-ds-full bg-ds-fg/[0.04] skeleton-shimmer" />
                    <div className="flex-1 space-y-ds-1">
                      <div className="w-3/4 h-2.5 rounded-ds-sm bg-ds-fg/[0.04] skeleton-shimmer" />
                      <div className="w-1/2 h-2 rounded-ds-sm bg-ds-fg/[0.03] skeleton-shimmer" />
                    </div>
                    <div className="w-12 h-3 rounded-ds-sm bg-ds-fg/[0.03] skeleton-shimmer" />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-ds-3">
              <span className="text-ds-xs text-ds-fg/30 font-mono">Chart Skeleton</span>
              <div className="p-ds-4 rounded-ds-lg bg-ds-fg/[0.02] border border-ds-border/5">
                <div className="w-1/2 h-2.5 rounded-ds-sm bg-ds-fg/[0.04] skeleton-shimmer mb-ds-3" />
                <div className="flex items-end gap-ds-1 h-16">
                  {[30, 50, 35, 70, 45, 80, 60, 90, 55, 75].map((h, i) => (
                    <div key={i} className="flex-1 bg-ds-fg/[0.03] rounded-t-sm skeleton-shimmer" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 12: Data Visualization
         ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-ds-4 relative z-10 pt-ds-4">
        <SectionHeader icon={Activity} iconColor="text-ds-indigo" glowColor="bg-ds-indigo/30" lineColor="from-ds-indigo" label="Data Visualization" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-ds-6">
          <GlassCard className="p-ds-6">
            <CardTitle>Sparklines</CardTitle>
            <div className="space-y-ds-4">
              {[
                { label: "Total TVL", value: "$4.2M", data: [20, 35, 25, 45, 30, 50, 65, 55, 70, 85, 75, 90, 100], change: "+12.4%", up: true },
                { label: "Latence Moy.", value: "84ms", data: [40, 35, 45, 55, 50, 65, 60, 75, 80, 70, 85, 95, 90], change: "+5.2%", up: false },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-ds-3 rounded-ds-lg bg-ds-surface-1 border border-ds-border/5 hover:border-ds-border/8 transition-all">
                  <div>
                    <p className="text-ds-sm font-mono text-ds-fg/40 mb-ds-1">{item.label}</p>
                    <p className="text-ds-lg text-ds-fg/90">{item.value}</p>
                  </div>
                  <div className="w-24 h-8 relative flex items-end justify-between gap-0.5">
                    {item.data.map((h, i) => (
                      <motion.div
                        key={i}
                        className={`w-1.5 ${item.up ? 'bg-ds-emerald/30' : 'bg-ds-rose/30'} rounded-t-sm`}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 0.5, delay: i * 0.04 }}
                      >
                        <div className={`w-full h-0.5 ${item.up ? 'bg-ds-emerald' : 'bg-ds-rose'} rounded-t-sm`} />
                      </motion.div>
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-t from-ds-surface-1 to-transparent pointer-events-none" />
                  </div>
                  <div className="text-right">
                    <span className={`flex items-center justify-end gap-ds-1 text-ds-sm font-mono ${item.up ? 'text-ds-emerald' : 'text-ds-rose'}`}>
                      {item.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-ds-6">
            <CardTitle>Heatmap & Distribution</CardTitle>
            <div className="space-y-ds-6">
              <div>
                <div className="flex justify-between text-ds-xs font-mono text-ds-fg/60 mb-ds-1_5">
                  <span>Densite du Trafic (24h)</span>
                  <div className="flex items-center gap-ds-1">
                    <div className="w-ds-2 h-ds-2 rounded-ds-sm bg-ds-fg/[0.03]" /><span>Low</span>
                    <div className="w-ds-2 h-ds-2 rounded-ds-sm bg-ds-blue/60" /><span>High</span>
                  </div>
                </div>
                <div className="flex gap-0.5 h-ds-5 w-full">
                  {[15, 10, 5, 8, 12, 25, 45, 80, 95, 75, 60, 55, 70, 85, 90, 65, 50, 40, 55, 70, 45, 30, 20, 15].map((v, i) => (
                    <div key={i} className={`flex-1 rounded-ds-sm transition-colors hover:brightness-150 cursor-pointer ${
                      v > 80 ? 'bg-ds-blue' : v > 50 ? 'bg-ds-blue/60' : v > 20 ? 'bg-ds-blue/30' : 'bg-ds-fg/[0.04]'
                    }`} title={`${i}h: ${v}%`} />
                  ))}
                </div>
                <div className="flex justify-between text-ds-2xs text-ds-fg/20 font-mono mt-ds-1">
                  <span>00h</span><span>06h</span><span>12h</span><span>18h</span><span>23h</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-ds-xs font-mono text-ds-fg/60 mb-ds-1_5">
                  <span>Allocation Ressources</span><span>100%</span>
                </div>
                <div className="h-ds-3 w-full bg-ds-surface-1 rounded-ds-sm flex overflow-hidden border border-ds-border/5">
                  <div className="h-full bg-ds-blue/80 w-[45%]" title="CPU: 45%" />
                  <div className="h-full bg-ds-purple/80 w-[30%] border-l border-ds-surface-2" title="RAM: 30%" />
                  <div className="h-full bg-ds-emerald/80 w-[15%] border-l border-ds-surface-2" title="NET: 15%" />
                  <div className="h-full bg-ds-fg/10 w-[10%] border-l border-ds-surface-2" title="Idle: 10%" />
                </div>
                <div className="flex gap-ds-4 mt-ds-2">
                  {[
                    { label: "CPU", color: "bg-ds-blue", pct: "45%" },
                    { label: "RAM", color: "bg-ds-purple", pct: "30%" },
                    { label: "NET", color: "bg-ds-emerald", pct: "15%" },
                    { label: "Idle", color: "bg-ds-fg/30", pct: "10%" },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center gap-ds-1">
                      <div className={`w-ds-1_5 h-ds-1_5 rounded-ds-full ${r.color}`} />
                      <span className="text-ds-2xs font-mono text-ds-fg/40">{r.label}</span>
                      <span className="text-ds-2xs font-mono text-ds-fg/60">{r.pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 13: Timeline & Stepper
         ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-ds-4 relative z-10 pt-ds-4">
        <SectionHeader icon={Clock} iconColor="text-ds-violet" glowColor="bg-ds-violet/30" lineColor="from-ds-violet" label="Timeline & Stepper" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-ds-6">
          <GlassCard className="p-ds-6">
            <CardTitle>Activity Timeline</CardTitle>
            <div className="space-y-0 mt-ds-1">
              {[
                { time: "14:32", title: "Transaction confirmee", desc: "0.05 ETH → 0x8A9F...2F9C", icon: CheckCircle2, iconCls: "text-ds-emerald", bgCls: "bg-ds-emerald/10", borderCls: "border-ds-emerald/20" },
                { time: "14:28", title: "Smart Contract deploye", desc: "NexusVault.sol sur Ethereum Mainnet", icon: FileText, iconCls: "text-ds-blue", bgCls: "bg-ds-blue/10", borderCls: "border-ds-blue/20" },
                { time: "14:15", title: "Alerte latence reseau", desc: "Pic de 120ms sur Beta Gateway", icon: AlertTriangle, iconCls: "text-ds-amber", bgCls: "bg-ds-amber/10", borderCls: "border-ds-amber/20" },
                { time: "13:45", title: "Wallet connecte", desc: "MetaMask v11.2.0 authentifie", icon: Wallet, iconCls: "text-ds-purple", bgCls: "bg-ds-purple/10", borderCls: "border-ds-purple/20" },
              ].map((ev, i, arr) => (
                <div key={i} className="flex gap-ds-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-ds-full ${ev.bgCls} border ${ev.borderCls} flex items-center justify-center shrink-0`}>
                      <ev.icon size={12} className={ev.iconCls} />
                    </div>
                    {i < arr.length - 1 && <div className="w-ds-px flex-1 bg-ds-border/5 my-ds-1" />}
                  </div>
                  <div className="pb-ds-5">
                    <div className="flex items-center gap-ds-2 mb-0.5">
                      <span className="text-ds-md text-ds-fg/90">{ev.title}</span>
                      <span className="text-ds-xs text-ds-fg/30 font-mono">{ev.time}</span>
                    </div>
                    <p className="text-ds-sm text-ds-fg/50">{ev.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-ds-6">
            <CardTitle>Stepper (Processus)</CardTitle>
            <div className="space-y-0 mt-ds-1">
              {[
                { label: "Connexion Wallet", status: "complete" as const },
                { label: "Approbation Token", status: "complete" as const },
                { label: "Confirmation Transaction", status: "active" as const },
                { label: "Deploiement Final", status: "pending" as const },
              ].map((step, i, arr) => (
                <div key={i} className="flex gap-ds-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-ds-full flex items-center justify-center shrink-0 transition-all ${
                      step.status === 'complete' ? 'bg-ds-emerald/20 border border-ds-emerald/30' :
                      step.status === 'active' ? 'bg-ds-blue/20 border border-ds-blue/30 shadow-[0_0_12px_rgba(59,130,246,0.3)]' :
                      'bg-ds-fg/[0.03] border border-ds-border/8'
                    }`}>
                      {step.status === 'complete' ? (
                        <Check size={12} className="text-ds-emerald" />
                      ) : step.status === 'active' ? (
                        <div className="w-ds-2 h-ds-2 rounded-ds-full bg-ds-blue animate-pulse" />
                      ) : (
                        <span className="text-ds-xs font-mono text-ds-fg/30">{i + 1}</span>
                      )}
                    </div>
                    {i < arr.length - 1 && (
                      <div className={`w-ds-px h-ds-8 my-ds-1 ${step.status === 'complete' ? 'bg-ds-emerald/30' : 'bg-ds-border/5'}`} />
                    )}
                  </div>
                  <div className="pt-ds-1">
                    <span className={`text-ds-md ${
                      step.status === 'active' ? 'text-ds-blue' :
                      step.status === 'complete' ? 'text-ds-fg/70' : 'text-ds-fg/40'
                    }`}>{step.label}</span>
                    {step.status === 'active' && <span className="text-ds-xs text-ds-blue/60 font-mono block mt-0.5">En cours...</span>}
                    {step.status === 'complete' && <span className="text-ds-xs text-ds-emerald/60 font-mono block mt-0.5">Termine</span>}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 14: Menu, Dividers & System
         ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-ds-4 relative z-10 pt-ds-4">
        <SectionHeader icon={BarChart2} iconColor="text-ds-teal" glowColor="bg-ds-teal/30" lineColor="from-ds-teal" label="Menu, Dividers & Systeme" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-ds-6">
          <GlassCard className="p-ds-6">
            <CardTitle>Menu Deroulant</CardTitle>
            <div className="w-full max-w-[220px] mx-auto bg-ds-surface-2 border border-ds-border/10 rounded-ds-lg shadow-[var(--ds-shadow-dropdown),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden">
              <div className="p-ds-1 space-y-0.5">
                <button className="w-full flex items-center gap-ds-2 px-ds-3 py-ds-2 rounded-ds-md hover:bg-ds-fg/[0.03] text-ds-base text-ds-fg/80 transition-colors">
                  <User size={14} className="text-ds-fg/40" /> Profil
                </button>
                <button className="w-full flex items-center gap-ds-2 px-ds-3 py-ds-2 rounded-ds-md hover:bg-ds-fg/[0.03] text-ds-base text-ds-fg/80 transition-colors">
                  <Activity size={14} className="text-ds-fg/40" /> Activite
                  <span className="ml-auto text-ds-xs font-mono text-ds-emerald bg-ds-emerald/10 px-ds-1 py-0.5 rounded-ds-sm">En ligne</span>
                </button>
                <button className="w-full flex items-center gap-ds-2 px-ds-3 py-ds-2 rounded-ds-md hover:bg-ds-fg/[0.03] text-ds-base text-ds-fg/80 transition-colors">
                  <Settings size={14} className="text-ds-fg/40" /> Parametres
                  <span className="ml-auto text-ds-xs font-mono text-ds-fg/30">⌘,</span>
                </button>
                <button className="w-full flex items-center gap-ds-2 px-ds-3 py-ds-2 rounded-ds-md hover:bg-ds-fg/[0.03] text-ds-base text-ds-fg/80 transition-colors">
                  <Download size={14} className="text-ds-fg/40" /> Export CSV
                </button>
                <div className="h-ds-px w-full bg-ds-border/5 my-ds-1" />
                <button className="w-full flex items-center gap-ds-2 px-ds-3 py-ds-2 rounded-ds-md hover:bg-ds-rose/10 text-ds-base text-ds-rose transition-colors">
                  <Lock size={14} /> Deconnexion
                </button>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-ds-6">
            <CardTitle>Dividers</CardTitle>
            <div className="space-y-ds-4">
              {[
                { label: "Simple", el: <div className="h-ds-px w-full bg-ds-border/5" /> },
                { label: "Gradient", el: <div className="h-ds-px w-full bg-gradient-to-r from-transparent via-ds-fg/20 to-transparent" /> },
                { label: "Avec label", el: (
                  <div className="flex items-center gap-ds-3">
                    <div className="flex-1 h-ds-px bg-ds-border/5" />
                    <span className="text-ds-xs text-ds-fg/30 font-mono uppercase">ou</span>
                    <div className="flex-1 h-ds-px bg-ds-border/5" />
                  </div>
                )},
                { label: "Dashed", el: <div className="border-t border-dashed border-ds-border/8" /> },
                { label: "Colored", el: <div className="h-ds-px w-full bg-gradient-to-r from-ds-blue/50 via-ds-purple/50 to-ds-rose/50" /> },
              ].map((d, i) => (
                <div key={i}>
                  <span className="text-ds-xs text-ds-fg/30 font-mono block mb-ds-2">{d.label}</span>
                  {d.el}
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-ds-6">
            <CardTitle>Indicateurs Systeme</CardTitle>
            <div className="space-y-ds-3">
              {[
                { icon: Wifi, label: "Reseau", value: "Connecte", ok: true },
                { icon: Shield, label: "Securite", value: "Activee", ok: true },
                { icon: Database, label: "Storage", value: "84% utilise", ok: true },
                { icon: Cpu, label: "CPU", value: "Charge elevee", ok: false },
              ].map((ind, i) => (
                <div key={i} className="flex items-center justify-between py-ds-1_5">
                  <div className="flex items-center gap-ds-2">
                    <ind.icon size={12} className="text-ds-fg/40" />
                    <span className="text-ds-md text-ds-fg/70">{ind.label}</span>
                  </div>
                  <div className="flex items-center gap-ds-1_5">
                    <div className={`w-ds-1_5 h-ds-1_5 rounded-ds-full ${ind.ok ? 'bg-ds-emerald' : 'bg-ds-amber animate-pulse'}`} />
                    <span className={`text-ds-sm font-mono ${ind.ok ? 'text-ds-emerald/80' : 'text-ds-amber/80'}`}>{ind.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-ds-5 pt-ds-4 border-t border-ds-border/5">
              <CardTitle>Command Palette</CardTitle>
              <div className="flex items-center gap-ds-2 px-ds-3 py-ds-2 rounded-ds-md bg-ds-surface-1 border border-ds-border/8 cursor-pointer hover:border-ds-border/15 transition-all group/cmd">
                <Search size={12} className="text-ds-fg/30 group-hover/cmd:text-ds-fg/50 transition-colors" />
                <span className="text-ds-md text-ds-fg/30 flex-1 group-hover/cmd:text-ds-fg/50 transition-colors">Commande rapide...</span>
                <div className="flex items-center gap-0.5">
                  <kbd className="px-ds-1 py-0.5 rounded-ds-sm border border-ds-border/10 bg-ds-fg/5 text-ds-2xs text-ds-fg/40 font-mono shadow-[0_1px_0_rgba(255,255,255,0.05)]">⌘</kbd>
                  <kbd className="px-ds-1 py-0.5 rounded-ds-sm border border-ds-border/10 bg-ds-fg/5 text-ds-2xs text-ds-fg/40 font-mono shadow-[0_1px_0_rgba(255,255,255,0.05)]">K</kbd>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

    </div>
  );
}
