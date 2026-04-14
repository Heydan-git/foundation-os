import type { Meta, StoryObj } from '@storybook/react-vite'
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from './navigation-menu'

const meta: Meta = {
  title: 'UI/NavigationMenu',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<NavigationMenu><NavigationMenuList><NavigationMenuItem><NavigationMenuTrigger>Products</NavigationMenuTrigger><NavigationMenuContent className="p-3"><NavigationMenuLink className="block text-sm">Docs</NavigationMenuLink><NavigationMenuLink className="block text-sm">API</NavigationMenuLink></NavigationMenuContent></NavigationMenuItem></NavigationMenuList></NavigationMenu>),
}
