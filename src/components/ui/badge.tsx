import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "danger" | "purple" | "outline" | "brand";
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
    default: "bg-zinc-850 text-zinc-300 border-white/[0.08]",
    secondary: "bg-zinc-900/60 text-zinc-400 border-white/[0.04]",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    purple: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    brand: "bg-brand-500/10 text-brand-300 border-brand-500/25",
    outline: "text-zinc-400 border-white/[0.1] bg-transparent",
  };

  const dotStyles = {
    default: "bg-zinc-400",
    secondary: "bg-zinc-500",
    success: "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]",
    warning: "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]",
    danger: "bg-rose-400 shadow-[0_0_6px_rgba(248,113,113,0.6)]",
    purple: "bg-indigo-400 shadow-[0_0_6px_rgba(129,140,248,0.6)]",
    brand: "bg-brand-400 shadow-[0_0_6px_rgba(129,140,248,0.6)]",
    outline: "bg-zinc-400",
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
