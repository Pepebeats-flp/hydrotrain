"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Cpu,
  Activity,
  History,
  Bell,
  FileText,
  Settings2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Train,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useSidebarStore } from "@/store/sidebar.store";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Cpu, label: "Digital Twin", href: "/digital-twin" },
  { icon: Activity, label: "Monitoring", href: "/monitoring" },
  { icon: History, label: "History", href: "/history" },
  { icon: Bell, label: "Alarms", href: "/alarms" },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: SlidersHorizontal, label: "Simulation", href: "/simulation" },
  { icon: Settings2, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebarStore();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      className={cn(
        "flex flex-col border-r border-[var(--color-sidebar-border)] bg-[var(--color-sidebar)] h-screen overflow-hidden flex-shrink-0 z-50",
      )}
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-[var(--color-sidebar-border)]">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--color-primary-muted)]">
          <Train className="w-5 h-5 text-primary" />
        </div>
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="text-sm font-semibold text-foreground whitespace-nowrap overflow-hidden"
            >
              HydroTrain
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-thin">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer",
                  isActive
                    ? "bg-[var(--color-sidebar-active)] text-primary"
                    : "text-[var(--color-muted)] hover:bg-[var(--color-sidebar-hover)] hover:text-foreground",
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-[var(--color-sidebar-border)]">
        <button
          onClick={toggle}
          className="flex items-center justify-center w-full py-2 rounded-lg text-[var(--color-muted)] hover:bg-[var(--color-sidebar-hover)] hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
}
