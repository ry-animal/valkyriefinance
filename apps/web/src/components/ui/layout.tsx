import * as React from "react"
import { cn } from "@/lib/utils"

interface BrutalGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: "auto" | "brutal" | number
}

const BrutalGrid = React.forwardRef<HTMLDivElement, BrutalGridProps>(
  ({ className, columns = "brutal", children, ...props }, ref) => {
    const gridClass = typeof columns === "number"
      ? `grid-cols-${columns}`
      : columns === "brutal"
        ? "grid-cols-brutal"
        : "grid-cols-brutal-auto"

    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-grid p-grid",
          gridClass,
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
BrutalGrid.displayName = "BrutalGrid"

interface BrutalSectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "inverted" | "bordered"
}

const BrutalSection = React.forwardRef<HTMLElement, BrutalSectionProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variantClasses = {
      default: "bg-white text-black",
      inverted: "bg-black text-white",
      bordered: "bg-white text-black border-b-4 border-black"
    }

    return (
      <section
        ref={ref}
        className={cn(
          "w-full",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </section>
    )
  }
)
BrutalSection.displayName = "BrutalSection"

interface BrutalHeadlineProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  size?: "mega" | "giant" | "massive" | "huge" | "large" | "medium"
}

const BrutalHeadline = React.forwardRef<HTMLHeadingElement, BrutalHeadlineProps>(
  ({ className, level = 1, size = "massive", children, ...props }, ref) => {
    const Comp = `h${level}` as keyof JSX.IntrinsicElements

    const sizeClasses = {
      mega: "text-mega",
      giant: "text-giant",
      massive: "text-massive",
      huge: "text-huge",
      large: "text-6xl",
      medium: "text-4xl"
    }

    return React.createElement(
      Comp,
      {
        ref,
        className: cn(
          "font-brutal font-black uppercase tracking-tighter leading-none",
          sizeClasses[size],
          className
        ),
        ...props
      },
      children
    )
  }
)
BrutalHeadline.displayName = "BrutalHeadline"

interface BrutalBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "shadow" | "hover" | "inverted"
  border?: boolean
}

const BrutalBox = React.forwardRef<HTMLDivElement, BrutalBoxProps>(
  ({ className, variant = "default", border = true, children, ...props }, ref) => {
    const variantClasses = {
      default: "bg-white text-black",
      shadow: "bg-white text-black shadow-brutal",
      hover: "bg-white text-black shadow-brutal hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all duration-100",
      inverted: "bg-black text-white"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "p-6",
          border && "border-4 border-black",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
BrutalBox.displayName = "BrutalBox"

interface BrutalTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "mono" | "brutal" | "normal"
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl"
}

const BrutalText = React.forwardRef<HTMLParagraphElement, BrutalTextProps>(
  ({ className, variant = "mono", size = "base", children, ...props }, ref) => {
    const variantClasses = {
      mono: "font-mono",
      brutal: "font-brutal font-black uppercase",
      normal: "font-sans"
    }

    const sizeClasses = {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl"
    }

    return (
      <p
        ref={ref}
        className={cn(
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </p>
    )
  }
)
BrutalText.displayName = "BrutalText"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, description, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("mb-8", className)} {...props}>
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-2 text-lg text-muted-foreground">{description}</p>
        )}
      </div>
    );
  }
);
PageHeader.displayName = "PageHeader";

export {
  BrutalGrid,
  BrutalSection,
  BrutalHeadline,
  BrutalBox,
  BrutalText,
  PageHeader
}