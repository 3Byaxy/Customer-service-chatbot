import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 hover:scale-105 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 hover:scale-105 focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:ring-offset-2",
        outline:
          "border-2 border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2",
        secondary:
          "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg hover:shadow-xl hover:from-gray-700 hover:to-gray-800 hover:scale-105 focus-visible:ring-2 focus-visible:ring-gray-500/50 focus-visible:ring-offset-2",
        ghost:
          "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-gray-500/50 focus-visible:ring-offset-2",
        link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-800",
        success:
          "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 hover:scale-105 focus-visible:ring-2 focus-visible:ring-green-500/50 focus-visible:ring-offset-2",
        warning:
          "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg hover:shadow-xl hover:from-yellow-600 hover:to-orange-600 hover:scale-105 focus-visible:ring-2 focus-visible:ring-yellow-500/50 focus-visible:ring-offset-2",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-lg has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-12 rounded-lg px-6 has-[>svg]:px-4 text-base",
        icon: "size-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

