import type { Meta, StoryObj } from '@storybook/react-vite'
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from './navigation-menu'

const meta: Meta = { title: 'UI/NavigationMenu' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent className="p-ds-4 w-[420px]">
            <div className="grid gap-ds-2">
              <NavigationMenuLink className="block rounded-ds-md p-ds-2 hover:bg-ds-fg/[0.03] hover:text-ds-fg/90">
                <div className="text-ds-fg text-ds-base">Foundation OS</div>
                <div className="text-ds-xs text-ds-fg/60">Dark-only work OS for IA-native builders.</div>
              </NavigationMenuLink>
              <NavigationMenuLink className="block rounded-ds-md p-ds-2 hover:bg-ds-fg/[0.03] hover:text-ds-fg/90">
                <div className="text-ds-fg text-ds-base">Commander</div>
                <div className="text-ds-xs text-ds-fg/60">Sessions, Decisions, Risks.</div>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent className="p-ds-4 w-[280px]">
            <NavigationMenuLink className="block rounded-ds-md p-ds-2 hover:bg-ds-fg/[0.03] hover:text-ds-fg/90 text-ds-base">Knowledge</NavigationMenuLink>
            <NavigationMenuLink className="block rounded-ds-md p-ds-2 hover:bg-ds-fg/[0.03] hover:text-ds-fg/90 text-ds-base">Changelog</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}
