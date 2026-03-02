"use client"
import * as React from "react"
import { cn } from "@/src/lib/utils"

interface TabsContextValue { value: string; onValueChange: (v: string) => void }
const TabsContext = React.createContext<TabsContextValue>({ value: "", onValueChange: () => {} })

function Tabs({ value, onValueChange, children, className, ...props }: React.HTMLAttributes<HTMLDivElement> & TabsContextValue) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn("", className)} {...props}>{children}</div>
    </TabsContext.Provider>
  )
}

function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex border-b border-border", className)}
      {...props}
    />
  )
}

function TabsTrigger({ value, className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const ctx = React.useContext(TabsContext)
  const active = ctx.value === value
  return (
    <button
      onClick={() => ctx.onValueChange(value)}
      className={cn(
        "flex-1 flex flex-col items-center gap-0.5 pb-2.5 pt-2 text-xs font-medium transition-colors",
        "border-b-2 -mb-px focus-visible:outline-none",
        active
          ? "border-brand-orange text-foreground font-bold"
          : "border-transparent text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function TabsContent({ value, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const ctx = React.useContext(TabsContext)
  if (ctx.value !== value) return null
  return <div className={cn("animate-fade-up", className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
