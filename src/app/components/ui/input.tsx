// Input.tsx
import { InputHTMLAttributes } from 'react'
import clsx from 'clsx'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        'w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500',
        className
      )}
      {...props}
    />
  )
}
