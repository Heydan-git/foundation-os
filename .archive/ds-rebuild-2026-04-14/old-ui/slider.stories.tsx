import type { Meta, StoryObj } from '@storybook/react-vite'
import { Slider } from './slider'
import { Label } from './label'

const meta = {
  title: 'Form/Slider',
  component: Slider,
  tags: ['autodocs'],
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { defaultValue: [50], max: 100, step: 1 },
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-4">
      <Label>Volume</Label>
      <Slider defaultValue={[75]} max={100} step={1} />
    </div>
  ),
}

export const Range: Story = {
  args: { defaultValue: [25, 75], max: 100, step: 1 },
}

export const Disabled: Story = {
  args: { defaultValue: [50], max: 100, step: 1, disabled: true },
}

export const Steps: Story = {
  args: { defaultValue: [50], max: 100, step: 25 },
}
