import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  FolderDown,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface FileRecord {
  id: number;
  receiptTime: string;
  vendorName: string;
  receiptNo: string;
  subtotal: number;
  tax: number;
  total: number;
  payMethod: string;
  chartOfAcct: string;
}

const demoFiles: FileRecord[] = [];

const inputClass =
  "w-full rounded-xl border border-card-border bg-content-bg px-4 py-2.5 text-sm text-content-text placeholder-sidebar-text focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all";

const PAGE_SIZE_OPTIONS = [20, 50, 100];

export default function FileExportPage() {
  const { t } = useTranslation();

  const [startDate, setStartDate] = useState("2025-11-23");
  const [endDate, setEndDate] = useState("2026-02-23");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return demoFiles;
    const q = searchQuery.toLowerCase();
    return demoFiles.filter(
      (r) =>
        r.vendorName.toLowerCase().includes(q) ||
        r.receiptNo.toLowerCase().includes(q) ||
        r.payMethod.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredFiles.length / pageSize));
  const paginatedFiles = filteredFiles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    { key: "colIndex", width: "w-12" },
    { key: "colReceiptTime", width: "w-auto" },
    { key: "colVendorName", width: "w-auto" },
    { key: "colReceiptNo", width: "w-auto" },
    { key: "colSubtotal", width: "w-auto" },
    { key: "colTax", width: "w-auto" },
    { key: "colTotal", width: "w-auto" },
    { key: "colPayMethod", width: "w-auto" },
    { key: "colChartOfAcct", width: "w-auto" },
  ];

  return (
    <div className="min-h-full p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FolderDown className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-content-text">
              {t("fileExport.pageTitle")}
            </h1>
            <p className="text-sidebar-text text-sm">
              {t("fileExport.pageSubtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar Card */}
      <div className="bg-card-bg border border-card-border rounded-2xl p-5 mb-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          {/* Date Range */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-sidebar-text whitespace-nowrap">
                {t("fileExport.startDate")}
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
                {t("fileExport.endDate")}
              </span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-xl border border-card-border bg-content-bg px-3 py-2 text-sm text-content-text focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>
          </div>

          {/* View File Content */}
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary-hover transition-colors cursor-pointer">
            <Eye className="w-4 h-4" />
            {t("fileExport.viewFileContent")}
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
              placeholder={t("fileExport.searchPlaceholder")}
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
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
                      {t(`fileExport.${col.key}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {paginatedFiles.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-12 text-center text-sidebar-text text-sm"
                    >
                      {t("fileExport.noRecords")}
                    </td>
                  </tr>
                ) : (
                  paginatedFiles.map((record, idx) => (
                    <tr
                      key={record.id}
                      className="hover:bg-sidebar-hover/50 transition-colors"
                    >
                      <td className="px-3 py-3 text-content-text">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td className="px-3 py-3 text-content-text whitespace-nowrap">
                        {record.receiptTime}
                      </td>
                      <td className="px-3 py-3 text-content-text">
                        {record.vendorName}
                      </td>
                      <td className="px-3 py-3 text-content-text">
                        {record.receiptNo}
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
                      <td className="px-3 py-3 text-content-text">
                        {record.payMethod}
                      </td>
                      <td className="px-3 py-3 text-content-text">
                        {record.chartOfAcct}
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
              <span>{t("fileExport.itemsPerPage")}</span>
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
              {filteredFiles.length === 0
                ? `0 ${t("fileExport.of")} 0`
                : `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredFiles.length)} ${t("fileExport.of")} ${filteredFiles.length}`}
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
