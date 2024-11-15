// Button.tsx
import { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

export function Button({ children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        'px-4 py-2 bg-blue-600 text-white rounded-full transition-colors duration-200 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
