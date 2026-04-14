import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Calendar } from './calendar'

const meta = {
  title: 'DataDisplay/Calendar',
  component: Calendar,
  tags: ['autodocs'],
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState<Date | undefined>(undefined)
    return (
      <Calendar
        mode="single"
        selected={selected}
        onSelect={setSelected}
      />
    )
  },
}
