import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon?: React.ReactNode;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, icon, children, ...props }, ref) => {
    return (
      <div className="relative group w-full">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant pointer-events-none group-focus-within:text-primary transition-colors">
            {icon}
          </div>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full bg-surface py-3.5 rounded-xl border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-on-surface font-medium appearance-none",
            icon ? "pl-11 pr-10" : "pl-4 pr-10",
            className
          )}
          {...props}
        >
          {children}
        </select>
        {/* Seta do Dropdown */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-on-surface-variant">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.41 0.589966L6 5.16997L10.59 0.589966L12 1.99997L6 7.99997L0 1.99997L1.41 0.589966Z" fill="currentColor"/>
          </svg>
        </div>
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
