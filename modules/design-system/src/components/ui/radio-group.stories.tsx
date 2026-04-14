import type { Meta, StoryObj } from '@storybook/react-vite'
import { RadioGroup, RadioGroupItem } from './radio-group'
import { Label } from './label'

const meta: Meta = {
  title: 'UI/RadioGroup',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<RadioGroup defaultValue="a"><div className="flex items-center gap-2"><RadioGroupItem id="a" value="a" /><Label htmlFor="a">Option A</Label></div><div className="flex items-center gap-2"><RadioGroupItem id="b" value="b" /><Label htmlFor="b">Option B</Label></div></RadioGroup>),
}
