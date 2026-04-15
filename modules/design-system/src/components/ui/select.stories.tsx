import type { Meta, StoryObj } from '@storybook/react-vite'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './select'
import { Label } from './label'

const meta: Meta = { title: 'UI/Select' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="p-ds-5 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[360px] space-y-ds-3">
      <Label htmlFor="network">Network</Label>
      <Select defaultValue="mainnet">
        <SelectTrigger id="network" className="w-full">
          <SelectValue placeholder="Pick a network" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="mainnet">Ethereum Mainnet</SelectItem>
          <SelectItem value="polygon">Polygon</SelectItem>
          <SelectItem value="arbitrum">Arbitrum One</SelectItem>
          <SelectItem value="optimism">Optimism</SelectItem>
          <SelectItem value="base">Base</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}
