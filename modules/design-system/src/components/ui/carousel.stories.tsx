import type { Meta, StoryObj } from '@storybook/react-vite'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from './carousel'

const meta: Meta = { title: 'UI/Carousel' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="w-[420px]">
      <Carousel>
        <CarouselContent>
          {[
            { n: 1, color: 'bg-ds-blue/20 border-ds-blue/20 text-ds-blue' },
            { n: 2, color: 'bg-ds-purple/20 border-ds-purple/20 text-ds-purple' },
            { n: 3, color: 'bg-ds-emerald/20 border-ds-emerald/20 text-ds-emerald' },
            { n: 4, color: 'bg-ds-amber/20 border-ds-amber/20 text-ds-amber' },
            { n: 5, color: 'bg-ds-rose/20 border-ds-rose/20 text-ds-rose' },
          ].map(({ n, color }) => (
            <CarouselItem key={n}>
              <div className={`h-[200px] rounded-ds-md border flex items-center justify-center text-ds-display font-mono ${color}`}>{n}</div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
}
