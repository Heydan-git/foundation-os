import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './card'

describe('Card (smoke)', () => {
  it('renders with title and content', () => {
    const { getByText } = render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    )
    expect(getByText('Title')).toBeInTheDocument()
    expect(getByText('Content')).toBeInTheDocument()
  })

  it('is accessible', async () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
