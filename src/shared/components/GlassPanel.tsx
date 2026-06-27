"use client";

import { cn } from "@/shared/lib/utils";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassPanel({ children, className, hover = false, onClick }: GlassPanelProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "glass-card",
        hover && "glass-hover",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
}
