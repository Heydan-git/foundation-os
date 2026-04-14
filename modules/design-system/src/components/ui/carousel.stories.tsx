import type { Meta, StoryObj } from '@storybook/react-vite'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from './carousel'

const meta: Meta = {
  title: 'UI/Carousel',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<Carousel className="w-[320px]"><CarouselContent>{[1,2,3].map((n)=>(<CarouselItem key={n}><div className="h-[160px] flex items-center justify-center rounded-md bg-ds-surface-2 text-ds-fg/60">Slide {n}</div></CarouselItem>))}</CarouselContent><CarouselPrevious /><CarouselNext /></Carousel>),
}
