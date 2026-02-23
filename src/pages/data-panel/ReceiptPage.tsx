import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Receipt,
  Upload,
  RefreshCw,
  Layers,
  FileDown,
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface ReceiptRecord {
  id: number;
  receiptTime: string;
  erpVendorName: string;
  receiptNo: string;
  subtotal: number;
  gstHst: number;
  pstQst: number;
  tax: number;
  total: number;
  status: string;
  payment: string;
  erpChartOfAcct: string;
}

const demoReceipts: ReceiptRecord[] = [];

const inputClass =
  "w-full rounded-xl border border-card-border bg-content-bg px-4 py-2.5 text-sm text-content-text placeholder-sidebar-text focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all";

const PAGE_SIZE_OPTIONS = [20, 50, 100];

export default function ReceiptPage() {
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("2025-11-23");
  const [endDate, setEndDate] = useState("2026-02-23");
  const [filterPending, setFilterPending] = useState(true);
  const [filterVerified, setFilterVerified] = useState(true);
  const [filterExported, setFilterExported] = useState(false);
  const [filterBeforeStart, setFilterBeforeStart] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredReceipts = useMemo(() => {
    let results = demoReceipts;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (r) =>
          r.erpVendorName.toLowerCase().includes(q) ||
          r.receiptNo.toLowerCase().includes(q) ||
          r.payment.toLowerCase().includes(q)
      );
    }
    return results;
  }, [searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReceipts.length / pageSize)
  );
  const paginatedReceipts = filteredReceipts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const allSelected =
    paginatedReceipts.length > 0 &&
    paginatedReceipts.every((r) => selectedIds.has(r.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      const next = new Set(selectedIds);
      paginatedReceipts.forEach((r) => next.delete(r.id));
      setSelectedIds(next);
    } else {
      const next = new Set(selectedIds);
      paginatedReceipts.forEach((r) => next.add(r.id));
      setSelectedIds(next);
    }
  };

  const toggleSelect = (id: number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const subtotalSum = filteredReceipts.reduce((s, r) => s + r.subtotal, 0);
  const taxSum = filteredReceipts.reduce((s, r) => s + r.tax, 0);
  const totalSum = filteredReceipts.reduce((s, r) => s + r.total, 0);

  const summaryItems = [
    { label: t("receipt.subtotalAmount"), value: `$${subtotalSum.toFixed(2)}` },
    { label: t("receipt.taxAmount"), value: `$${taxSum.toFixed(2)}` },
    { label: t("receipt.totalAmount"), value: `$${totalSum.toFixed(2)}` },
    { label: t("receipt.totalSelected"), value: String(selectedIds.size) },
    { label: t("receipt.chartOfAcctCount"), value: "0" },
  ];

  const columns = [
    { key: "colSelect", width: "w-10" },
    { key: "colIndex", width: "w-12" },
    { key: "colReceiptTime", width: "w-auto" },
    { key: "colErpVendor", width: "w-auto" },
    { key: "colReceiptNo", width: "w-auto" },
    { key: "colSubtotal", width: "w-auto" },
    { key: "colGstHst", width: "w-auto" },
    { key: "colPstQst", width: "w-auto" },
    { key: "colTax", width: "w-auto" },
    { key: "colTotal", width: "w-auto" },
    { key: "colStatus", width: "w-auto" },
    { key: "colPayment", width: "w-auto" },
    { key: "colErpChart", width: "w-auto" },
  ];

  const actionButtons = [
    {
      label: t("receipt.uploadReceipts"),
      icon: Upload,
      style: "text-white bg-rose-500 hover:bg-rose-600",
    },
    {
      label: t("receipt.changeStatus"),
      icon: RefreshCw,
      style: "text-white bg-emerald-500 hover:bg-emerald-600",
    },
    {
      label: t("receipt.batchAssign"),
      icon: Layers,
      style: "text-white bg-primary hover:bg-primary-hover",
    },
    {
      label: t("receipt.exportCsv"),
      icon: FileDown,
      style: "text-white bg-indigo-500 hover:bg-indigo-600",
    },
    {
      label: t("receipt.exportTax"),
      icon: FileText,
      style: "text-white bg-slate-600 hover:bg-slate-700",
    },
  ];

  const filterChecks = [
    {
      label: t("receipt.filterPending"),
      checked: filterPending,
      onChange: setFilterPending,
      color: "accent-amber-500",
    },
    {
      label: t("receipt.filterVerified"),
      checked: filterVerified,
      onChange: setFilterVerified,
      color: "accent-emerald-500",
    },
    {
      label: t("receipt.filterExported"),
      checked: filterExported,
      onChange: setFilterExported,
      color: "accent-blue-500",
    },
    {
      label: t("receipt.filterBeforeStart"),
      checked: filterBeforeStart,
      onChange: setFilterBeforeStart,
      color: "accent-slate-500",
    },
  ];

  return (
    <div className="min-h-full p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Receipt className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-content-text">
              {t("receipt.pageTitle")}
            </h1>
            <p className="text-sidebar-text text-sm">
              {t("receipt.pageSubtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-5">
        {actionButtons.map((btn) => (
          <button
            key={btn.label}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${btn.style}`}
          >
            <btn.icon className="w-4 h-4" />
            {btn.label}
          </button>
        ))}
      </div>

      {/* Filters Card */}
      <div className="bg-card-bg border border-card-border rounded-2xl p-5 mb-5">
        {/* Search + Date Range */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sidebar-text pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={t("receipt.searchPlaceholder")}
              className={`${inputClass} pl-10`}
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-sidebar-text whitespace-nowrap">
                {t("receipt.startDate")}
              </span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-xl border border-card-border bg-content-bg px-3 py-2 text-sm text-content-text focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-sidebar-text whitespace-nowrap">
                {t("receipt.endDate")}
              </span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-xl border border-card-border bg-content-bg px-3 py-2 text-sm text-content-text focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Filter Checkboxes */}
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {filterChecks.map((fc) => (
            <label
              key={fc.label}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={fc.checked}
                onChange={(e) => fc.onChange(e.target.checked)}
                className={`w-4 h-4 rounded border-card-border ${fc.color} cursor-pointer`}
              />
              <span className="text-sm text-content-text group-hover:text-primary transition-colors">
                {fc.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        {summaryItems.map((item) => (
          <div
            key={item.label}
            className="bg-card-bg border border-card-border rounded-xl px-4 py-3"
          >
            <p className="text-xs text-sidebar-text mb-1">{item.label}</p>
            <p className="text-lg font-semibold text-content-text">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-content-bg">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`${col.width} px-3 py-3 text-left text-xs font-semibold text-sidebar-text uppercase tracking-wider whitespace-nowrap`}
                  >
                    {col.key === "colSelect" ? (
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-card-border accent-primary cursor-pointer"
                      />
                    ) : (
                      t(`receipt.${col.key}`)
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {paginatedReceipts.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-12 text-center text-sidebar-text text-sm"
                  >
                    {t("receipt.noRecords")}
                  </td>
                </tr>
              ) : (
                paginatedReceipts.map((record, idx) => (
                  <tr
                    key={record.id}
                    className={`transition-colors ${selectedIds.has(record.id) ? "bg-primary/5" : "hover:bg-sidebar-hover/50"}`}
                  >
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(record.id)}
                        onChange={() => toggleSelect(record.id)}
                        className="w-4 h-4 rounded border-card-border accent-primary cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-3 text-content-text">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="px-3 py-3 text-content-text whitespace-nowrap">
                      {record.receiptTime}
                    </td>
                    <td className="px-3 py-3 text-content-text">
                      {record.erpVendorName}
                    </td>
                    <td className="px-3 py-3 text-content-text">
                      {record.receiptNo}
                    </td>
                    <td className="px-3 py-3 text-content-text text-right">
                      ${record.subtotal.toFixed(2)}
                    </td>
                    <td className="px-3 py-3 text-content-text text-right">
                      ${record.gstHst.toFixed(2)}
                    </td>
                    <td className="px-3 py-3 text-content-text text-right">
                      ${record.pstQst.toFixed(2)}
                    </td>
                    <td className="px-3 py-3 text-content-text text-right">
                      ${record.tax.toFixed(2)}
                    </td>
                    <td className="px-3 py-3 text-content-text text-right font-medium">
                      ${record.total.toFixed(2)}
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={record.status} />
                    </td>
                    <td className="px-3 py-3 text-content-text">
                      {record.payment}
                    </td>
                    <td className="px-3 py-3 text-content-text">
                      {record.erpChartOfAcct}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-4 border-t border-card-border flex items-center justify-end gap-4 text-sm text-sidebar-text">
          <div className="flex items-center gap-2">
            <span>{t("receipt.itemsPerPage")}</span>
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
            {filteredReceipts.length === 0
              ? `0 ${t("receipt.of")} 0`
              : `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredReceipts.length)} ${t("receipt.of")} ${filteredReceipts.length}`}
          </span>

          <div className="flex items-center gap-1">
            <PagBtn
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="w-4 h-4" />
            </PagBtn>
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
            <PagBtn
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="w-4 h-4" />
            </PagBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-400/15 text-amber-600",
    verified: "bg-emerald-400/15 text-emerald-600",
    exported: "bg-blue-400/15 text-blue-600",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status.toLowerCase()] ?? "bg-gray-400/15 text-gray-500"}`}
    >
      {status}
    </span>
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
