import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'

const meta: Meta = {
  title: 'UI/Tabs',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<Tabs defaultValue="a" className="w-[360px]"><TabsList><TabsTrigger value="a">Tab A</TabsTrigger><TabsTrigger value="b">Tab B</TabsTrigger></TabsList><TabsContent value="a" className="mt-2 text-xs">Tab A content</TabsContent><TabsContent value="b" className="mt-2 text-xs">Tab B content</TabsContent></Tabs>),
}
