import Label from '../label'
import RequiredComponent from '../required'
import Dropdown from './Dropdown'
import type { Meta, StoryObj } from '@storybook/preact'

const mockOptions = [
  { label: 'Retail Store Owner', value: 'retail' },
  { label: 'Convenience Store Owner', value: 'convenience' },
]

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {

    options: {
      control: 'object',
      description: 'The options for the dropdown',
      table: {
        type: { summary: 'Array<{ label: string; value: string }>' },
      },
    },

    icon: {
      control: 'select',
      options: [null, 'clock', 'user'],
      description: 'Icon to display on the left side of the button'
    },

    value: {
      control: 'text',
      description: 'The current value of the dropdown',
    },

    onChange: {
      description: 'Handles what happens when the dropdown value changes',
    },

    disabled: {
      control: 'boolean',
      description: 'Flag to disable the dropdown',
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
type Story = StoryObj<typeof Dropdown>

export const Default: Story = {
  args: {
    options: [
      { label: 'Retail Store Owner', value: 'retail' },
      { label: 'Convenience Store Owner', value: 'convenience' },
    ],
  },
}

export const Prefilled: Story = {
  args: {
    value: 'convenience',
    options: mockOptions,
  },
}

export const WithLabel: Story = {
  args: {
    disabled: false,
    options: mockOptions,
  },
  render: (args) => {

    return (
      <div class={"p-6 flex flex-col gap-1"}>

        <Label htmlFor="owner-dropdown">Choose Owner </Label>
        <Dropdown {...args} />
      </div>
    )
  },
}

export const Required: Story = {
  args: {
    disabled: false,
    options: mockOptions,
  },
  render: (args) => {

    return (
      <div class={"p-6 flex flex-col gap-1"}>
        <Label htmlFor="owner-dropdown">Choose Owner <RequiredComponent /></Label>

        <Dropdown {...args} />
      </div>
    )
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    options: mockOptions,
  },
}
