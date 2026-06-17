import type { Meta, StoryObj } from '@storybook/preact'
import Input from './Input'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {

    error: {
      control: 'boolean',
      description:
        'Whether the input field is in an error state. Takes precedence over success state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    success: {
      control: 'boolean',
      description:
        'Whether the input field is in a success state. Takes precedence over clearable button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    clearable: {
      control: 'boolean',
      description:
        'Whether the input field should have button to clear its content.',
    },

    required: {
      control: 'boolean',
      description: 'Whether the input field is required.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    type: {
      control: 'select',
      options: ['text', 'email'],
      description: 'The type of the input field',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'text' },
      },
    },

    fill: {
      control: 'boolean',
      description:
        'Whether the input should take the full width of its container',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Flag to disable the input field',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },

  decorators: [
    (Story) => {
      return <Story />
    },
  ],
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    id: 'default-input',
  },
}

export const Filled: Story = {
  args: {
    id: 'filled-input',
    value: 'Edit Me',
    clearable: true,
  },
}

export const Invalid: Story = {
  args: {
    id: 'invalid-input',
    value: 'Invalid',
    error: true,
  },
}

export const Disabled: Story = {
  args: {
    id: 'disabled-input',
    value: 'Can\'t Edit Me',
    disabled: true,
    clearable: true,
  },
}

export const Success: Story = {
  args: {
    id: 'success-input',
    value: 'Success',
    success: true,
    clearable: true,
  },
}
