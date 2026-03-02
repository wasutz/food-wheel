import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "brand"
  size?: "default" | "sm" | "lg" | "icon"
}

const variantClasses: Record<string, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
  outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground shadow-sm",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
  brand: "bg-gradient-to-br from-brand-orange to-amber-500 text-white hover:opacity-90 shadow-lg shadow-brand-orange/25",
}

const sizeClasses: Record<string, string> = {
  default: "h-9 px-4 py-2 text-sm",
  sm: "h-8 rounded-md px-3 text-xs",
  lg: "h-11 rounded-md px-8 text-base",
  icon: "h-9 w-9",
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium",
        "transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-40",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
)
Button.displayName = "Button"

export { Button }
