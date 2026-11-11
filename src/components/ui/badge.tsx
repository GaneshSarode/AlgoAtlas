import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "danger" | "purple" | "outline" | "brand" | "accent";
  dot?: boolean;
}

export function Badge({
  className,
  variant = "default",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-surface-raised text-foreground border-border-default",
    secondary: "bg-surface-overlay text-neutral-400 border-border-subtle",
    accent: "bg-accent-muted text-accent border-accent-border",
    brand: "bg-accent-muted text-accent border-accent-border",
    purple: "bg-surface-raised text-neutral-300 border-border-default",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
    warning: "bg-amber-500/10 text-amber-300 border-amber-500/25",
    danger: "bg-rose-500/10 text-rose-400 border-rose-500/25",
    outline: "text-neutral-400 border-border-default bg-transparent",
  };

  const dotStyles = {
    default: "bg-neutral-400",
    secondary: "bg-neutral-500",
    accent: "bg-accent shadow-[0_0_6px_rgba(59,130,246,0.6)]",
    brand: "bg-accent shadow-[0_0_6px_rgba(59,130,246,0.6)]",
    purple: "bg-neutral-400",
    success: "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]",
    warning: "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]",
    danger: "bg-rose-400 shadow-[0_0_6px_rgba(248,113,113,0.6)]",
    outline: "bg-neutral-400",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-wide transition-colors select-none",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotStyles[variant])} />
      )}
      <span>{children}</span>
    </div>
  );
}
