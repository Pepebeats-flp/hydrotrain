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
  X,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useSidebarStore } from "@/store/sidebar.store";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Cpu, label: "Gemelo Digital", href: "/digital-twin" },
  { icon: Activity, label: "Monitoreo", href: "/monitoring" },
  { icon: History, label: "Historial", href: "/history" },
  { icon: Bell, label: "Alertas", href: "/alarms" },
  { icon: FileText, label: "Reportes", href: "/reports" },
  { icon: SlidersHorizontal, label: "Simulación", href: "/simulation" },
  { icon: Settings2, label: "Configuración", href: "/settings" },
];

function SidebarNav({ collapsed, closeable }: { collapsed?: boolean; closeable?: boolean }) {
  const pathname = usePathname();
  const closeMobile = useSidebarStore((s) => s.closeMobile);

  return (
    <>
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-thin">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} onClick={closeable ? closeMobile : undefined}>
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
                {(!collapsed || closeable) && (
                  <span className="text-sm whitespace-nowrap">{item.label}</span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export function Sidebar() {
  const { collapsed, toggle, mobileOpen, closeMobile } = useSidebarStore();

  return (
    <>
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        className={cn(
          "hidden md:flex flex-col border-r border-[var(--color-sidebar-border)] bg-[var(--color-sidebar)] h-screen overflow-hidden flex-shrink-0 z-50",
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

        <SidebarNav collapsed={collapsed} />

        <div className="p-2 border-t border-[var(--color-sidebar-border)]">
          <button
            onClick={toggle}
            className="flex items-center justify-center w-full py-2 rounded-lg text-[var(--color-muted)] hover:bg-[var(--color-sidebar-hover)] hover:text-foreground transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              onClick={closeMobile}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 h-screen w-72 flex flex-col border-r border-[var(--color-sidebar-border)] bg-[var(--color-sidebar)] md:hidden"
            >
              <div className="flex items-center justify-between px-4 h-16 border-b border-[var(--color-sidebar-border)]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--color-primary-muted)]">
                    <Train className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">HydroTrain</span>
                </div>
                <button onClick={closeMobile} className="text-[var(--color-muted)] hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <SidebarNav closeable />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
