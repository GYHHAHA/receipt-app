import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Activity,
  Search,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ActivityRecord {
  id: number;
  email: string;
  comment: string;
  createTime: string;
}

const demoRecords: ActivityRecord[] = [];

const inputClass =
  "w-full rounded-xl border border-card-border bg-content-bg px-4 py-2.5 text-sm text-content-text placeholder-sidebar-text focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all";

const PAGE_SIZE_OPTIONS = [25, 50, 100];

export default function ActivityPage() {
  const { t } = useTranslation();

  const today = new Date().toISOString().slice(0, 10);
  const [searchQuery, setSearchQuery] = useState("");
  const [afterDate, setAfterDate] = useState(today);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRecords = useMemo(() => {
    let results = demoRecords;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (r) =>
          r.email.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q)
      );
    }
    if (afterDate) {
      results = results.filter((r) => r.createTime >= afterDate);
    }
    return results;
  }, [searchQuery, afterDate]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns: { key: string; width: string }[] = [
    { key: "colIndex", width: "w-14" },
    { key: "colEmail", width: "w-auto" },
    { key: "colComment", width: "w-auto min-w-[200px]" },
    { key: "colCreateTime", width: "w-auto" },
    { key: "colAction", width: "w-28" },
  ];

  return (
    <div className="min-h-full p-6 md:p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-content-text">
              {t("activity.pageTitle")}
            </h1>
            <p className="text-sidebar-text text-sm">
              {t("activity.pageSubtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 pb-4 flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sidebar-text pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={t("activity.searchPlaceholder")}
              className={`${inputClass} pl-10`}
            />
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-sidebar-text whitespace-nowrap">
              {t("activity.afterCreateDate")}
            </span>
            <input
              type="date"
              value={afterDate}
              onChange={(e) => {
                setAfterDate(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-xl border border-card-border bg-content-bg px-3 py-2 text-sm text-content-text focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="px-6 pb-2 overflow-x-auto">
          <div className="rounded-xl border border-card-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-content-bg">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`${col.width} px-4 py-3 text-left text-xs font-semibold text-sidebar-text uppercase tracking-wider`}
                    >
                      {t(`activity.${col.key}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {paginatedRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-12 text-center text-sidebar-text text-sm"
                    >
                      {t("activity.noRecords")}
                    </td>
                  </tr>
                ) : (
                  paginatedRecords.map((record, idx) => (
                    <tr
                      key={record.id}
                      className="hover:bg-sidebar-hover/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-content-text">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td className="px-4 py-3 text-content-text">
                        {record.email}
                      </td>
                      <td className="px-4 py-3 text-content-text truncate max-w-[300px]">
                        {record.comment}
                      </td>
                      <td className="px-4 py-3 text-content-text">
                        {record.createTime}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button className="w-7 h-7 rounded-lg flex items-center justify-center text-primary hover:bg-primary/10 transition-colors cursor-pointer">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="px-6 pb-6 pt-3 flex items-center justify-end gap-4 text-sm text-sidebar-text">
          <div className="flex items-center gap-2">
            <span>{t("activity.itemsPerPage")}</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-lg border border-card-border bg-content-bg px-2 py-1 text-sm text-content-text appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <span className="text-content-text">
            {filteredRecords.length === 0
              ? `0 ${t("activity.of")} 0`
              : `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredRecords.length)} ${t("activity.of")} ${filteredRecords.length}`}
          </span>

          <div className="flex items-center gap-1">
            <PagBtn
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </PagBtn>
            <PagBtn
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </PagBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function PagBtn({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-8 h-8 rounded-lg flex items-center justify-center border border-card-border text-sidebar-text hover:bg-sidebar-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
    >
      {children}
    </button>
  );
}
