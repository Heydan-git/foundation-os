import type { Meta, StoryObj } from '@storybook/react-vite'
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from './form'
import { Input } from './input'
import { Button } from './button'
import { useForm } from 'react-hook-form'

const meta: Meta = { title: 'UI/Form' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => {
    const form = useForm({ defaultValues: { email: '', username: '' } })
    return (
      <Form {...form}>
        <form className="p-ds-5 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[420px] space-y-ds-4">
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
              <FormDescription>We will never share your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="username" render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl><Input placeholder="foundation-os" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="submit" className="w-full">Create account</Button>
        </form>
      </Form>
    )
  },
}
