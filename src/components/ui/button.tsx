import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success" | "accent";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-40 disabled:pointer-events-none select-none active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-foreground text-background hover:opacity-90 font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] border border-transparent",
      secondary:
        "bg-surface-raised hover:bg-surface-hover text-foreground border border-border-default shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
      outline:
        "border border-border-default text-foreground hover:bg-surface-hover hover:border-border-strong",
      accent:
        "bg-accent hover:bg-accent-hover text-white font-semibold shadow-sm border border-transparent",
      ghost:
        "text-neutral-400 hover:text-foreground hover:bg-surface-hover",
      danger:
        "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-sm",
      success:
        "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm",
    };

    const sizeStyles = {
      sm: "h-7 px-2.5 text-xs gap-1.5 rounded-md",
      md: "h-8.5 px-3.5 text-xs gap-2 rounded-lg",
      lg: "h-10 px-5 text-sm gap-2.5 rounded-lg",
      icon: "h-8 w-8 p-0 rounded-md",
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
