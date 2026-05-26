import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, suffix, ...props }, ref) => {
    return (
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant pointer-events-none group-focus-within:text-primary transition-colors">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "w-full bg-surface py-3.5 rounded-xl border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-on-surface placeholder:text-outline/70 font-medium",
            icon ? "pl-11" : "pl-4",
            suffix ? "pr-12" : "pr-4",
            className
          )}
          ref={ref}
          {...props}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            {suffix}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
