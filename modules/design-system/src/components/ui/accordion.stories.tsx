import type { Meta, StoryObj } from '@storybook/react-vite'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion'

const meta: Meta = {
  title: 'UI/Accordion',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<Accordion type="single" collapsible className="w-[360px]"><AccordionItem value="a"><AccordionTrigger>Question?</AccordionTrigger><AccordionContent>Answer.</AccordionContent></AccordionItem></Accordion>),
}
