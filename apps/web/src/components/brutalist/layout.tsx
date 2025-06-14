"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReactNode } from "react"

interface BrutalGridProps {
  children: ReactNode
  className?: string
  cols?: number
}

export function BrutalGrid({ children, className, cols = 12 }: BrutalGridProps) {
  return (
    <div 
      className={cn(
        "grid gap-4 border-4 border-black bg-white p-4",
        cols === 12 && "grid-cols-12",
        cols === 8 && "grid-cols-8",
        cols === 6 && "grid-cols-6",
        cols === 4 && "grid-cols-4",
        className
      )}
    >
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
    <section 
      className={cn(
        "border-4 border-black bg-white p-8",
        !fullWidth && "max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </section>
  )
}

interface BrutalHeadlineProps {
  children: ReactNode
  className?: string
  size?: "mega" | "giant" | "massive" | "huge"
}

export function BrutalHeadline({ children, className, size = "massive" }: BrutalHeadlineProps) {
  return (
    <h1 
      className={cn(
        "font-brutal uppercase text-black leading-none tracking-tighter",
        size === "mega" && "text-mega",
        size === "giant" && "text-giant", 
        size === "massive" && "text-massive",
        size === "huge" && "text-huge",
        className
      )}
    >
      {children}
    </h1>
  )
}

interface BrutalBoxProps {
  children: ReactNode
  className?: string
  shadow?: boolean
  border?: boolean
}

export function BrutalBox({ children, className, shadow = true, border = true }: BrutalBoxProps) {
  return (
    <div 
      className={cn(
        "bg-white p-6",
        border && "border-4 border-black",
        shadow && "shadow-brutal",
        className
      )}
    >
      {children}
    </div>
  )
}

interface BrutalTextProps {
  children: ReactNode
  className?: string
  variant?: "body" | "mono" | "brutal"
  size?: "sm" | "base" | "lg" | "xl"
}

export function BrutalText({ children, className, variant = "mono", size = "base" }: BrutalTextProps) {
  return (
    <p 
      className={cn(
        "text-black",
        variant === "body" && "font-sans",
        variant === "mono" && "font-mono uppercase tracking-wide",
        variant === "brutal" && "font-brutal uppercase tracking-widest font-black",
        size === "sm" && "text-sm",
        size === "base" && "text-base",
        size === "lg" && "text-lg",
        size === "xl" && "text-xl",
        className
      )}
    >
      {children}
    </p>
  )
} 