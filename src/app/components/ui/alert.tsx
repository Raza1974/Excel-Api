// Alert.tsx
import { ReactNode } from 'react'
import clsx from 'clsx'


export function Alert({
  children,
  variant = 'default',
  className,
}: {
  children: ReactNode
  variant?: 'default' | 'destructive'
  className?: string
}) {
  const variantClasses = {
    default: 'bg-blue-100 text-blue-800 border-blue-200',
    destructive: 'bg-red-100 text-red-800 border-red-200',
  }

  return (
    <div
      className={clsx(
        'p-4 border-l-4 rounded flex items-start space-x-2',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </div>
  )
}

export function AlertTitle({ children }: { children: ReactNode }) {
  return <h3 className="font-semibold">{children}</h3>
}

export function AlertDescription({ children }: { children: ReactNode }) {
  return <p className="text-sm">{children}</p>
}
