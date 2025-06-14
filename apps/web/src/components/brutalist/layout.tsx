"use client"

import { cn } from "@/lib/utils"
import { bt } from "@/lib/theme-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReactNode } from "react"

interface BrutalGridProps {
  children: ReactNode
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  className?: string
}

export function BrutalGrid({ children, cols = 12, className }: BrutalGridProps) {
  const gridClass = {
    1: "grid-cols-1",
    2: "grid-cols-2", 
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    7: "grid-cols-7",
    8: "grid-cols-8",
    9: "grid-cols-9",
    10: "grid-cols-10",
    11: "grid-cols-11",
    12: "grid-cols-12",
  }[cols]

  return (
    <div className={cn("grid", gridClass, className)}>
      {children}
    </div>
  )
}

interface BrutalSectionProps {
  children: ReactNode
  className?: string
  fullWidth?: boolean
}

export function BrutalSection({ children, className, fullWidth = false }: BrutalSectionProps) {
  return (
    <section className={cn(
      "py-8 px-4",
      fullWidth ? "w-full" : "max-w-7xl mx-auto",
      className
    )}>
      {children}
    </section>
  )
}

interface BrutalHeadlineProps {
  children: ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "huge" | "massive" | "mega"
  className?: string
}

export function BrutalHeadline({ children, size = "lg", className }: BrutalHeadlineProps) {
  const sizeClass = {
    sm: "text-lg font-black",
    md: "text-xl font-black",
    lg: "text-2xl font-black",
    xl: "text-3xl font-black",
    huge: "text-4xl font-black",
    massive: "text-5xl font-black",
    mega: "text-6xl font-black",
  }[size]

  return (
    <h1 className={cn(
      sizeClass,
      "uppercase tracking-tight leading-none",
      className
    )}>
      {children}
    </h1>
  )
}

interface BrutalBoxProps {
  children: ReactNode
  className?: string
  border?: boolean
  hover?: boolean
}

export function BrutalBox({ children, className, border = false, hover = false }: BrutalBoxProps) {
  return (
    <div className={cn(
      "p-6",
      border && "border-4",
      hover && "transition-all duration-100 hover:shadow-brutal-lg",
      className
    )}>
      {children}
    </div>
  )
}

interface BrutalTextProps {
  children: ReactNode
  variant?: "default" | "mono" | "brutal"
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  className?: string
}

export function BrutalText({ children, variant = "default", size = "md", className }: BrutalTextProps) {
  const variantClass = {
    default: "",
    mono: "font-mono",
    brutal: "font-black uppercase tracking-wide",
  }[variant]

  const sizeClass = {
    xs: "text-xs",
    sm: "text-sm", 
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  }[size]

  return (
    <p className={cn(
      variantClass,
      sizeClass,
      className
    )}>
      {children}
    </p>
  )
} 