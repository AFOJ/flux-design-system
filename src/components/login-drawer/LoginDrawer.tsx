import { IconButton } from '../icons'
import { useRef, useEffect } from 'preact/hooks'
import Button from '../button/'
import Card from '../card'
import clsx from 'clsx'
import Dropdown from '../dropdown/Dropdown'
import Input from '../input'
import Label from '../label'

interface LoginDrawerProps {
  onClose?: () => void
  isOpen?: boolean
}
export default function LoginDrawer(props: Readonly<LoginDrawerProps>) {
  const { onClose, isOpen = false } = props

  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen || !drawerRef.current) {
      return
    }

    const container = drawerRef.current

    const focusableSelectors = 'button, input, [tabindex]:not([tabindex="-1"])'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' && e.key !== 'Escape') return

      if (e.key === 'Escape') {
        onClose?.()
        return
      }

      const focusableElements =
        container.querySelectorAll<HTMLElement>(focusableSelectors)
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      const isFirstElementFocused = document.activeElement === firstElement
      const isLastElementFocused = document.activeElement === lastElement

      if (e.shiftKey) {
        if (isFirstElementFocused) {
          lastElement.focus()
          e.preventDefault()
        }
      } else if (isLastElementFocused) {
        firstElement.focus()
        e.preventDefault()
      }
    }

    // Focus the first element or the close button when opened
    const initialFocus =
      container.querySelector<HTMLElement>(focusableSelectors)
    initialFocus?.focus()

    container.addEventListener('keydown', handleKeyDown)

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return (
    <section
      ref={drawerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-drawer-title"
      class={clsx(
        'w-full max-w-125 bg-(--surface-colour-secondary)',
        'flex flex-col gap-(--res-mobile-spacing-3xl) sm:gap-(--res-desktop-spacing-2xl)',
        'p-(--res-mobile-spacing-2xl) sm:p-(--res-desktop-spacing-2xl)',
      )}
    >
      <div class={'w-full flex justify-end'}>
        <IconButton
          ariaLabel="Close Drawer"
          icon="close"
          onClick={onClose}
          class={clsx({ 'cursor-pointer': Boolean(onClose) })}
        />
      </div>

      <h2
        id="login-drawer-title"
        class={clsx(
          'text-(--text-colour-theme)',
          '[font-size:var(--res-mobile-font-size-heading-h4)] sm:[font-size:var(--res-desktop-font-size-heading-h4)] ',
          'font-(--font-font-weight-header-medium)',
          'sm:max-w-75',
        )}
      >
        Log into your account
      </h2>

      <p>Please enter your email for a one-time-only code</p>

      <form
        class={
          'space-y-(--res-mobile-spacing-2xl) sm:space-y-(--res-desktop-spacing-xl)'
        }
      >

        <div class={"flex flex-col gap-1"}>
          <Label htmlFor="email-input">Email</Label>
          <Input id={'email-input'} type="email" fill />
        </div>

        <div class={"flex flex-col gap-1"}>
          <Label htmlFor="customer-type-input">Customer Type</Label>
          <Dropdown
          id='customer-type-input'
            options={[
              { label: 'Customer 1', value: 'cust-1' },
              { label: 'Customer 2', value: 'cust-2' },
            ]}
          />
        </div>




      </form>

      <div
        class={
          'w-full flex flex-col gap-(--res-mobile-spacing-md) sm:gap-(--res-desktop-spacing-md)'
        }
      >
        <Button text="Continue" variant="secondary" fill />
        <Button text="Login with your password" variant="tertiary" fill />
      </div>

      <Card
        mainText="Join the family."
        ctaText="Become a member"
        onCtaClick={() => { }}
        icon="user"
        fill
      />
    </section>
  )
}
