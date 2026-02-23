import { useTranslation } from "react-i18next";
import { useSidebar } from "@/contexts/SidebarContext";
import {
  Receipt,
  FileText,
  BarChart3,
  Download,
  User,
  Building2,
  Activity,
  CreditCard,
  Mail,
  LayoutDashboard,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import SidebarMenuItem from "./SidebarMenuItem";

export default function Sidebar() {
  const { t } = useTranslation();
  const { collapsed, toggleSidebar } = useSidebar();

  return (
    <aside
      className={`relative z-10 flex h-screen flex-col bg-sidebar-bg transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
      style={{ boxShadow: "var(--sidebar-shadow)" }}
    >
      {/* Logo + Collapse */}
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && (
          <img
            src="https://dashboard.receiptcanada.com/assets/images/datamond-with-text_logo.png"
            alt="Logo"
            className="h-8 object-contain brightness-0 opacity-70 dark:invert dark:opacity-90"
          />
        )}
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center rounded-lg p-1.5 text-sidebar-text transition-colors hover:bg-sidebar-hover hover:text-sidebar-text-active"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen size={20} />
          ) : (
            <PanelLeftClose size={20} />
          )}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          <SidebarMenuItem
            label={t("sidebar.dataPanel")}
            icon={LayoutDashboard}
            children={[
              {
                label: t("sidebar.receipt"),
                path: "/data-panel/receipt",
                icon: Receipt,
              },
              {
                label: t("sidebar.invoice"),
                path: "/data-panel/invoice",
                icon: FileText,
              },
              {
                label: t("sidebar.analytics"),
                path: "/data-panel/analytics",
                icon: BarChart3,
              },
              {
                label: t("sidebar.fileExport"),
                path: "/data-panel/file-export",
                icon: Download,
              },
            ]}
          />

          <div className="pt-2">
            <SidebarMenuItem
              label={t("sidebar.userCenter")}
              icon={Users}
              children={[
                {
                  label: t("sidebar.userProfile"),
                  path: "/user-center/user-profile",
                  icon: User,
                },
                {
                  label: t("sidebar.company"),
                  path: "/user-center/company",
                  icon: Building2,
                },
                {
                  label: t("sidebar.activity"),
                  path: "/user-center/activity",
                  icon: Activity,
                },
                {
                  label: t("sidebar.subscription"),
                  path: "/user-center/subscription",
                  icon: CreditCard,
                },
              ]}
            />
          </div>

          <div className="pt-2">
            <SidebarMenuItem
              label={t("sidebar.contactUs")}
              icon={Mail}
              path="/contact-us"
            />
          </div>
        </div>
      </nav>
    </aside>
  );
}
