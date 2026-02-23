import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  CreditCard,
  Plus,
  RefreshCw,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaymentRecord {
  id: number;
  paymentDate: string;
  paymentNo: string;
  productDescription: string;
  receiptNo: string;
  bankStatement: string;
  promoCode: string;
  active: boolean;
}

const demoPayments: PaymentRecord[] = [];

const inputClass =
  "w-full rounded-xl border border-card-border bg-content-bg px-4 py-2.5 text-sm text-content-text placeholder-sidebar-text focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all";

const selectClass =
  "w-full rounded-xl border border-card-border bg-content-bg px-4 py-2.5 text-sm text-content-text appearance-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all cursor-pointer";

const labelClass = "block text-xs font-medium text-sidebar-text mb-1.5";

const PAGE_SIZE_OPTIONS = [12, 24, 48];

export default function SubscriptionPage() {
  const { t } = useTranslation();

  const [clientId] = useState("22249");
  const [companyName, setCompanyName] = useState("");
  const [subscriptionPlan, setSubscriptionPlan] = useState("");
  const [planUserCount, setPlanUserCount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [information, setInformation] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPayments = useMemo(() => {
    if (!searchQuery.trim()) return demoPayments;
    const q = searchQuery.toLowerCase();
    return demoPayments.filter(
      (p) =>
        p.paymentNo.toLowerCase().includes(q) ||
        p.productDescription.toLowerCase().includes(q) ||
        p.receiptNo.toLowerCase().includes(q) ||
        p.promoCode.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / pageSize));
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    { key: "colIndex", width: "w-12" },
    { key: "colPaymentDate", width: "w-auto" },
    { key: "colPaymentNo", width: "w-auto" },
    { key: "colProductDesc", width: "w-auto min-w-[180px]" },
    { key: "colReceiptNo", width: "w-auto" },
    { key: "colBankStatement", width: "w-auto" },
    { key: "colPromoCode", width: "w-auto" },
    { key: "colActive", width: "w-20" },
  ];

  return (
    <div className="min-h-full p-6 md:p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-content-text">
              {t("subscription.pageTitle")}
            </h1>
            <p className="text-sidebar-text text-sm">
              {t("subscription.pageSubtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Details Card */}
      <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-primary to-primary-light px-6 py-4">
          <h2 className="text-base font-semibold text-white">
            {t("subscription.detailsSection")}
          </h2>
        </div>

        <div className="p-6">
          {/* Row 1: Client #, Company Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 mb-5">
            <div>
              <label className={labelClass}>{t("subscription.clientId")}</label>
              <input
                type="text"
                value={clientId}
                readOnly
                className={`${inputClass} bg-sidebar-hover cursor-not-allowed opacity-70`}
              />
            </div>
            <div>
              <label className={labelClass}>
                {t("subscription.companyName")}
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 2: Subscription Plan, Plan User Count */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 mb-5">
            <div>
              <label className={labelClass}>
                {t("subscription.subscriptionPlan")}
              </label>
              <select
                value={subscriptionPlan}
                onChange={(e) => setSubscriptionPlan(e.target.value)}
                className={selectClass}
              >
                <option value="">
                  {t("subscription.pleaseSelectOne")}
                </option>
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>
                {t("subscription.planUserCount")}
              </label>
              <input
                type="number"
                value={planUserCount}
                onChange={(e) => setPlanUserCount(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 3: Start Date, Expiry Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 mb-5">
            <div>
              <label className={labelClass}>
                {t("subscription.startDate")}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                {t("subscription.expiryDate")}
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 4: Subscription Information */}
          <div>
            <label className={labelClass}>
              {t("subscription.information")}
            </label>
            <textarea
              value={information}
              onChange={(e) => setInformation(e.target.value)}
              placeholder={t("subscription.informationPlaceholder")}
              rows={3}
              className={`${inputClass} resize-y`}
            />
          </div>
        </div>
      </div>

      {/* Payment History Card */}
      <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-primary to-primary-light px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">
            {t("subscription.paymentHistory")}
          </h2>
        </div>

        <div className="p-6">
          {/* Search */}
          <div className="mb-4 max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sidebar-text pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={t("subscription.searchPlaceholder")}
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-card-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-content-bg">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`${col.width} px-4 py-3 text-left text-xs font-semibold text-sidebar-text uppercase tracking-wider`}
                    >
                      {t(`subscription.${col.key}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {paginatedPayments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-12 text-center text-sidebar-text text-sm"
                    >
                      {t("subscription.noRecords")}
                    </td>
                  </tr>
                ) : (
                  paginatedPayments.map((record, idx) => (
                    <tr
                      key={record.id}
                      className="hover:bg-sidebar-hover/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-content-text">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td className="px-4 py-3 text-content-text">
                        {record.paymentDate}
                      </td>
                      <td className="px-4 py-3 text-content-text">
                        {record.paymentNo}
                      </td>
                      <td className="px-4 py-3 text-content-text">
                        {record.productDescription}
                      </td>
                      <td className="px-4 py-3 text-content-text">
                        {record.receiptNo}
                      </td>
                      <td className="px-4 py-3 text-content-text">
                        {record.bankStatement}
                      </td>
                      <td className="px-4 py-3 text-content-text">
                        {record.promoCode}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${record.active ? "bg-emerald-400" : "bg-gray-400"}`}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end gap-4 mt-4 text-sm text-sidebar-text">
            <div className="flex items-center gap-2">
              <span>{t("subscription.itemsPerPage")}</span>
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
              {filteredPayments.length === 0
                ? `0 ${t("subscription.of")} 0`
                : `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredPayments.length)} ${t("subscription.of")} ${filteredPayments.length}`}
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

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary-hover transition-colors cursor-pointer">
          <Plus className="w-4 h-4" />
          {t("subscription.addOn")}
        </button>
        <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-sidebar-text bg-card-bg border border-card-border hover:bg-sidebar-hover transition-colors cursor-pointer">
          <RefreshCw className="w-4 h-4" />
          {t("subscription.renewPay")}
        </button>
        <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-sidebar-text bg-card-bg border border-card-border hover:bg-sidebar-hover transition-colors cursor-pointer">
          <XCircle className="w-4 h-4" />
          {t("subscription.cancelSubscription")}
        </button>
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
