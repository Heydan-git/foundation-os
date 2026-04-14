import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToggleGroup, ToggleGroupItem } from './toggle-group'

const meta: Meta = {
  title: 'UI/ToggleGroup',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<ToggleGroup type="single" defaultValue="a"><ToggleGroupItem value="a">A</ToggleGroupItem><ToggleGroupItem value="b">B</ToggleGroupItem><ToggleGroupItem value="c">C</ToggleGroupItem></ToggleGroup>),
}
