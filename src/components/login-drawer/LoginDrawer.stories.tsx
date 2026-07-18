import { useState } from 'preact/hooks'
import Button from '../button'
import LoginDrawer from './LoginDrawer'
import type { Meta, StoryObj } from '@storybook/preact'

type LoginDrawerProps = Parameters<typeof LoginDrawer>[0]
const meta: Meta<LoginDrawerProps> = {
  title: 'Showcase/Login Drawer',
  component: LoginDrawer,
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls whether the Login Drawer is open or closed.',
    },
    onClose: {
      description:
        'Callback function invoked when the drawer requests to close.',
      action: 'closed',
    },
  },
}

export default meta

type Story = StoryObj<LoginDrawerProps>

export const Default: Story = {
  args: {
    isOpen: false,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen)

    const handleOpen = () => setIsOpen(true)
    const handleClose = () => {
      setIsOpen(false)
      args.onClose?.()
    }

    return (
      <div style={{ padding: '40px' }}>
        {!isOpen && <Button text="Open Drawer" onClick={handleOpen} />}

        <LoginDrawer isOpen={isOpen} onClose={handleClose} />
      </div>
    )
  },
}
