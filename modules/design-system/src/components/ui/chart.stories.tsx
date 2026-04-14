import type { Meta, StoryObj } from '@storybook/react-vite'
// @ts-nocheck — chart.tsx itself is @ts-nocheck (recharts v3 drift)
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from './chart'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

const meta: Meta = { title: 'UI/Chart' }
export default meta
type Story = StoryObj

const CHART_DATA = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 214, mobile: 140 },
]

const CHART_CONFIG = {
  desktop: { label: 'Desktop', color: 'var(--ds-blue)' },
  mobile: { label: 'Mobile', color: 'var(--ds-purple)' },
}

export const Default: Story = {
  render: () => (
    <div className="p-ds-5 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[520px] space-y-ds-3">
      <span className="text-ds-sm uppercase tracking-wider text-ds-fg/40 font-mono block">Visitors last 6 months</span>
      <ChartContainer config={CHART_CONFIG} className="w-full h-[260px]">
        <BarChart data={CHART_DATA}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  ),
}
