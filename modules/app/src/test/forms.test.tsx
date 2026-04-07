/**
 * forms.test.tsx — tests for AddSessionForm and NextStepActions.
 * Mocks @/lib/supabase to keep the real mutations layer intact.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { createSupabaseMock, createQueryBuilder } from './mocks/supabase'

const { mockSupabase } = vi.hoisted(() => ({
  mockSupabase: {
    from: (() => {}) as any,
    auth: {} as any,
  },
}))

vi.mock('@/lib/supabase', () => ({ supabase: mockSupabase }))

beforeEach(() => {
  const fresh = createSupabaseMock()
  mockSupabase.from = fresh.from
  mockSupabase.auth = fresh.auth
})

describe('AddSessionForm', () => {
  it('renders nothing when isOpen is false', async () => {
    const { AddSessionForm } = await import('@/components/forms/AddSessionForm')
    const { container } = render(
      <AddSessionForm isOpen={false} onClose={vi.fn()} onSuccess={vi.fn()} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('disables the submit button until a title is typed', async () => {
    const { AddSessionForm } = await import('@/components/forms/AddSessionForm')
    render(<AddSessionForm isOpen={true} onClose={vi.fn()} onSuccess={vi.fn()} />)

    const submit = screen.getByRole('button', { name: /Créer Session/i })
    expect(submit).toBeDisabled()

    const titleInput = screen.getByPlaceholderText(/Phase 1 Write Capability/i) as HTMLInputElement
    fireEvent.change(titleInput, { target: { value: 'Phase 2 Tests', name: 'title' } })
    expect(submit).not.toBeDisabled()
  })

  it('calls onSuccess and onClose after a successful createSession', async () => {
    mockSupabase.from.mockReturnValueOnce(
      createQueryBuilder({ data: { id: 'CONV-NEW', title: 'Phase 2 Tests' }, error: null }),
    )

    const onSuccess = vi.fn()
    const onClose = vi.fn()
    const { AddSessionForm } = await import('@/components/forms/AddSessionForm')
    render(<AddSessionForm isOpen={true} onClose={onClose} onSuccess={onSuccess} />)

    const titleInput = screen.getByPlaceholderText(/Phase 1 Write Capability/i)
    fireEvent.change(titleInput, { target: { value: 'Phase 2 Tests', name: 'title' } })

    const submit = screen.getByRole('button', { name: /Créer Session/i })
    fireEvent.click(submit)

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1))
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(mockSupabase.from).toHaveBeenCalledWith('sessions')
  })
})

describe('NextStepActions', () => {
  const baseStep = {
    id: 'NS-01',
    label: 'Test step',
    status: 'todo' as const,
    priority: 'medium' as const,
    phase: '01',
  }

  it('cycles a todo step to in_progress on icon click (optimistic local update)', async () => {
    const onStepUpdate = vi.fn()
    const { NextStepActions } = await import('@/components/forms/NextStepActions')

    render(
      <NextStepActions
        steps={[baseStep]}
        onStepUpdate={onStepUpdate}
        onAddStep={vi.fn()}
      />,
    )

    // The status icon button is the first <button> rendered for the step (before priority spans)
    const buttons = screen.getAllByRole('button')
    const statusButton = buttons.find((b) => b.querySelector('div')) // icon wrapper
    expect(statusButton).toBeDefined()
    fireEvent.click(statusButton!)

    await waitFor(() => expect(onStepUpdate).toHaveBeenCalledWith('NS-01', 'in_progress'))
  })
})
