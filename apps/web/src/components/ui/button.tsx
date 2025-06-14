import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-brutal font-black uppercase tracking-widest text-lg transition-all duration-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-4 border-black",
  {
    variants: {
      variant: {
        default: "bg-black text-white hover:bg-white hover:text-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm",
        destructive: "bg-white text-black hover:bg-black hover:text-white shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm",
        outline: "bg-white text-black hover:bg-black hover:text-white shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm",
        secondary: "bg-white text-black hover:bg-black hover:text-white shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm",
        ghost: "border-0 shadow-none bg-transparent hover:bg-black hover:text-white",
        link: "border-0 shadow-none text-black underline-offset-4 hover:underline font-mono font-bold uppercase text-base",
      },
      size: {
        default: "px-6 py-3",
        sm: "px-4 py-2 text-base",
        lg: "px-8 py-4 text-xl",
        xl: "px-12 py-6 text-2xl",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
