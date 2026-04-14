import type { Meta, StoryObj } from '@storybook/react-vite'
import { Activity, Database, Shield, Zap, Sparkles, Cpu } from 'lucide-react'
import { GlassCard } from './GlassCard'
import { IconBox } from './IconBox'
import { StatusDot } from './StatusDot'
import { NeonBadge } from './NeonBadge'
import { SubLabel } from './SubLabel'
import { SectionHeader } from './SectionHeader'
import { StatCard } from './StatCard'
import { HashPill } from './HashPill'
import { ProgressBar } from './ProgressBar'
import { LiveIndicator } from './LiveIndicator'
import { GlowButton } from './GlowButton'

const meta = {
  title: 'Void Glass/Components',
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
  },
} satisfies Meta

export default meta

/* ─── GlassCard ─────────────────────────────────────────── */
export const GlassCardStory: StoryObj = {
  name: 'GlassCard',
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
      <GlassCard>
        <h3 className="text-sm font-medium text-white/90 mb-2">Default</h3>
        <p className="text-xs text-white/40">Container glass sans glow.</p>
      </GlassCard>
      <GlassCard glow="bg-blue-500/10">
        <h3 className="text-sm font-medium text-white/90 mb-2">Hover me (blue glow)</h3>
        <p className="text-xs text-white/40">Glow apparait au hover.</p>
      </GlassCard>
      <GlassCard glow="bg-purple-500/10" glowPosition="bottom-left">
        <h3 className="text-sm font-medium text-white/90 mb-2">Purple glow (bottom-left)</h3>
        <p className="text-xs text-white/40">Position du glow configurable.</p>
      </GlassCard>
      <GlassCard glow="bg-emerald-500/10">
        <h3 className="text-sm font-medium text-white/90 mb-2">Emerald glow</h3>
        <p className="text-xs text-white/40">Success / LIVE state.</p>
      </GlassCard>
    </div>
  ),
}

/* ─── IconBox ───────────────────────────────────────────── */
export const IconBoxStory: StoryObj = {
  name: 'IconBox',
  render: () => (
    <div className="flex items-center gap-4">
      <IconBox size={6}>
        <Activity size={10} className="text-purple-400" />
      </IconBox>
      <IconBox size={8}>
        <Database size={14} className="text-blue-400" />
      </IconBox>
      <IconBox size={10}>
        <Shield size={18} className="text-rose-400" />
      </IconBox>
    </div>
  ),
}

/* ─── StatusDot ─────────────────────────────────────────── */
export const StatusDotStory: StoryObj = {
  name: 'StatusDot',
  render: () => (
    <div className="flex items-center gap-6 text-white/70 text-xs">
      <span className="flex items-center gap-2"><StatusDot tone="emerald" /> emerald</span>
      <span className="flex items-center gap-2"><StatusDot tone="blue" /> blue</span>
      <span className="flex items-center gap-2"><StatusDot tone="purple" /> purple</span>
      <span className="flex items-center gap-2"><StatusDot tone="amber" /> amber</span>
      <span className="flex items-center gap-2"><StatusDot tone="rose" /> rose</span>
      <span className="flex items-center gap-2"><StatusDot tone="white" pulse={false} /> white (no pulse)</span>
    </div>
  ),
}

/* ─── NeonBadge ─────────────────────────────────────────── */
export const NeonBadgeStory: StoryObj = {
  name: 'NeonBadge',
  render: () => (
    <div className="flex flex-wrap gap-2">
      <NeonBadge tone="default">DEFAULT</NeonBadge>
      <NeonBadge tone="emerald">LIVE</NeonBadge>
      <NeonBadge tone="blue">INFO</NeonBadge>
      <NeonBadge tone="purple">PRO</NeonBadge>
      <NeonBadge tone="amber">WAIT</NeonBadge>
      <NeonBadge tone="rose">ERROR</NeonBadge>
      <NeonBadge tone="cyan">BETA</NeonBadge>
      <NeonBadge tone="outline">OUTLINE</NeonBadge>
    </div>
  ),
}

/* ─── SubLabel ──────────────────────────────────────────── */
export const SubLabelStory: StoryObj = {
  name: 'SubLabel',
  render: () => (
    <div className="space-y-2">
      <SubLabel>Network Activity</SubLabel>
      <SubLabel>Sessions</SubLabel>
      <SubLabel>Decisions ADR</SubLabel>
    </div>
  ),
}

/* ─── SectionHeader ─────────────────────────────────────── */
export const SectionHeaderStory: StoryObj = {
  name: 'SectionHeader',
  render: () => (
    <div className="space-y-6 max-w-xl">
      <SectionHeader icon={Sparkles} iconColor="text-purple-400" glowColor="bg-purple-500/30" lineColor="from-purple-500" label="Design Tokens" />
      <SectionHeader icon={Cpu} iconColor="text-blue-400" glowColor="bg-blue-500/30" lineColor="from-blue-500" label="Architecture" />
      <SectionHeader icon={Activity} iconColor="text-emerald-400" glowColor="bg-emerald-500/30" lineColor="from-emerald-500" label="Live Monitoring" />
    </div>
  ),
}

