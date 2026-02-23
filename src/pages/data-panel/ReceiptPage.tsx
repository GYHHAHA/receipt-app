import { useState, useMemo, useEffect, useRef, useCallback } from "react";
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
  ImagePlus,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { fetchAllReceipts, insertReceipt, updateReceiptFields, type ReceiptRow } from "@/lib/supabase";
import { analyzeReceiptImage } from "@/lib/gemini";

const inputClass =
  "w-full rounded-xl border border-card-border bg-content-bg px-4 py-2.5 text-sm text-content-text placeholder-sidebar-text focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export default function ReceiptPage() {
  const { t } = useTranslation();

  const [receipts, setReceipts] = useState<ReceiptRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("2025-11-23");
  const [endDate, setEndDate] = useState("2026-02-23");
  const [filterPending, setFilterPending] = useState(true);
  const [filterVerified, setFilterVerified] = useState(true);
  const [filterExported, setFilterExported] = useState(false);
  const [filterBeforeStart, setFilterBeforeStart] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [changeStatusModalOpen, setChangeStatusModalOpen] = useState(false);
  const [batchAssignModalOpen, setBatchAssignModalOpen] = useState(false);

  const loadReceipts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAllReceipts();
      setReceipts(data);
    } catch (err) {
      console.error("Failed to fetch receipts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReceipts();
  }, [loadReceipts]);

  const filteredReceipts = useMemo(() => {
    let results = receipts;

    const activeStatuses: string[] = [];
    if (filterPending) activeStatuses.push("pending");
    if (filterVerified) activeStatuses.push("verified");
    if (filterExported) activeStatuses.push("exported");
    if (activeStatuses.length > 0) {
      results = results.filter((r) => activeStatuses.includes(r.status));
    }

    if (!filterBeforeStart && startDate) {
      results = results.filter((r) => r.receipt_time >= startDate);
    }
    if (endDate) {
      results = results.filter(
        (r) => r.receipt_time <= endDate + "T23:59:59Z"
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (r) =>
          r.vendor_name.toLowerCase().includes(q) ||
          r.receipt_no.toLowerCase().includes(q) ||
          r.payment.toLowerCase().includes(q)
      );
    }
    return results;
  }, [receipts, searchQuery, startDate, endDate, filterPending, filterVerified, filterExported, filterBeforeStart]);

  const totalPages = Math.max(1, Math.ceil(filteredReceipts.length / pageSize));
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

  const subtotalSum = filteredReceipts.reduce((s, r) => s + Number(r.subtotal), 0);
  const taxSum = filteredReceipts.reduce((s, r) => s + Number(r.tax), 0);
  const totalSum = filteredReceipts.reduce((s, r) => s + Number(r.total), 0);

  const chartOfAcctSet = new Set(filteredReceipts.map((r) => r.chart_of_acct).filter(Boolean));

  const summaryItems = [
    { label: t("receipt.subtotalAmount"), value: `$${subtotalSum.toFixed(2)}` },
    { label: t("receipt.taxAmount"), value: `$${taxSum.toFixed(2)}` },
    { label: t("receipt.totalAmount"), value: `$${totalSum.toFixed(2)}` },
    { label: t("receipt.totalSelected"), value: String(selectedIds.size) },
    { label: t("receipt.chartOfAcctCount"), value: String(chartOfAcctSet.size) },
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

  const handleExportCsv = () => {
    if (filteredReceipts.length === 0) return;
    const headers = ["#","Receipt Time","Vendor Name","Receipt #","Subtotal","GST/HST","PST/QST","Tax","Total","Status","Payment","Chart of Acct"];
    const rows = filteredReceipts.map((r, i) => [
      i + 1,
      r.receipt_time,
      `"${r.vendor_name}"`,
      r.receipt_no,
      Number(r.subtotal).toFixed(2),
      Number(r.gst_hst).toFixed(2),
      Number(r.pst_qst).toFixed(2),
      Number(r.tax).toFixed(2),
      Number(r.total).toFixed(2),
      r.status,
      r.payment,
      `"${r.chart_of_acct}"`,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipts_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenChangeStatus = () => {
    if (selectedIds.size !== 1) {
      alert(t("receipt.singleSelectionRequired"));
      return;
    }
    setChangeStatusModalOpen(true);
  };

  const handleOpenBatchAssign = () => {
    if (selectedIds.size === 0) {
      alert(t("receipt.noSelection"));
      return;
    }
    setBatchAssignModalOpen(true);
  };

  const selectedReceipt = useMemo(() => {
    if (selectedIds.size !== 1) return null;
    const id = [...selectedIds][0];
    return receipts.find((r) => r.id === id) ?? null;
  }, [selectedIds, receipts]);

  const actionButtons = [
    {
      label: t("receipt.uploadReceipts"),
      icon: Upload,
      style: "text-white bg-rose-500 hover:bg-rose-600",
      onClick: () => setUploadModalOpen(true),
    },
    {
      label: t("receipt.changeStatus"),
      icon: RefreshCw,
      style: "text-white bg-emerald-500 hover:bg-emerald-600",
      onClick: handleOpenChangeStatus,
    },
    {
      label: t("receipt.batchAssign"),
      icon: Layers,
      style: "text-white bg-primary hover:bg-primary-hover",
      onClick: handleOpenBatchAssign,
    },
    {
      label: t("receipt.exportCsv"),
      icon: FileDown,
      style: "text-white bg-indigo-500 hover:bg-indigo-600",
      onClick: handleExportCsv,
    },
    {
      label: t("receipt.exportTax"),
      icon: FileText,
      style: "text-white bg-slate-600 hover:bg-slate-700",
    },
  ];

  const filterChecks = [
    { label: t("receipt.filterPending"), checked: filterPending, onChange: setFilterPending, color: "accent-amber-500" },
    { label: t("receipt.filterVerified"), checked: filterVerified, onChange: setFilterVerified, color: "accent-emerald-500" },
    { label: t("receipt.filterExported"), checked: filterExported, onChange: setFilterExported, color: "accent-blue-500" },
    { label: t("receipt.filterBeforeStart"), checked: filterBeforeStart, onChange: setFilterBeforeStart, color: "accent-slate-500" },
  ];

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

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
            onClick={btn.onClick}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${btn.style}`}
          >
            <btn.icon className="w-4 h-4" />
            {btn.label}
          </button>
        ))}
      </div>

      {/* Filters Card */}
      <div className="bg-card-bg border border-card-border rounded-2xl p-5 mb-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sidebar-text pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder={t("receipt.searchPlaceholder")}
              className={`${inputClass} pl-10`}
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-sidebar-text whitespace-nowrap">{t("receipt.startDate")}</span>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="rounded-xl border border-card-border bg-content-bg px-3 py-2 text-sm text-content-text focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-sidebar-text whitespace-nowrap">{t("receipt.endDate")}</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="rounded-xl border border-card-border bg-content-bg px-3 py-2 text-sm text-content-text focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {filterChecks.map((fc) => (
            <label key={fc.label} className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={fc.checked} onChange={(e) => fc.onChange(e.target.checked)}
                className={`w-4 h-4 rounded border-card-border ${fc.color} cursor-pointer`} />
              <span className="text-sm text-content-text group-hover:text-primary transition-colors">{fc.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        {summaryItems.map((item) => (
          <div key={item.label} className="bg-card-bg border border-card-border rounded-xl px-4 py-3">
            <p className="text-xs text-sidebar-text mb-1">{item.label}</p>
            <p className="text-lg font-semibold text-content-text">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-16">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <span className="text-sm text-sidebar-text">{t("receipt.loading")}</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-content-bg">
                    {columns.map((col) => (
                      <th key={col.key}
                        className={`${col.width} px-3 py-3 text-left text-xs font-semibold text-sidebar-text uppercase tracking-wider whitespace-nowrap`}>
                        {col.key === "colSelect" ? (
                          <input type="checkbox" checked={allSelected} onChange={toggleSelectAll}
                            className="w-4 h-4 rounded border-card-border accent-primary cursor-pointer" />
                        ) : t(`receipt.${col.key}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border">
                  {paginatedReceipts.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="px-4 py-12 text-center text-sidebar-text text-sm">
                        {t("receipt.noRecords")}
                      </td>
                    </tr>
                  ) : (
                    paginatedReceipts.map((record, idx) => (
                      <tr key={record.id}
                        className={`transition-colors ${selectedIds.has(record.id) ? "bg-primary/5" : "hover:bg-sidebar-hover/50"}`}>
                        <td className="px-3 py-3">
                          <input type="checkbox" checked={selectedIds.has(record.id)}
                            onChange={() => toggleSelect(record.id)}
                            className="w-4 h-4 rounded border-card-border accent-primary cursor-pointer" />
                        </td>
                        <td className="px-3 py-3 text-content-text">{(currentPage - 1) * pageSize + idx + 1}</td>
                        <td className="px-3 py-3 text-content-text whitespace-nowrap">{formatDate(record.receipt_time)}</td>
                        <td className="px-3 py-3 text-content-text">{record.vendor_name}</td>
                        <td className="px-3 py-3 text-content-text">{record.receipt_no}</td>
                        <td className="px-3 py-3 text-content-text text-right">${Number(record.subtotal).toFixed(2)}</td>
                        <td className="px-3 py-3 text-content-text text-right">${Number(record.gst_hst).toFixed(2)}</td>
                        <td className="px-3 py-3 text-content-text text-right">${Number(record.pst_qst).toFixed(2)}</td>
                        <td className="px-3 py-3 text-content-text text-right">${Number(record.tax).toFixed(2)}</td>
                        <td className="px-3 py-3 text-content-text text-right font-medium">${Number(record.total).toFixed(2)}</td>
                        <td className="px-3 py-3"><StatusBadge status={record.status} /></td>
                        <td className="px-3 py-3 text-content-text">{record.payment}</td>
                        <td className="px-3 py-3 text-content-text">{record.chart_of_acct}</td>
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
                <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                  className="rounded-lg border border-card-border bg-content-bg px-2 py-1 text-sm text-content-text appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40">
                  {PAGE_SIZE_OPTIONS.map((size) => (<option key={size} value={size}>{size}</option>))}
                </select>
              </div>
              <span className="text-content-text">
                {filteredReceipts.length === 0
                  ? `0 ${t("receipt.of")} 0`
                  : `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredReceipts.length)} ${t("receipt.of")} ${filteredReceipts.length}`}
              </span>
              <div className="flex items-center gap-1">
                <PagBtn onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft className="w-4 h-4" /></PagBtn>
                <PagBtn onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="w-4 h-4" /></PagBtn>
                <PagBtn onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight className="w-4 h-4" /></PagBtn>
                <PagBtn onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}><ChevronsRight className="w-4 h-4" /></PagBtn>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <UploadModal
          onClose={() => setUploadModalOpen(false)}
          onSuccess={() => { setUploadModalOpen(false); loadReceipts(); }}
        />
      )}

      {/* Change Status Modal */}
      {changeStatusModalOpen && selectedReceipt && (
        <ChangeStatusModal
          receipt={selectedReceipt}
          onClose={() => setChangeStatusModalOpen(false)}
          onSuccess={() => { setChangeStatusModalOpen(false); setSelectedIds(new Set()); loadReceipts(); }}
        />
      )}

      {/* Batch Assign Modal */}
      {batchAssignModalOpen && (
        <BatchAssignModal
          selectedIds={[...selectedIds]}
          onClose={() => setBatchAssignModalOpen(false)}
          onSuccess={() => { setBatchAssignModalOpen(false); setSelectedIds(new Set()); loadReceipts(); }}
        />
      )}
    </div>
  );
}

/* ─── Upload Modal ─── */

type UploadStep = "idle" | "analyzing" | "success" | "error";

function UploadModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<UploadStep>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step === "idle") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, step]);

  const handleBackdrop = (e: React.MouseEvent) => {
    if (step !== "idle") return;
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setStep("analyzing");
    setErrorMsg("");

    try {
      const result = await analyzeReceiptImage(selectedFile);

      await insertReceipt({
        receipt_time: result.receipt_time || new Date().toISOString(),
        vendor_name: result.vendor_name || "",
        receipt_no: result.receipt_no || "",
        subtotal: result.subtotal || 0,
        gst_hst: result.gst_hst || 0,
        pst_qst: result.pst_qst || 0,
        tax: result.tax || 0,
        total: result.total || 0,
        status: "pending",
        payment: result.payment || "",
        chart_of_acct: result.chart_of_acct || "",
        image_url: null,
      });

      setStep("success");
      setTimeout(() => onSuccess(), 1500);
    } catch (err) {
      console.error("Analysis failed:", err);
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      setStep("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={handleBackdrop}>
      <div ref={panelRef} className="w-full max-w-md bg-card-bg border border-card-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-rose-400 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">{t("receipt.uploadTitle")}</h2>
            <p className="text-white/70 text-xs mt-0.5">{t("receipt.uploadSubtitle")}</p>
          </div>
          {step === "idle" && (
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          {step === "idle" && (
            <>
              {/* Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  dragOver ? "border-primary bg-primary/5" : preview ? "border-emerald-400 bg-emerald-400/5" : "border-card-border hover:border-primary/50"
                }`}
              >
                {preview ? (
                  <img src={preview} alt="Receipt" className="max-h-48 mx-auto rounded-lg object-contain" />
                ) : (
                  <>
                    <ImagePlus className="w-10 h-10 text-sidebar-text mx-auto mb-3" />
                    <p className="text-sm text-content-text">{t("receipt.dragDrop")}</p>
                    <p className="text-xs text-sidebar-text mt-1">{t("receipt.supportedFormats")}</p>
                  </>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-5">
                <button onClick={onClose}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-sidebar-text bg-content-bg border border-card-border hover:bg-sidebar-hover transition-colors cursor-pointer">
                  <X className="w-4 h-4" />{t("receipt.cancel")}
                </button>
                <button onClick={handleAnalyze} disabled={!selectedFile}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />{t("receipt.uploadReceipts")}
                </button>
              </div>
            </>
          )}

          {step === "analyzing" && (
            <div className="flex flex-col items-center py-10">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              <p className="text-base font-medium text-content-text">{t("receipt.analyzing")}</p>
              <p className="text-xs text-sidebar-text mt-2">{t("receipt.uploading")}</p>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center py-10">
              <div className="w-16 h-16 rounded-2xl bg-emerald-400/15 flex items-center justify-center mb-5">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-base font-medium text-content-text">{t("receipt.analyzeSuccess")}</p>
            </div>
          )}

          {step === "error" && (
            <div className="flex flex-col items-center py-10">
              <div className="w-16 h-16 rounded-2xl bg-rose-400/15 flex items-center justify-center mb-5">
                <AlertCircle className="w-8 h-8 text-rose-500" />
              </div>
              <p className="text-base font-medium text-content-text">{t("receipt.analyzeError")}</p>
              {errorMsg && <p className="text-xs text-sidebar-text mt-2 max-w-xs text-center">{errorMsg}</p>}
              <button onClick={() => setStep("idle")}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 transition-colors cursor-pointer">
                {t("receipt.cancel")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Change Status Modal ─── */

const CHART_OF_ACCT_OPTIONS = [
  "Office Supplies",
  "Vehicle Expenses",
  "Office Equipment",
  "Meals & Entertainment",
  "Maintenance & Repairs",
  "Telephone & Internet",
  "Shipping & Delivery",
  "Software & Subscriptions",
];

const selectClass =
  "w-full rounded-xl border border-card-border bg-content-bg px-4 py-2.5 text-sm text-content-text appearance-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all cursor-pointer";

const labelClass = "block text-xs font-medium text-sidebar-text mb-1.5";

function ChangeStatusModal({
  receipt,
  onClose,
  onSuccess,
}: {
  receipt: ReceiptRow;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { t } = useTranslation();
  const panelRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(receipt.status);
  const [vendorName, setVendorName] = useState(receipt.vendor_name);
  const [receiptNo, setReceiptNo] = useState(receipt.receipt_no);
  const [subtotal, setSubtotal] = useState(String(receipt.subtotal));
  const [gstHst, setGstHst] = useState(String(receipt.gst_hst));
  const [pstQst, setPstQst] = useState(String(receipt.pst_qst));
  const [payment, setPayment] = useState(receipt.payment);
  const [chartOfAcct, setChartOfAcct] = useState(receipt.chart_of_acct);

  const taxCalc = (Number(gstHst) || 0) + (Number(pstQst) || 0);
  const totalCalc = (Number(subtotal) || 0) + taxCalc;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleBackdrop = (e: React.MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateReceiptFields([receipt.id], {
        status,
        vendor_name: vendorName,
        receipt_no: receiptNo,
        subtotal: Number(subtotal) || 0,
        gst_hst: Number(gstHst) || 0,
        pst_qst: Number(pstQst) || 0,
        tax: taxCalc,
        total: totalCalc,
        payment,
        chart_of_acct: chartOfAcct,
      });
      onSuccess();
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={handleBackdrop}>
      <div ref={panelRef} className="w-full max-w-lg bg-card-bg border border-card-border rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">{t("receipt.changeStatusTitle")}</h2>
            <p className="text-white/70 text-xs mt-0.5">{t("receipt.changeStatusSubtitle")}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4">
          {/* Status */}
          <div>
            <label className={labelClass}>{t("receipt.newStatus")}</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="exported">Exported</option>
            </select>
          </div>

          {/* Vendor / Receipt # */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t("receipt.vendorName")}</label>
              <input type="text" value={vendorName} onChange={(e) => setVendorName(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t("receipt.receiptNo")}</label>
              <input type="text" value={receiptNo} onChange={(e) => setReceiptNo(e.target.value)} className={inputClass} />
            </div>
          </div>

          {/* Subtotal / GST / PST */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>{t("receipt.subtotal")}</label>
              <input type="number" step="0.01" value={subtotal} onChange={(e) => setSubtotal(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t("receipt.gstHst")}</label>
              <input type="number" step="0.01" value={gstHst} onChange={(e) => setGstHst(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t("receipt.pstQst")}</label>
              <input type="number" step="0.01" value={pstQst} onChange={(e) => setPstQst(e.target.value)} className={inputClass} />
            </div>
          </div>

          {/* Tax / Total (auto-calculated, read-only) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t("receipt.taxField")}</label>
              <input type="text" readOnly value={`$${taxCalc.toFixed(2)}`} className={`${inputClass} bg-sidebar-hover cursor-not-allowed opacity-70`} />
            </div>
            <div>
              <label className={labelClass}>{t("receipt.totalField")}</label>
              <input type="text" readOnly value={`$${totalCalc.toFixed(2)}`} className={`${inputClass} bg-sidebar-hover cursor-not-allowed opacity-70`} />
            </div>
          </div>

          {/* Payment / Chart of Acct */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t("receipt.paymentMethod")}</label>
              <select value={payment} onChange={(e) => setPayment(e.target.value)} className={selectClass}>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Cash">Cash</option>
                <option value="Auto-pay">Auto-pay</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>{t("receipt.chartOfAcct")}</label>
              <select value={chartOfAcct} onChange={(e) => setChartOfAcct(e.target.value)} className={selectClass}>
                {CHART_OF_ACCT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-card-border flex items-center justify-end gap-3">
          <button onClick={onClose}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-sidebar-text bg-content-bg border border-card-border hover:bg-sidebar-hover transition-colors cursor-pointer">
            <X className="w-4 h-4" />{t("receipt.cancel")}
          </button>
          <button onClick={handleSave} disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 transition-colors cursor-pointer">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            {saving ? t("receipt.saving") : t("receipt.save")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Batch Assign Modal ─── */

function BatchAssignModal({
  selectedIds,
  onClose,
  onSuccess,
}: {
  selectedIds: number[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { t } = useTranslation();
  const panelRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState(CHART_OF_ACCT_OPTIONS[0]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleBackdrop = (e: React.MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
  };

  const handleApply = async () => {
    setSaving(true);
    try {
      await updateReceiptFields(selectedIds, { chart_of_acct: category });
      onSuccess();
    } catch (err) {
      console.error("Batch assign failed:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={handleBackdrop}>
      <div ref={panelRef} className="w-full max-w-sm bg-card-bg border border-card-border rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary-light px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">{t("receipt.batchAssignTitle")}</h2>
            <p className="text-white/70 text-xs mt-0.5">{t("receipt.batchAssignSubtitle", { count: selectedIds.length })}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <label className={labelClass}>{t("receipt.selectCategory")}</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
            {CHART_OF_ACCT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="px-6 py-4 border-t border-card-border flex items-center justify-end gap-3">
          <button onClick={onClose}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-sidebar-text bg-content-bg border border-card-border hover:bg-sidebar-hover transition-colors cursor-pointer">
            <X className="w-4 h-4" />{t("receipt.cancel")}
          </button>
          <button onClick={handleApply} disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary-hover disabled:opacity-50 transition-colors cursor-pointer">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
            {saving ? t("receipt.saving") : t("receipt.apply")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Small Components ─── */

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-400/15 text-amber-600",
    verified: "bg-emerald-400/15 text-emerald-600",
    exported: "bg-blue-400/15 text-blue-600",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status.toLowerCase()] ?? "bg-gray-400/15 text-gray-500"}`}>
      {status}
    </span>
  );
}

function PagBtn({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-8 h-8 rounded-lg flex items-center justify-center border border-card-border text-sidebar-text hover:bg-sidebar-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">
      {children}
    </button>
  );
}
