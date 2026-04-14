import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from './form'
import { Loader2 } from 'lucide-react'
import { Input } from './input'
import { Button } from './button'
import { Skeleton } from './skeleton'

const meta = {
  title: 'Form/Form',
  component: Form,
  tags: ['autodocs'],
} satisfies Meta<typeof Form>

export default meta
type Story = StoryObj<typeof meta>

const schema = z.object({
  username: z.string().min(2, { message: 'Username must be at least 2 characters.' }),
})

function FormDemo() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { username: '' },
  })

  function onSubmit(values: z.infer<typeof schema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-64">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export const Default: Story = {
  render: () => <FormDemo />,
}

export const Loading: Story = {
  render: () => (
    <div className="space-y-4 w-64">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Button type="submit" disabled className="w-full">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Enregistrement...
      </Button>
    </div>
  ),
}

function FormWithErrorDemo() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { username: 'a' },
  })

  return (
    <Form {...form}>
      <form className="space-y-4 w-64">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormMessage>Username must be at least 2 characters.</FormMessage>
            </FormItem>
          )}
        />
        <Button type="button" variant="outline">Soumettre</Button>
      </form>
    </Form>
  )
}

export const WithError: Story = {
  render: () => <FormWithErrorDemo />,
}
