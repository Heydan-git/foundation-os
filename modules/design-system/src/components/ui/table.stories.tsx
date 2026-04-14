import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './table'

const meta: Meta = {
  title: 'UI/Table',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<Table className="w-[480px]"><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Alice</TableCell><TableCell>Active</TableCell></TableRow><TableRow><TableCell>Bob</TableCell><TableCell>Away</TableCell></TableRow></TableBody></Table>),
}
