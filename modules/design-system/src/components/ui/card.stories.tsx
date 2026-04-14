import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'
import { Button } from './button'

const meta: Meta = {
  title: 'UI/Card',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<Card className="w-[320px]"><CardHeader><CardTitle>Card title</CardTitle><CardDescription>Card description</CardDescription></CardHeader><CardContent><p className="text-xs text-ds-fg/60">Content</p></CardContent><CardFooter><Button size="sm">Action</Button></CardFooter></Card>),
}
