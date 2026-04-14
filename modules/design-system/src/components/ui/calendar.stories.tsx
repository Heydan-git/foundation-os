import type { Meta, StoryObj } from '@storybook/react-vite'
import { Calendar } from './calendar'

const meta: Meta = { title: 'UI/Calendar' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="p-ds-5 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 inline-block">
      <Calendar mode="single" />
    </div>
  ),
}
