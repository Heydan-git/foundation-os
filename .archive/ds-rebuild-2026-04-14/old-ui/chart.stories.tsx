import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChartContainer } from './chart'

const meta = {
  title: 'DataDisplay/Chart',
  component: ChartContainer,
  tags: ['autodocs'],
} satisfies Meta<typeof ChartContainer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="flex items-center justify-center rounded-md border p-8 text-sm text-muted-foreground">
      Chart stories - see recharts docs for BarChart / LineChart examples
    </div>
  ),
}
