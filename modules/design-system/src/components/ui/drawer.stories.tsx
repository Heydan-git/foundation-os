import type { Meta, StoryObj } from '@storybook/react-vite'
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from './drawer'
import { Button } from './button'

const meta: Meta = { title: 'UI/Drawer' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild><Button variant="glass">Open drawer</Button></DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Move funds</DrawerTitle>
          <DrawerDescription>Review the transaction before confirming.</DrawerDescription>
        </DrawerHeader>
        <div className="px-ds-6 space-y-ds-3">
          {[
            { label: 'Montant', value: '0.05 ETH' },
            { label: 'Destination', value: '0x8A9F...2F9C', mono: true },
            { label: 'Gas estime', value: '~$1.24' },
          ].map((row) => (
            <div key={row.label} className="flex justify-between py-ds-2 border-b border-ds-border/5 text-ds-base">
              <span className="text-ds-fg/40 font-mono">{row.label}</span>
              <span className={`text-ds-fg/90 ${row.mono ? 'font-mono text-ds-md' : ''}`}>{row.value}</span>
            </div>
          ))}
        </div>
        <DrawerFooter>
          <div className="flex gap-ds-2 justify-end">
            <DrawerClose asChild><Button variant="outline">Cancel</Button></DrawerClose>
            <Button variant="gradient">Confirm</Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}
