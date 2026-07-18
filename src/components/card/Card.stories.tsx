import Card from './'
import type { Meta, StoryObj } from '@storybook/preact'

const meta: Meta<typeof Card> = {
  title: 'Showcase/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    mainText: {
      control: 'text',
      description: 'The main text to display on the card',
    },
    ctaText: {
      control: 'text',
      description: 'The call-to-action text for the button on the card',
    },
    icon: {
      control: 'select',
      options: ['user', 'clock'],
    },
    fill: {
      control: 'boolean',
      description: 'Whether the card should fill the available width',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    class: {
      control: 'text',
      description: 'Additional classes to apply to the card container',
    },
  },
}

export default meta
type Story = StoryObj<typeof Card>

export const Regular: Story = {
  args: {
    mainText: 'Join the family.',
    ctaText: 'Join',
    icon: 'user',
    onCtaClick: () => {
      alert('Clicked')
    },
  },
}

export const Extended: Story = {
  args: {
    mainText: 'Join the family.',
    ctaText: 'Become a member',
    icon: 'user',
    onCtaClick: () => {
      alert('Clicked')
    },
    fill: true,
  },
}

export const WithAdditionalClass: Story = {
  args: {
    mainText: 'Join the family.',
    ctaText: 'Join',
    icon: 'user',
    onCtaClick: () => {
      alert('Clicked')
    },
    fill: true,
    class: 'max-w-[380px]',
  },
}
