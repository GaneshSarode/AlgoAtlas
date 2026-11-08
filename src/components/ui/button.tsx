import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:opacity-50 disabled:pointer-events-none select-none";

    const variantStyles = {
      primary: "bg-brand-600 hover:bg-brand-500 text-white shadow-sm shadow-brand-600/30",
      secondary: "bg-[#1c202d] hover:bg-[#252b3d] text-gray-200 border border-[#2d3345]",
      outline: "border border-[#2a2f42] text-gray-300 hover:bg-[#1a1d28] hover:text-white",
      ghost: "text-gray-400 hover:text-white hover:bg-[#181b26]",
      danger: "bg-danger-600 hover:bg-danger-500 text-white shadow-sm shadow-danger-600/20",
      success: "bg-success-600 hover:bg-success-500 text-white shadow-sm shadow-success-600/20",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-9 px-4 text-sm gap-2",
      lg: "h-11 px-6 text-base gap-2.5",
      icon: "h-9 w-9 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
