import { useState, useRef, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Languages,
  Sun,
  Moon,
  Search,
  Receipt,
  FileText,
  BarChart3,
  Download,
  User,
  Building2,
  Activity,
  CreditCard,
  Mail,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
] as const;

interface SearchItem {
  labelKey: string;
  path: string;
  icon: LucideIcon;
  group: string;
}

const SEARCH_ITEMS: SearchItem[] = [
  { labelKey: "sidebar.receipt", path: "/data-panel/receipt", icon: Receipt, group: "sidebar.dataPanel" },
  { labelKey: "sidebar.invoice", path: "/data-panel/invoice", icon: FileText, group: "sidebar.dataPanel" },
  { labelKey: "sidebar.analytics", path: "/data-panel/analytics", icon: BarChart3, group: "sidebar.dataPanel" },
  { labelKey: "sidebar.fileExport", path: "/data-panel/file-export", icon: Download, group: "sidebar.dataPanel" },
  { labelKey: "sidebar.userProfile", path: "/user-center/user-profile", icon: User, group: "sidebar.userCenter" },
  { labelKey: "sidebar.company", path: "/user-center/company", icon: Building2, group: "sidebar.userCenter" },
  { labelKey: "sidebar.activity", path: "/user-center/activity", icon: Activity, group: "sidebar.userCenter" },
  { labelKey: "sidebar.subscription", path: "/user-center/subscription", icon: CreditCard, group: "sidebar.userCenter" },
  { labelKey: "sidebar.contactUs", path: "/contact-us", icon: Mail, group: "" },
];

export default function TopNav() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [langOpen, setLangOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return SEARCH_ITEMS.filter((item) => {
      const label = t(item.labelKey).toLowerCase();
      const group = item.group ? t(item.group).toLowerCase() : "";
      return label.includes(q) || group.includes(q) || item.path.includes(q);
    });
  }, [searchQuery, t]);

  const showDropdown = searchFocused && searchQuery.trim().length > 0;

  const currentLang =
    LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  return (
    <header className="flex h-16 items-center justify-between bg-topnav-bg px-6">
      {/* Search */}
      <div ref={searchRef} className="relative w-72">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-topnav-icon"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            placeholder={t("topnav.searchPlaceholder")}
            className="w-full rounded-xl bg-search-bg py-2 pl-9 pr-4 text-sm text-topnav-text placeholder-topnav-icon outline-none transition-all focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {showDropdown && (
          <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-dropdown-border bg-dropdown-bg shadow-xl shadow-black/10">
            {filteredItems.length === 0 ? (
              <div className="px-4 py-3 text-center text-sm text-topnav-icon">
                No results
              </div>
            ) : (
              filteredItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate({ to: item.path });
                      setSearchQuery("");
                      setSearchFocused(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-dropdown-text transition-colors hover:bg-dropdown-hover"
                  >
                    <Icon size={16} className="shrink-0 text-primary" />
                    <span>{t(item.labelKey)}</span>
                    {item.group && (
                      <span className="ml-auto text-xs text-topnav-icon">
                        {t(item.group)}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Language Switcher */}
        <div ref={langRef} className="relative">
          <button
            onClick={() => setLangOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-lg p-2 text-topnav-icon transition-colors hover:bg-sidebar-hover hover:text-topnav-icon-hover"
            title={currentLang.label}
          >
            <Languages size={20} />
          </button>

          {langOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-dropdown-border bg-dropdown-bg shadow-xl shadow-black/10">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    i18n.changeLanguage(lang.code);
                    setLangOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    i18n.language === lang.code
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-dropdown-text hover:bg-dropdown-hover"
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center rounded-lg p-2 text-topnav-icon transition-colors hover:bg-sidebar-hover hover:text-topnav-icon-hover"
          title={theme === "dark" ? "Light mode" : "Dark mode"}
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Avatar */}
        <div className="ml-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-hover text-sm font-bold text-white shadow-md">
            U
          </div>
        </div>
      </div>
    </header>
  );
}
