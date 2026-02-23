import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  FileText,
  Upload,
  Download,
  RefreshCw,
  Plus,
  Search,
  Pencil,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface InvoiceRecord {
  id: number;
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  customer: string;
  poNo: string;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  hasPdf: boolean;
}

const demoInvoices: InvoiceRecord[] = [];

const inputClass =
  "w-full rounded-xl border border-card-border bg-content-bg px-4 py-2.5 text-sm text-content-text placeholder-sidebar-text focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all";

const PAGE_SIZE_OPTIONS = [24, 50, 100];

export default function InvoicePage() {
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("2025-08-26");
  const [endDate, setEndDate] = useState("2026-02-22");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [pageSize, setPageSize] = useState(24);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredInvoices = useMemo(() => {
    if (!searchQuery.trim()) return demoInvoices;
    const q = searchQuery.toLowerCase();
    return demoInvoices.filter(
      (r) =>
        r.invoiceNo.toLowerCase().includes(q) ||
        r.customer.toLowerCase().includes(q) ||
        r.poNo.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInvoices.length / pageSize)
  );
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const allSelected =
    paginatedInvoices.length > 0 &&
    paginatedInvoices.every((r) => selectedIds.has(r.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      const next = new Set(selectedIds);
      paginatedInvoices.forEach((r) => next.delete(r.id));
      setSelectedIds(next);
    } else {
      const next = new Set(selectedIds);
      paginatedInvoices.forEach((r) => next.add(r.id));
      setSelectedIds(next);
    }
  };

  const toggleSelect = (id: number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const actionButtons = [
    {
      label: t("invoice.uploadInvoice"),
      icon: Upload,
      style: "text-white bg-primary hover:bg-primary-hover",
    },
    {
      label: t("invoice.downloadTemplate"),
      icon: Download,
      style: "text-white bg-indigo-500 hover:bg-indigo-600",
    },
    {
      label: t("invoice.changeStatus"),
      icon: RefreshCw,
      style: "text-white bg-rose-500 hover:bg-rose-600",
    },
  ];

  const columns = [
    { key: "colSelect", width: "w-10" },
    { key: "colIndex", width: "w-12" },
    { key: "colEdit", width: "w-14" },
    { key: "colInvoicePdf", width: "w-24" },
    { key: "colInvoiceNo", width: "w-auto" },
    { key: "colInvoiceDate", width: "w-auto" },
    { key: "colDueDate", width: "w-auto" },
    { key: "colCustomer", width: "w-auto" },
    { key: "colPoNo", width: "w-auto" },
    { key: "colSubtotal", width: "w-auto" },
    { key: "colTax", width: "w-auto" },
    { key: "colTotal", width: "w-auto" },
    { key: "colStatus", width: "w-auto" },
  ];

  return (
    <div className="min-h-full p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-content-text">
              {t("invoice.pageTitle")}
            </h1>
            <p className="text-sidebar-text text-sm">
              {t("invoice.pageSubtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
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
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          {/* Add New Invoice */}
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-colors cursor-pointer">
            <Plus className="w-4 h-4" />
            {t("invoice.addNewInvoice")}
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sidebar-text pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={t("invoice.searchPlaceholder")}
              className={`${inputClass} pl-10`}
            />
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-sidebar-text whitespace-nowrap">
                {t("invoice.startDate")}
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
                {t("invoice.endDate")}
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
                      t(`invoice.${col.key}`)
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {paginatedInvoices.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-12 text-center text-sidebar-text text-sm"
                  >
                    {t("invoice.noRecords")}
                  </td>
                </tr>
              ) : (
                paginatedInvoices.map((record, idx) => (
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
                    <td className="px-3 py-3">
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center text-primary hover:bg-primary/10 transition-colors cursor-pointer">
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      {record.hasPdf ? (
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-indigo-500 hover:bg-indigo-500/10 transition-colors cursor-pointer">
                          <Eye className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-sidebar-text text-xs">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-content-text">
                      {record.invoiceNo}
                    </td>
                    <td className="px-3 py-3 text-content-text whitespace-nowrap">
                      {record.invoiceDate}
                    </td>
                    <td className="px-3 py-3 text-content-text whitespace-nowrap">
                      {record.dueDate}
                    </td>
                    <td className="px-3 py-3 text-content-text">
                      {record.customer}
                    </td>
                    <td className="px-3 py-3 text-content-text">
                      {record.poNo}
                    </td>
                    <td className="px-3 py-3 text-content-text text-right">
                      ${record.subtotal.toFixed(2)}
                    </td>
                    <td className="px-3 py-3 text-content-text text-right">
                      ${record.tax.toFixed(2)}
                    </td>
                    <td className="px-3 py-3 text-content-text text-right font-medium">
                      ${record.total.toFixed(2)}
                    </td>
                    <td className="px-3 py-3">
                      <InvoiceStatusBadge status={record.status} />
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
            <span>{t("invoice.itemsPerPage")}</span>
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
            {filteredInvoices.length === 0
              ? `0 ${t("invoice.of")} 0`
              : `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredInvoices.length)} ${t("invoice.of")} ${filteredInvoices.length}`}
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

function InvoiceStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: "bg-gray-400/15 text-gray-500",
    sent: "bg-blue-400/15 text-blue-600",
    paid: "bg-emerald-400/15 text-emerald-600",
    overdue: "bg-rose-400/15 text-rose-600",
    cancelled: "bg-amber-400/15 text-amber-600",
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
