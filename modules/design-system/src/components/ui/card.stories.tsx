import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'
import { Button } from './button'
import { Badge } from './badge'

const meta: Meta = { title: 'UI/Card' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-ds-4 w-[720px]">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Premium plan</CardTitle>
            <Badge className="bg-ds-blue/10 text-ds-blue border-ds-blue/20">Active</Badge>
          </div>
          <CardDescription>Unlimited access to all features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-ds-2xl font-mono text-ds-fg">$49<span className="text-ds-fg/40 text-ds-sm">/mo</span></div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Manage subscription</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>Last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-ds-2xl font-mono text-ds-emerald">+24%</div>
          <p className="text-ds-xs text-ds-fg/40 font-mono mt-ds-1">vs previous period</p>
        </CardContent>
      </Card>
    </div>
  ),
}
