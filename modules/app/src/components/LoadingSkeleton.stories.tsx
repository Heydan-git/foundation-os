import type { Meta, StoryObj } from '@storybook/react'
import { LoadingSkeleton } from './LoadingSkeleton'

const meta = {
  title: 'App/LoadingSkeleton',
  component: LoadingSkeleton,
  tags: ['autodocs'],
} satisfies Meta<typeof LoadingSkeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
