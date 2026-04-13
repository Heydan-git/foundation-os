import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './select'

describe('Select (smoke)', () => {
  it('renders trigger with placeholder', () => {
    const { getByText } = render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
          <SelectItem value="b">Option B</SelectItem>
        </SelectContent>
      </Select>
    )
    expect(getByText('Choose')).toBeInTheDocument()
  })

  it('is accessible', async () => {
    const { container } = render(
      <Select>
        <SelectTrigger aria-label="Options">
          <SelectValue placeholder="Choose" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
        </SelectContent>
      </Select>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
