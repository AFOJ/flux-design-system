import { ChevronDownIcon, Icon, type IconKey } from '../icons'
import { useEffect, useRef, useState } from 'preact/hooks'
import clsx from 'clsx'

interface Option {
  label: string
  value: string
}

interface DropdownProps {
  options: Option[]
  icon?: IconKey
  value?: string
  disabled?: boolean
  onChange?: (value: string) => void
  class?: string
}

export default function Dropdown(props: Readonly<DropdownProps>) {
  const {
    options,
    icon,
    value,
    disabled,
    class: className,
    onChange,
  } = props
  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const [selectedValue, setSelectedValue] = useState(value || '')

  const selectedOption = options.find((opt) => opt.value === selectedValue)
  const hasValue = !!selectedValue

  const handleToggle = () => !disabled && setIsOpen(!isOpen)

  const handleSelect = (val: string) => {
    setSelectedValue(val)
    setIsOpen(false)
    onChange?.(val)
  }

  useEffect(() => {
    if (isOpen && activeIndex >= 0 && listRef.current) {
      const activeElement = listRef.current.children[activeIndex] as HTMLElement
      if (activeElement) {
        activeElement.scrollIntoView({
          block: 'nearest',
        })
      }
    }
  }, [activeIndex, isOpen])

  const handleKeyDown = (e: KeyboardEvent) => {
    if (disabled) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) setIsOpen(true)
        setActiveIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        if (!isOpen) setIsOpen(true)
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1))
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (isOpen && activeIndex >= 0) {
          handleSelect(options[activeIndex].value)
        } else {
          setIsOpen(true)
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
      case 'Tab':
        setIsOpen(false)
        break
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div
      class={clsx('w-full relative flex flex-col gap-y-0.5', className)}
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        class={clsx(
          'relative w-full min-h-[--res-mobile-spacing-5xl]',
          'flex items-center p-4 justify-between',
          'rounded-(--border-radius-md) border-none outline-none',
          'transition-all duration-200',
          {
            'ring-inset  ring-(--border-colour-passive)': !disabled,
            'ring-(length:--border-width-lg)': hasValue && !disabled,
            'ring-(length:--border-width-md)':
              isFocused && !hasValue && !disabled,
            'ring-(length:--border-width-xs)':
              !isFocused && !hasValue && !disabled,
          },
          {
            'bg-(--surface-colour-disabled-dark) cursor-not-allowed': disabled,
            'bg-(--surface-colour-page)': hasValue && !disabled,
            'bg-(--surface-colour-secondary)': !hasValue && !disabled,
          },
        )}
      >
        <div class="flex items-center gap-3 flex-1 min-w-0 overflow-hidden">

          {icon && (
            <span
              aria-hidden="true"
              class={clsx({
                'text-(--text-colour-disabled)': disabled,
                'text-(--text-colour-action-active)': !disabled,
              })}
            >
              <Icon icon={icon} />
            </span>
          )}

          <span
            class={clsx(
              'font-(--font-font-weight-paragraph-medium)',
              'truncate',
              {
                'text-(--text-colour-disabled)': disabled,
                'text-(--text-colour-active)': !disabled,
              },
            )}
          >
            {selectedOption?.label || ''}
          </span>
        </div>

        <span
          aria-hidden="true"
          className={clsx('transition-transform duration-200', {
            'rotate-180': isFocused || isOpen,
            'text-(--text-colour-disabled)': disabled,
            'text-(--text-colour-active)': !disabled,
          })}
        >
          <ChevronDownIcon />
        </span>
      </button>

      <div class="relative w-full h-0">
        {isOpen && (
          <ul
            ref={listRef}
            role="listbox"
            tabIndex={-1}
            class={clsx(
              'absolute z-50 overflow-auto',
              'w-full mt-1',
              'max-h-64',
              'bg-(--surface-colour-secondary)',
              'border-none rounded-(--border-radius-md)  shadow-2xl shadow-black/20 ',
              'focus:outline-none',
              '[&::-webkit-scrollbar]:w-3',
              '[&::-webkit-scrollbar-thumb]:border-4 [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-transparent',
              '[&::-webkit-scrollbar-thumb]:bg-clip-padding',
              '[&::-webkit-scrollbar-thumb]:rounded-full',
              '[&::-webkit-scrollbar-thumb]:bg-(--surface-colour-disabled-dark)',
              'hover:[&::-webkit-scrollbar-thumb]:bg-(--surface-colour-action-hover-primary)',
              '[&::-webkit-scrollbar-track]:bg-transparent',
            )}
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={selectedValue === option.value}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setActiveIndex(index)}
                class={clsx(
                  'cursor-pointer select-none p-3 [font-size:var(--res-mobile-font-size-body-sm)] transition-colors truncate',
                  'min-w-0',
                  {
                    'bg-(--surface-colour-passive)': activeIndex === index,
                    'text-(--text-colour-active) font-(--font-font-weight-paragraph-bold)':
                      selectedValue === option.value,
                  },
                )}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
