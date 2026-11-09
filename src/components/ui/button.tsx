import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:opacity-40 disabled:pointer-events-none select-none active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-white hover:bg-zinc-200 text-zinc-950 font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.6)] border border-transparent",
      secondary:
        "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
      outline:
        "border border-white/[0.1] text-zinc-300 hover:bg-white/[0.04] hover:text-white hover:border-white/[0.18]",
      ghost:
        "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05]",
      danger:
        "bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 shadow-sm",
      success:
        "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 shadow-sm",
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
