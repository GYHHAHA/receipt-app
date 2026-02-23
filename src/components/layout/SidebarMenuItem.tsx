import { useState } from "react";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import type { LucideIcon } from "lucide-react";

export interface MenuChild {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface SidebarMenuItemProps {
  label: string;
  icon: LucideIcon;
  children?: MenuChild[];
  path?: string;
}

export default function SidebarMenuItem({
  label,
  icon: Icon,
  children,
  path,
}: SidebarMenuItemProps) {
  const { collapsed } = useSidebar();
  const matchRoute = useMatchRoute();
  const hasChildren = children && children.length > 0;

  const isGroupActive = hasChildren
    ? children.some((child) => matchRoute({ to: child.path, fuzzy: true }))
    : path
      ? !!matchRoute({ to: path, fuzzy: true })
      : false;

  const [open, setOpen] = useState(isGroupActive);

  if (!hasChildren && path) {
    const isActive = !!matchRoute({ to: path, fuzzy: true });
    return (
      <Link
        to={path}
        className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-primary to-primary-hover text-white shadow-lg shadow-primary/25"
            : "text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active"
        } ${collapsed ? "justify-center px-2" : ""}`}
        title={collapsed ? label : undefined}
      >
        <Icon size={20} className="shrink-0" />
        {!collapsed && <span className="truncate">{label}</span>}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
          collapsed ? "justify-center px-2" : ""
        } ${
          isGroupActive
            ? "text-primary"
            : "text-sidebar-group hover:text-sidebar-text-active"
        }`}
        title={collapsed ? label : undefined}
      >
        <Icon size={18} className="shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 text-left truncate">{label}</span>
            <ChevronDown
              size={14}
              className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </>
        )}
      </button>

      {!collapsed && open && hasChildren && (
        <div className="mt-1 ml-4 space-y-0.5 pl-4">
          {children.map((child) => {
            const isChildActive = !!matchRoute({
              to: child.path,
              fuzzy: true,
            });
            return (
              <Link
                key={child.path}
                to={child.path}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                  isChildActive
                    ? "bg-gradient-to-r from-primary to-primary-hover text-white shadow-lg shadow-primary/25"
                    : "text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active"
                }`}
              >
                <child.icon size={18} className="shrink-0" />
                <span className="truncate">{child.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
