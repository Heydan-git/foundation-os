import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Avatar, AvatarFallback } from './avatar'

describe('Avatar (smoke)', () => {
  it('renders fallback', () => {
    const { getByText } = render(
      <Avatar>
        <AvatarFallback>KN</AvatarFallback>
      </Avatar>
    )
    expect(getByText('KN')).toBeInTheDocument()
  })

  it('is accessible', async () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>KN</AvatarFallback>
      </Avatar>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
