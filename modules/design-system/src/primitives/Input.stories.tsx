/**
 * Foundation OS — Design System
 * Input.stories — types × states × with label/helper/error/success.
 */
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Input } from './Input'
import { Icon } from './Icon'

const meta = {
  title: 'Primitives/Input',
  component: Input,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url']
    },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    errorText: { control: 'text' },
    successText: { control: 'text' }
  },
  args: {
    label: 'Email',
    placeholder: 'vous@exemple.com',
    type: 'email'
  }
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithHelperText: Story = {
  args: {
    helperText: 'Nous utilisons ton email pour te connecter.'
  }
}

export const WithError: Story = {
  args: {
    errorText: 'Cet email n’est pas valide.',
    defaultValue: 'invalid-email'
  }
}

export const WithSuccess: Story = {
  args: {
    successText: 'Email verifie.',
    defaultValue: 'kevin@foundation-os.com'
  }
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'locked@exemple.com' }
}

export const WithLeadingIcon: Story = {
  args: {
    label: 'Rechercher',
    type: 'search',
    placeholder: 'Tape pour rechercher…',
    leadingIcon: <Icon name="Search" size={16} />
  }
}

export const WithTrailingIcon: Story = {
  args: {
    label: 'Mot de passe',
    type: 'password',
    placeholder: '••••••••',
    trailingIcon: <Icon name="Check" size={16} />
  }
}

export const Password: Story = {
  args: { type: 'password', label: 'Mot de passe', placeholder: '••••••••' }
}

export const AllStates: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        maxWidth: 360
      }}
    >
      <Input label="Default" placeholder="Tape ici" />
      <Input label="With helper" placeholder="Tape ici" helperText="Ce champ est optionnel." />
      <Input
        label="With error"
        placeholder="Tape ici"
        defaultValue="invalid"
        errorText="Valeur invalide."
      />
      <Input
        label="With success"
        placeholder="Tape ici"
        defaultValue="kevin"
        successText="Disponible !"
      />
      <Input label="Disabled" placeholder="Tape ici" disabled defaultValue="locked" />
    </div>
  )
}
