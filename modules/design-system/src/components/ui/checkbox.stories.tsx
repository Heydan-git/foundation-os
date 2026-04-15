import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from './checkbox'
import { Label } from './label'

const meta: Meta = { title: 'UI/Checkbox' }
export default meta
type Story = StoryObj

const SubLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-ds-sm uppercase tracking-wider text-ds-fg/40 font-mono mb-ds-3 block">{children}</span>
)

export const Default: Story = {
  render: () => (
    <div className="p-ds-5 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[360px] space-y-ds-5">
      <div>
        <SubLabel>States</SubLabel>
        <div className="flex flex-col gap-ds-3">
          <div className="flex items-center gap-ds-3">
            <Checkbox id="c1" />
            <Label htmlFor="c1" className="font-sans normal-case tracking-normal text-ds-base text-ds-fg/70">Unchecked</Label>
          </div>
          <div className="flex items-center gap-ds-3">
            <Checkbox id="c2" defaultChecked />
            <Label htmlFor="c2" className="font-sans normal-case tracking-normal text-ds-base text-ds-fg/90">Checked (blue fill)</Label>
          </div>
          <div className="flex items-center gap-ds-3 opacity-40">
            <Checkbox id="c3" disabled />
            <Label htmlFor="c3" className="font-sans normal-case tracking-normal text-ds-base text-ds-fg/70">Disabled</Label>
          </div>
          <div className="flex items-center gap-ds-3 opacity-40">
            <Checkbox id="c4" defaultChecked disabled />
            <Label htmlFor="c4" className="font-sans normal-case tracking-normal text-ds-base text-ds-fg/70">Disabled + checked</Label>
          </div>
        </div>
      </div>

      <div>
        <SubLabel>Group (iso template)</SubLabel>
        <div className="flex flex-col gap-ds-3">
          {[
            { id: 'opt1', label: 'Notifications push', checked: true },
            { id: 'opt2', label: 'Alertes de securite', checked: true },
            { id: 'opt3', label: 'Newsletter hebdo', checked: false },
          ].map((item) => (
            <div key={item.id} className="flex items-center gap-ds-3">
              <Checkbox id={item.id} defaultChecked={item.checked} />
              <Label htmlFor={item.id} className="font-sans normal-case tracking-normal text-ds-base text-ds-fg/90">{item.label}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}
