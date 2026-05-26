import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-bold transition-all duration-300 transform active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 gap-2",
          {
            "bg-primary hover:bg-on-primary-fixed-variant text-on-primary": variant === "primary",
            "bg-surface text-primary border border-outline-variant/50 hover:bg-surface-container-low": variant === "secondary",
            "hover:bg-surface-container-low text-on-surface": variant === "ghost",
            "bg-error hover:bg-error/90 text-on-error": variant === "danger",
            "h-14 px-6 py-4 text-[15px]": size === "default",
            "h-10 px-4 text-sm": size === "sm",
            "h-16 px-8 text-lg": size === "lg",
            "h-12 w-12": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
