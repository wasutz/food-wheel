import * as React from "react"
import { cn } from "@/src/lib/utils"

const ScrollArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { maxHeight?: string }>(
  ({ className, children, maxHeight = "320px", ...props }, ref) => (
    <div
      ref={ref}
      className={cn("overflow-y-auto", className)}
      style={{ maxHeight }}
      {...props}
    >
      {children}
    </div>
  )
)
ScrollArea.displayName = "ScrollArea"

export { ScrollArea }
