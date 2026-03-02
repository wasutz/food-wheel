"use client"
import * as React from "react"
import { cn } from "@/src/lib/utils"
import { Check, Minus } from "lucide-react"

export interface CheckboxProps extends React.HTMLAttributes<HTMLButtonElement> {
  checked?: boolean
  indeterminate?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, checked, indeterminate, onCheckedChange, onClick, ...props }, ref) => (
    <button
      ref={ref}
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      onClick={(e) => {
        e.stopPropagation()
        onCheckedChange?.(!checked)
        onClick?.(e)
      }}
      className={cn(
        "h-4 w-4 shrink-0 rounded-sm border transition-all",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked || indeterminate
          ? "border-brand-orange bg-brand-orange text-white"
          : "border-white/20 bg-transparent",
        className
      )}
      {...props}
    >
      {checked && <Check className="h-3 w-3 mx-auto" strokeWidth={3} />}
      {!checked && indeterminate && <Minus className="h-3 w-3 mx-auto" strokeWidth={3} />}
    </button>
  )
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