/* ─── StatCard ──────────────────────────────────────────── */
export const StatCardStory: StoryObj = {
  name: 'StatCard',
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl">
      <StatCard title="Sessions" value="5" change="+12.4%" icon={Activity} iconColor="text-purple-400" glow="bg-purple-500/10" />
      <StatCard title="Decisions ADR" value="12" change="+2" icon={Database} iconColor="text-blue-400" glow="bg-blue-500/10" />
      <StatCard title="Risques" value="4" change="-1" changeTone="rose" icon={Shield} iconColor="text-rose-400" glow="bg-rose-500/10" />
      <StatCard title="Next Steps" value="0%" change="0/5" changeTone="amber" icon={Zap} iconColor="text-emerald-400" glow="bg-emerald-500/10" />
    </div>
  ),
}

/* ─── HashPill ──────────────────────────────────────────── */
export const HashPillStory: StoryObj = {
  name: 'HashPill',
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center gap-4"><HashPill hash="0x12a94b8c" /> <HashPill hash="0x9f2b1e4d" tone="purple" /></div>
      <div className="flex items-center gap-4"><HashPill hash="sess_abc123" tone="emerald" /> <HashPill hash="dec_xyz789" tone="amber" /></div>
    </div>
  ),
}

/* ─── ProgressBar ───────────────────────────────────────── */
export const ProgressBarStory: StoryObj = {
  name: 'ProgressBar',
  render: () => (
    <div className="space-y-4 max-w-md">
      <div><SubLabel>Gradient (default)</SubLabel><ProgressBar value={45} /></div>
      <div><SubLabel>Emerald</SubLabel><ProgressBar value={78} tone="emerald" /></div>
      <div><SubLabel>Complete (auto emerald)</SubLabel><ProgressBar value={100} /></div>
      <div><SubLabel>Amber</SubLabel><ProgressBar value={30} tone="amber" /></div>
      <div><SubLabel>Rose</SubLabel><ProgressBar value={15} tone="rose" /></div>
    </div>
  ),
}

/* ─── LiveIndicator ─────────────────────────────────────── */
export const LiveIndicatorStory: StoryObj = {
  name: 'LiveIndicator',
  render: () => (
    <div className="flex flex-wrap gap-3">
      <LiveIndicator label="SUPABASE LIVE" tone="emerald" />
      <LiveIndicator label="SYNC: 100%" tone="blue" />
      <LiveIndicator label="AI ACTIF" tone="purple" />
      <LiveIndicator label="WAIT" tone="amber" />
      <LiveIndicator label="DOWN" tone="rose" pulse={false} />
    </div>
  ),
}

/* ─── GlowButton ────────────────────────────────────────── */
export const GlowButtonStory: StoryObj = {
  name: 'GlowButton',
  render: () => (
    <div className="flex flex-wrap gap-3">
      <GlowButton variant="primary" size="sm">Primary SM</GlowButton>
      <GlowButton variant="primary">Primary MD</GlowButton>
      <GlowButton variant="primary" size="lg">Primary LG</GlowButton>
      <GlowButton variant="glass">Glass</GlowButton>
      <GlowButton variant="ghost">Ghost</GlowButton>
      <GlowButton variant="primary" disabled>Disabled</GlowButton>
    </div>
  ),
}

/* ─── Composition — Dashboard stat grid ─────────────────── */
export const CompositionDashboardGrid: StoryObj = {
  name: 'Composition: Dashboard stat grid',
  render: () => (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <LiveIndicator label="SEED DATA" tone="emerald" />
          <h1 className="text-3xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40">
            Vue d&apos;ensemble
          </h1>
        </div>
        <div className="flex gap-2">
          <GlowButton variant="glass" size="sm">Exporter</GlowButton>
          <GlowButton variant="primary" size="sm">
            <Zap size={12} /> Deployer
          </GlowButton>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Sessions" value="5" change="+12%" icon={Activity} iconColor="text-purple-400" glow="bg-purple-500/10" />
        <StatCard title="Decisions ADR" value="12" change="+2" icon={Database} iconColor="text-blue-400" glow="bg-blue-500/10" />
        <StatCard title="Risques" value="4" change="-1" changeTone="rose" changeIcon={false} icon={Shield} iconColor="text-rose-400" glow="bg-rose-500/10" />
        <StatCard title="Next Steps" value="78%" change="7/9" icon={Zap} iconColor="text-emerald-400" glow="bg-emerald-500/10" />
      </div>
    </div>
  ),
}

GlassCardStory.storyName = 'GlassCard'
IconBoxStory.storyName = 'IconBox'
StatusDotStory.storyName = 'StatusDot'
NeonBadgeStory.storyName = 'NeonBadge'
SubLabelStory.storyName = 'SubLabel'
SectionHeaderStory.storyName = 'SectionHeader'
StatCardStory.storyName = 'StatCard'
HashPillStory.storyName = 'HashPill'
ProgressBarStory.storyName = 'ProgressBar'
LiveIndicatorStory.storyName = 'LiveIndicator'
GlowButtonStory.storyName = 'GlowButton'
CompositionDashboardGrid.storyName = 'Composition — Dashboard stat grid'
