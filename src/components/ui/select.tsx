"use client"
// Lightweight native-select wrapper styled to match shadcn aesthetics
// (no Radix dependency needed — drops in as a styled <select>)
import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm",
        "transition-colors focus:outline-none focus:ring-1 focus:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "appearance-none cursor-pointer",
        "bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSI4IiB2aWV3Qm94PSIwIDAgMTIgOCI+PHBhdGggZD0iTTEgMWw1IDUgNS01IiBzdHJva2U9IiM4ODgiIHN0cm9rZS13aWR0aD0iMS41IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=')] bg-no-repeat bg-[right_12px_center] pr-8",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
)
Select.displayName = "Select"

export { Select }
