/**
 * Foundation OS — Design System
 * Text.stories — typographic scale + variants + weights + colors.
 */
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Text } from './Text'

const meta = {
  title: 'Primitives/Text',
  component: Text,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'body', 'body-small', 'label', 'code']
    },
    weight: {
      control: 'select',
      options: [undefined, 'regular', 'medium', 'semibold', 'bold']
    },
    color: {
      control: 'select',
      options: ['primary', 'muted']
    },
    children: { control: 'text' }
  },
  args: {
    children: 'Foundation OS Design System'
  }
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const H1: Story = { args: { variant: 'h1' } }
export const H2: Story = { args: { variant: 'h2' } }
export const H3: Story = { args: { variant: 'h3' } }
export const Body: Story = {
  args: { variant: 'body', children: 'Body text — Void Glass standard 16px/400.' }
}
export const BodySmall: Story = {
  args: { variant: 'body-small', children: 'Body small — 14px/400 pour contenu dense.' }
}
export const Label: Story = {
  args: { variant: 'label', children: 'LABEL UI' }
}
export const Code: Story = {
  args: {
    variant: 'code',
    children: "const tokens = require('@foundation-os/design-system/tokens')"
  }
}

export const MutedLargeText: Story = {
  args: {
    variant: 'h3',
    color: 'muted',
    children: 'Muted works on large text (h1-h3) — WCAG AA large compliant.'
  }
}

export const TypographicScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Text variant="h1">H1 — Foundation OS</Text>
      <Text variant="h2">H2 — Headline secondaire</Text>
      <Text variant="h3">H3 — Section heading</Text>
      <Text variant="body">
        Body — Texte courant en Figtree regular 16px, utilise pour les paragraphes.
      </Text>
      <Text variant="body-small">Body small — 14px pour contenu dense ou cards.</Text>
      <Text variant="label">LABEL UI</Text>
      <Text variant="code">const x: number = 42</Text>
    </div>
  )
}
