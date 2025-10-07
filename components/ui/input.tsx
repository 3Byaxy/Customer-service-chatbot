import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Enhanced base styling with better colors and shadows
        "bg-white border-2 border-gray-200 rounded-lg px-4 py-2 text-base font-medium",
        "text-gray-900 placeholder:text-gray-400",
        "shadow-sm hover:shadow-md",
        "transition-all duration-200 ease-in-out",
        // Focus states with brand colors
        "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:shadow-lg",
        // Error states
        "aria-invalid:border-red-500 aria-invalid:ring-red-500/20",
        // Disabled states
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
        // File input styling
        "file:inline-flex file:h-8 file:border-0 file:bg-gray-100 file:px-3 file:py-1 file:rounded-md file:text-sm file:font-medium file:text-gray-700 file:mr-2 file:cursor-pointer file:hover:bg-gray-200",
        // Responsive text sizing
        "md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }

