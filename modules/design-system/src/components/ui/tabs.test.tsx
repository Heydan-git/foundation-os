import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'

describe('Tabs (smoke)', () => {
  it('renders tabs with content', () => {
    const { getByText, getByRole } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    )
    expect(getByRole('tablist')).toBeInTheDocument()
    expect(getByText('Tab 1')).toBeInTheDocument()
    expect(getByText('Content 1')).toBeInTheDocument()
  })

  it('is accessible', async () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
