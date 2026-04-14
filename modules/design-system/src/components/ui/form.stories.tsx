import type { Meta, StoryObj } from '@storybook/react-vite'
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from './form'
import { Input } from './input'
import { useForm } from 'react-hook-form'

const meta: Meta = {
  title: 'UI/Form',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => {
    const form = useForm({ defaultValues: { email: '' } })
    return (
      <Form {...form}>
        <form className="w-[320px] space-y-3">
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
              <FormDescription>Your public email.</FormDescription>
            </FormItem>
          )} />
        </form>
      </Form>
    )
  },
}
