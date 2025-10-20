"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onCheckedChange, className, ...props }, ref) => {
    const [internal, setInternal] = React.useState<boolean>(!!checked)

    React.useEffect(() => {
      if (checked === undefined) return
      setInternal(!!checked)
    }, [checked])

    function toggle() {
      const next = !internal
      setInternal(next)
      onCheckedChange?.(next)
    }

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={internal}
        onClick={toggle}
        className={cn(
          "inline-flex h-6 w-10 items-center rounded-full transition-colors",
          internal ? "bg-green-600" : "bg-gray-300",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
            internal ? "translate-x-4" : "translate-x-1"
          )}
        />
      </button>
    )
  }
)
Switch.displayName = "Switch"

export default Switch


