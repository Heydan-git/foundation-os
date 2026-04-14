import type { Meta, StoryObj } from '@storybook/react-vite'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from './alert-dialog'
import { Button } from './button'

const meta: Meta = {
  title: 'UI/AlertDialog',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<AlertDialog><AlertDialogTrigger asChild><Button variant="destructive">Delete</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction>Confirm</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>),
}
