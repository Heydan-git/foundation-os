/**
 * Patterns — pages completes Dashboard iso `base DS` (Figma Make export).
 *
 * Chaque story charge une page Dashboard complete pour visualiser les 46 composants
 * en composition. Reference visuelle unique pour valider l'iso avec `base DS/`.
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter, Routes, Route } from 'react-router'
import { DashboardLayout } from './DashboardLayout'
import { DashboardHome } from './DashboardHome'
import { DashboardAI } from './DashboardAI'
import { DashboardTxs } from './DashboardTxs'
import { DashboardWallet } from './DashboardWallet'
import { DashboardSettings } from './DashboardSettings'
import { DashboardDesignSystem } from './DashboardDesignSystem'

const withRouter = (initialPath: string) => (Story: React.ComponentType) =>
  (
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Story />} />
          <Route path="/ai" element={<Story />} />
          <Route path="/txs" element={<Story />} />
          <Route path="/wallet" element={<Story />} />
          <Route path="/settings" element={<Story />} />
          <Route path="/design-system" element={<Story />} />
        </Route>
      </Routes>
    </MemoryRouter>
  )

const meta: Meta = {
  title: 'Patterns/Dashboard',
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

export const Home: Story = {
  render: () => <DashboardHome />,
  decorators: [withRouter('/')],
}

export const AIAnalytics: Story = {
  render: () => <DashboardAI />,
  decorators: [withRouter('/ai')],
}

export const Transactions: Story = {
  render: () => <DashboardTxs />,
  decorators: [withRouter('/txs')],
}

export const Wallet: Story = {
  render: () => <DashboardWallet />,
  decorators: [withRouter('/wallet')],
}

export const Settings: Story = {
  render: () => <DashboardSettings />,
  decorators: [withRouter('/settings')],
}

export const DesignSystem: Story = {
  render: () => <DashboardDesignSystem />,
  decorators: [withRouter('/design-system')],
}
