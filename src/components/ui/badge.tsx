import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "danger" | "purple" | "outline";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-[#1f2433] text-gray-200 border-[#2b3247]",
    secondary: "bg-[#171a26] text-gray-400 border-transparent",
    success: "bg-emerald-950/60 text-emerald-400 border-emerald-800/40",
    warning: "bg-amber-950/60 text-amber-400 border-amber-800/40",
    danger: "bg-rose-950/60 text-rose-400 border-rose-800/40",
    purple: "bg-purple-950/60 text-purple-300 border-purple-800/40",
    outline: "text-gray-300 border-[#2b3247]",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
