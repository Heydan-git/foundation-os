import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'

const meta: Meta = { title: 'UI/Tabs' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="w-[480px]">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="p-ds-4 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 mt-ds-3 text-ds-base text-ds-fg/90">
          Overview panel — glass card with tokens propagated.
        </TabsContent>
        <TabsContent value="activity" className="p-ds-4 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 mt-ds-3 text-ds-base text-ds-fg/90">
          Activity panel content.
        </TabsContent>
        <TabsContent value="settings" className="p-ds-4 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 mt-ds-3 text-ds-base text-ds-fg/90">
          Settings panel content.
        </TabsContent>
      </Tabs>
    </div>
  ),
}
