import type { Meta, StoryObj } from '@storybook/react-vite'
// @ts-nocheck — chart.tsx itself is @ts-nocheck (recharts v3 drift)
import { ChartContainer } from './chart'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

const meta: Meta = {
  title: 'UI/Chart',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<ChartContainer config={{ value: { label: "Value", color: "var(--ds-blue)" } }} className="w-[400px] h-[200px]"><BarChart data={[{ m: "Jan", value: 40 }, { m: "Feb", value: 65 }, { m: "Mar", value: 32 }]}><CartesianGrid vertical={false} /><XAxis dataKey="m" /><Bar dataKey="value" fill="var(--ds-blue)" radius={4} /></BarChart></ChartContainer>),
}
