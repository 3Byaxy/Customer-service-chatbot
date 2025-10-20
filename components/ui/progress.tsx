import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
}

export function Progress({ value = 0, className, ...props }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      className={cn("w-full h-2 bg-gray-200 rounded", className)}
      {...props}
    >
      <div
        className="h-full bg-blue-600 rounded"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

export default Progress


