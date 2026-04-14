import type { Meta, StoryObj } from '@storybook/react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from './select'
import { Label } from './label'

const meta = {
  title: 'Form/Select',
  component: Select,
  tags: ['autodocs'],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label>Framework</Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="vue">Vue</SelectItem>
          <SelectItem value="svelte">Svelte</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">Eastern (UTC-5)</SelectItem>
          <SelectItem value="cst">Central (UTC-6)</SelectItem>
          <SelectItem value="pst">Pacific (UTC-8)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="cet">Central (UTC+1)</SelectItem>
          <SelectItem value="eet">Eastern (UTC+2)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Disabled" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Option A</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const Empty: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Aucun resultat</SelectLabel>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const Error: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Select>
        <SelectTrigger className="w-full border-destructive">
          <SelectValue placeholder="Selectionnez une option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
          <SelectItem value="b">Option B</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-sm text-destructive mt-1">Veuillez selectionner une option</p>
    </div>
  ),
}
