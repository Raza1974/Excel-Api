// Card.tsx
import { ReactNode } from 'react'
import clsx from 'clsx'

export function Card({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div className={clsx("bg-white shadow-lg rounded-lg overflow-hidden", className)}>
      {children}
    </div>
  )
}

export function CardHeader({ children }: { children: ReactNode }) {
  return <div className="p-4 border-b">{children}</div>
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-xl font-bold">{children}</h2>
}

export function CardContent({ children }: { children: ReactNode }) {
  return <div className="p-4">{children}</div>
}
