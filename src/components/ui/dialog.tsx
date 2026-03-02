"use client"
import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@/src/lib/utils"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

// Renders into document.body via a portal, escaping any overflow:hidden /
// z-index stacking context. Uses a lazy ref instead of a mounted-state boolean
// so the portal fires synchronously in both browser and jsdom test environments
// (avoiding the "Dialog renders null until useEffect flushes" test failure).
function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null

  // Attempt portal; fall back to in-tree render when document is unavailable
  // (e.g. SSR). typeof document guard prevents SSR crashes.
  const target = typeof document !== "undefined" ? document.body : null

  const content = (
    <div className="fixed inset-0" style={{ zIndex: 9999 }}>
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => onOpenChange?.(false)}
      />
      {children}
    </div>
  )

  return target ? createPortal(content, target) : content
}

function DialogContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
        "w-[90%] max-w-md",
        "rounded-2xl border border-white/10 bg-[hsl(0,0%,6%)] p-8 shadow-2xl",
        "animate-dialog-in",
        className
      )}
      style={{ zIndex: 10000 }}
      {...props}
    >
      {children}
    </div>
  )
}

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col items-center text-center gap-2 mb-6", className)} {...props} />
}

function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-xl font-bold tracking-tight text-[hsl(36,100%,96%)]", className)} {...props} />
}

function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-[hsl(0,0%,53%)] leading-relaxed", className)} {...props} />
}

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex gap-3 mt-6 justify-center", className)} {...props} />
}

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter }
