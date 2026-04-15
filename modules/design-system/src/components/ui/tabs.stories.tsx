import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'

const meta: Meta = { title: 'UI/Tabs' }
export default meta
type Story = StoryObj

/**
 * Iso `DashboardDesignSystem.tsx` lines 897-923 :
 * 4 tabs Overview/Analytics/Logs/Settings, underline bar ds-blue sur actif,
 * content panel glass `rounded-ds-md bg-ds-fg/[0.02] border border-ds-border/[0.03]`
 * avec texte `text-ds-sm text-ds-fg/50 font-mono`.
 */
export const Default: Story = {
  render: () => (
    <div className="w-[480px]">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent
          value="overview"
          className="mt-ds-3 p-ds-3 rounded-ds-md bg-ds-fg/[0.02] border border-ds-border/[0.03]"
        >
          <p className="text-ds-sm text-ds-fg/50 font-mono">
            Vue d&apos;ensemble du systeme et metriques cles.
          </p>
        </TabsContent>

        <TabsContent
          value="analytics"
          className="mt-ds-3 p-ds-3 rounded-ds-md bg-ds-fg/[0.02] border border-ds-border/[0.03]"
        >
          <p className="text-ds-sm text-ds-fg/50 font-mono">
            Analyse detaillee des performances reseau.
          </p>
        </TabsContent>

        <TabsContent
          value="logs"
          className="mt-ds-3 p-ds-3 rounded-ds-md bg-ds-fg/[0.02] border border-ds-border/[0.03]"
        >
          <p className="text-ds-sm text-ds-fg/50 font-mono">
            Journal d&apos;activite en temps reel.
          </p>
        </TabsContent>

        <TabsContent
          value="settings"
          className="mt-ds-3 p-ds-3 rounded-ds-md bg-ds-fg/[0.02] border border-ds-border/[0.03]"
        >
          <p className="text-ds-sm text-ds-fg/50 font-mono">
            Configuration et preferences systeme.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  ),
}
