import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './card'
import { Button } from './button'

const meta = {
  title: 'Layout/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent>
        <p className="text-sm">Simple card with text content.</p>
      </CardContent>
    </Card>
  ),
}

export const WithForm: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Account settings</CardTitle>
        <CardDescription>Update your account preferences here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Content goes here.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Save changes</Button>
      </CardFooter>
    </Card>
  ),
}

export const Stats: Story = {
  render: () => (
    <div className="flex gap-4">
      {[
        { label: 'Projects', value: '12' },
        { label: 'Tasks', value: '48' },
        { label: 'Done', value: '36' },
      ].map((item) => (
        <Card key={item.label} className="w-32">
          <CardHeader>
            <CardDescription>{item.label}</CardDescription>
            <CardTitle className="text-2xl">{item.value}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  ),
}
