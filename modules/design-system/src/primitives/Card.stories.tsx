/**
 * Foundation OS — Design System
 * Card.stories — variants × slot combinations × interactive.
 */
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Card } from './Card'
import { Text } from './Text'
import { Button } from './Button'
import { Icon } from './Icon'

const meta = {
  title: 'Primitives/Card',
  component: Card,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'interactive']
    },
    as: {
      control: 'select',
      options: ['div', 'section', 'article']
    }
  }
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

const SampleBody = () => (
  <>
    <Text variant="h3">Card title</Text>
    <Text variant="body" style={{ marginTop: 8 }}>
      Texte courant de la card. Remplace par le contenu reel — formulaire, liste, metric, etc.
    </Text>
  </>
)

export const Default: Story = {
  args: {
    children: <SampleBody />
  },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <Card {...args} />
    </div>
  )
}

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: <SampleBody />
  },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <Card {...args} />
    </div>
  )
}

export const Interactive: Story = {
  args: {
    variant: 'interactive',
    onClick: () => console.log('Card clicked'),
    children: <SampleBody />
  },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <Card {...args} />
    </div>
  )
}

export const WithHeaderAndFooter: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <Card
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Icon name="Bell" size={20} />
            <Text variant="h3">Notifications</Text>
          </div>
        }
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="ghost" size="sm">
              Ignorer
            </Button>
            <Button variant="primary" size="sm">
              Voir
            </Button>
          </div>
        }
      >
        <Text variant="body">
          Tu as 3 nouvelles notifications non lues dans ta boite.
        </Text>
      </Card>
    </div>
  )
}

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16
      }}
    >
      <Card>
        <Text variant="h3">Default</Text>
        <Text variant="body" style={{ marginTop: 8 }}>
          Surface Void Glass statique.
        </Text>
      </Card>
      <Card variant="elevated">
        <Text variant="h3">Elevated</Text>
        <Text variant="body" style={{ marginTop: 8 }}>
          Surface avec ombre discrete.
        </Text>
      </Card>
      <Card variant="interactive" onClick={() => undefined}>
        <Text variant="h3">Interactive</Text>
        <Text variant="body" style={{ marginTop: 8 }}>
          Clickable, keyboard-ready (role=button).
        </Text>
      </Card>
    </div>
  )
}
