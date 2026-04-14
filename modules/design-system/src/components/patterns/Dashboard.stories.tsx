import type { Meta, StoryObj } from '@storybook/react-vite'
import { DashboardHome } from './DashboardHome'
import { DashboardDesignSystem } from './DashboardDesignSystem'
import { DashboardAI } from './DashboardAI'
import { DashboardSettings } from './DashboardSettings'
import { DashboardTxs } from './DashboardTxs'
import { DashboardWallet } from './DashboardWallet'

const meta = {
  title: 'Patterns/Dashboard',
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
  },
} satisfies Meta

export default meta

export const Home: StoryObj = {
  render: () => (
    <div className="min-h-screen bg-[#030303] p-8">
      <DashboardHome />
    </div>
  ),
}

export const DesignSystem: StoryObj = {
  render: () => (
    <div className="min-h-screen bg-[#030303] p-8">
      <DashboardDesignSystem />
    </div>
  ),
}

export const AI: StoryObj = {
  render: () => (
    <div className="min-h-screen bg-[#030303] p-8">
      <DashboardAI />
    </div>
  ),
}

export const Settings: StoryObj = {
  render: () => (
    <div className="min-h-screen bg-[#030303] p-8">
      <DashboardSettings />
    </div>
  ),
}

export const Txs: StoryObj = {
  render: () => (
    <div className="min-h-screen bg-[#030303] p-8">
      <DashboardTxs />
    </div>
  ),
}

export const Wallet: StoryObj = {
  render: () => (
    <div className="min-h-screen bg-[#030303] p-8">
      <DashboardWallet />
    </div>
  ),
}
