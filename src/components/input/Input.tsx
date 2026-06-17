import { clsx } from 'clsx'
import { IconButton, TickIcon } from '../icons'
import { useEffect, useState } from 'preact/hooks'
import type { ComponentPropsWithoutRef } from 'preact/compat'
import type { TargetedInputEvent, TargetedMouseEvent } from 'preact'

interface InputFieldProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  'onBlur' | 'onFocus' | 'type'
> {
  error?: boolean
  success?: boolean
  disabled?: boolean
  type?: 'text' | 'email'
  value?: string
  clearable?: boolean
  fill?: boolean
}

export default function Input(props: Readonly<InputFieldProps>) {
  const {
    error,
    success,
    disabled,
    clearable,
    onInput,
    value,
    type = 'text',
    fill,
    ...rest
  } = props
  const [isFocused, setIsFocused] = useState(false)
  const [internalValue, setInternalValue] = useState(value || '')
  const hasValue = internalValue.length > 0

  useEffect(() => {
    setInternalValue(value || '')
  }, [value])

  const handleInput = (e: TargetedInputEvent<HTMLInputElement>) => {
    const newValue = (e.target as HTMLInputElement)?.value
    setInternalValue(newValue || '')

    if (onInput) {
      onInput(e)
    }
  }

  const handleClear = (e: TargetedMouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    setInternalValue('')
  }

  return (
    <div class={clsx(fill ? 'w-full' : 'w-fit', 'space-y-1')}>
      <div
        class={clsx(
          'relative flex items-center space-x-2',
          'transition-all duration-200',
          'ring-inset rounded-(--border-radius-md)',
          {
            'ring-0': disabled,
            'ring-(length:--border-width-lg)':
              isFocused || (hasValue && !disabled),
            'ring-(length:--border-width-xs)':
              !isFocused && !hasValue && !disabled,

            'ring-(--border-colour-error)': error && !disabled,
            'ring-(--border-colour-passive)': !error && !disabled,
          },
          {
            'bg-(--surface-colour-disabled-dark) cursor-not-allowed': disabled,
            'bg-(--surface-colour-page)': hasValue && !disabled,
            'bg-(--surface-colour-secondary)': !hasValue && !disabled,
          },
        )}
      >
        <input
          {...rest}
          type={type}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoComplete={'off'}
          onInput={handleInput}
          value={internalValue}
          class={clsx(
            'w-full outline-none p-3 disabled:cursor-not-allowed',
            '[font-size:var(--res-mobile-font-size-body-md)] disabled:text-(--text-colour-disabled)',
            {
              'text-(--text-colour-error)': error && !disabled,
            },
            'bg-transparent text-(--text-colour-active)',
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-disabled={disabled ? 'true' : undefined}
        />

        {((success && !error) || clearable) && (
          <div class="flex items-center pr-3">
            {success && !error ? (
              <span aria-hidden="true" class={'text-(--text-colour-success)'}>
                <TickIcon />
              </span>
            ) : (
              clearable && (
                <IconButton
                  icon={'close'}
                  onClick={handleClear}
                  disabled={disabled}
                  ariaLabel="close-input-button"
                  class={clsx({
                    'text-(--text-colour-disabled)': disabled,
                    'text-(--text-colour-error)': error && !disabled,
                    'text-(--text-colour-action-active)': !disabled && !error,
                  })}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  )
}
