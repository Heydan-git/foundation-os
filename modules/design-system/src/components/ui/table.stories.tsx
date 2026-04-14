import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from './table'
import { Badge } from './badge'

const meta: Meta = { title: 'UI/Table' }
export default meta
type Story = StoryObj

const DATA = [
  { id: 'TX-001', user: 'Alice', amount: '$240.00', status: 'success' },
  { id: 'TX-002', user: 'Bob', amount: '$120.00', status: 'pending' },
  { id: 'TX-003', user: 'Carol', amount: '$560.00', status: 'failed' },
  { id: 'TX-004', user: 'Dave', amount: '$89.00', status: 'success' },
]

export const Default: Story = {
  render: () => (
    <div className="w-[620px] rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 overflow-hidden">
      <Table>
        <TableCaption>Recent transactions</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {DATA.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-mono text-ds-xs">{r.id}</TableCell>
              <TableCell>{r.user}</TableCell>
              <TableCell className="font-mono">{r.amount}</TableCell>
              <TableCell>
                {r.status === 'success' && <Badge className="bg-ds-emerald/10 text-ds-emerald border-ds-emerald/20">success</Badge>}
                {r.status === 'pending' && <Badge className="bg-ds-amber/10 text-ds-amber border-ds-amber/20">pending</Badge>}
                {r.status === 'failed' && <Badge className="bg-ds-rose/10 text-ds-rose border-ds-rose/20">failed</Badge>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
}
