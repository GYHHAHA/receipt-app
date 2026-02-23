import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ReactECharts from "echarts-for-react";
import {
  BarChart3,
  DollarSign,
  FileText,
  Receipt,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { fetchAllReceipts, type ReceiptRow } from "@/lib/supabase";
import { useTheme } from "@/contexts/ThemeContext";

const PURPLE = "#7C3AED";
const PURPLE_LIGHT = "#A78BFA";
const EMERALD = "#34D399";
const ROSE = "#FB7185";
const AMBER = "#FBBF24";
const SKY = "#38BDF8";
const INDIGO = "#818CF8";
const SLATE = "#94A3B8";
const PALETTE = [PURPLE, EMERALD, ROSE, AMBER, SKY, INDIGO, "#F472B6", "#FB923C", SLATE, "#2DD4BF", "#A3E635", "#E879F9"];

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [receipts, setReceipts] = useState<ReceiptRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setReceipts(await fetchAllReceipts());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const textColor = isDark ? "#E5E7EB" : "#1E2140";
  const subTextColor = isDark ? "#9CA3AF" : "#6E7191";
  const gridLineColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const tooltipBg = isDark ? "#25293C" : "#FAFAFF";
  const tooltipBorder = isDark ? "#2F3349" : "#E0E2F0";

  const baseAxis = useMemo(() => ({
    axisLabel: { color: subTextColor, fontSize: 11 },
    axisLine: { lineStyle: { color: gridLineColor } },
    splitLine: { lineStyle: { color: gridLineColor } },
  }), [subTextColor, gridLineColor]);

  const baseTooltip = useMemo(() => ({
    backgroundColor: tooltipBg,
    borderColor: tooltipBorder,
    textStyle: { color: textColor, fontSize: 12 },
  }), [tooltipBg, tooltipBorder, textColor]);

  /* ─── Computed Data ─── */

  const totalSpending = receipts.reduce((s, r) => s + Number(r.total), 0);
  const totalTax = receipts.reduce((s, r) => s + Number(r.tax), 0);
  const avgTransaction = receipts.length ? totalSpending / receipts.length : 0;

  const monthlyData = useMemo(() => {
    const map = new Map<string, { total: number; tax: number; gst: number; pst: number; subtotal: number; count: number }>();
    receipts.forEach((r) => {
      const m = r.receipt_time.slice(0, 7);
      const entry = map.get(m) || { total: 0, tax: 0, gst: 0, pst: 0, subtotal: 0, count: 0 };
      entry.total += Number(r.total);
      entry.tax += Number(r.tax);
      entry.gst += Number(r.gst_hst);
      entry.pst += Number(r.pst_qst);
      entry.subtotal += Number(r.subtotal);
      entry.count += 1;
      map.set(m, entry);
    });
    const sorted = [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    return { months: sorted.map(([m]) => m), values: sorted.map(([, v]) => v) };
  }, [receipts]);

  const categoryData = useMemo(() => {
    const map = new Map<string, { total: number; tax: number; count: number }>();
    receipts.forEach((r) => {
      const cat = r.chart_of_acct || "Other";
      const entry = map.get(cat) || { total: 0, tax: 0, count: 0 };
      entry.total += Number(r.total);
      entry.tax += Number(r.tax);
      entry.count += 1;
      map.set(cat, entry);
    });
    return [...map.entries()].sort((a, b) => b[1].total - a[1].total);
  }, [receipts]);

  const vendorData = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    receipts.forEach((r) => {
      const v = r.vendor_name || "Unknown";
      const entry = map.get(v) || { total: 0, count: 0 };
      entry.total += Number(r.total);
      entry.count += 1;
      map.set(v, entry);
    });
    return [...map.entries()].sort((a, b) => b[1].total - a[1].total);
  }, [receipts]);

  const statusData = useMemo(() => {
    const map = new Map<string, number>();
    receipts.forEach((r) => map.set(r.status, (map.get(r.status) || 0) + 1));
    return [...map.entries()];
  }, [receipts]);

  const paymentData = useMemo(() => {
    const map = new Map<string, number>();
    receipts.forEach((r) => {
      const p = r.payment || "Other";
      map.set(p, (map.get(p) || 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [receipts]);

  const dailyData = useMemo(() => {
    const map = new Map<string, number>();
    receipts.forEach((r) => {
      const d = r.receipt_time.slice(0, 10);
      map.set(d, (map.get(d) || 0) + Number(r.total));
    });
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [receipts]);

  const taxRates = useMemo(() =>
    receipts.filter((r) => Number(r.subtotal) > 0).map((r) => {
      const rate = (Number(r.tax) / Number(r.subtotal)) * 100;
      return { vendor: r.vendor_name, subtotal: Number(r.subtotal), rate: Math.round(rate * 100) / 100 };
    }), [receipts]);

  /* ─── Chart Options ─── */

  const monthlyTrendOpt = useMemo(() => ({
    tooltip: { ...baseTooltip, trigger: "axis" },
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: { type: "category", data: monthlyData.months, ...baseAxis },
    yAxis: { type: "value", ...baseAxis },
    series: [{
      type: "line", data: monthlyData.values.map((v) => Math.round(v.total * 100) / 100),
      smooth: true, symbol: "circle", symbolSize: 6,
      lineStyle: { color: PURPLE, width: 3 },
      itemStyle: { color: PURPLE },
      areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(124,58,237,0.25)" }, { offset: 1, color: "rgba(124,58,237,0.02)" }] } },
    }],
  }), [monthlyData, baseAxis, baseTooltip]);

  const cumulativeOpt = useMemo(() => {
    let cum = 0;
    const cumData = dailyData.map(([d, v]) => { cum += v; return [d, Math.round(cum * 100) / 100]; });
    return {
      tooltip: { ...baseTooltip, trigger: "axis" },
      grid: { left: 60, right: 20, top: 20, bottom: 30 },
      xAxis: { type: "category", data: cumData.map(([d]) => d), ...baseAxis, axisLabel: { ...baseAxis.axisLabel, rotate: 45, fontSize: 10 } },
      yAxis: { type: "value", ...baseAxis },
      series: [{
        type: "line", data: cumData.map(([, v]) => v), smooth: true, symbol: "none",
        lineStyle: { color: EMERALD, width: 2.5 },
        areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(52,211,153,0.3)" }, { offset: 1, color: "rgba(52,211,153,0.02)" }] } },
      }],
    };
  }, [dailyData, baseAxis, baseTooltip]);

  const dailySpendingOpt = useMemo(() => ({
    tooltip: { ...baseTooltip, trigger: "axis" },
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: { type: "category", data: dailyData.map(([d]) => d.slice(5)), ...baseAxis, axisLabel: { ...baseAxis.axisLabel, rotate: 45, fontSize: 10 } },
    yAxis: { type: "value", ...baseAxis },
    series: [{ type: "bar", data: dailyData.map(([, v]) => Math.round(v * 100) / 100), itemStyle: { color: SKY, borderRadius: [4, 4, 0, 0] }, barMaxWidth: 18 }],
  }), [dailyData, baseAxis, baseTooltip]);

  const monthlyCountOpt = useMemo(() => ({
    tooltip: { ...baseTooltip, trigger: "axis" },
    grid: { left: 40, right: 20, top: 20, bottom: 30 },
    xAxis: { type: "category", data: monthlyData.months, ...baseAxis },
    yAxis: { type: "value", ...baseAxis, minInterval: 1 },
    series: [{ type: "bar", data: monthlyData.values.map((v) => v.count), itemStyle: { color: INDIGO, borderRadius: [4, 4, 0, 0] }, barMaxWidth: 36 }],
  }), [monthlyData, baseAxis, baseTooltip]);

  const expenseByCategoryOpt = useMemo(() => ({
    tooltip: { ...baseTooltip, trigger: "item", formatter: "{b}: ${c} ({d}%)" },
    legend: { bottom: 0, textStyle: { color: subTextColor, fontSize: 11 }, type: "scroll" },
    series: [{
      type: "pie", radius: ["40%", "70%"], center: ["50%", "45%"],
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 13, fontWeight: "bold", color: textColor } },
      data: categoryData.map(([name, val], i) => ({ value: Math.round(val.total * 100) / 100, name, itemStyle: { color: PALETTE[i % PALETTE.length] } })),
    }],
  }), [categoryData, baseTooltip, subTextColor, textColor]);

  const topVendorsOpt = useMemo(() => {
    const top = vendorData.slice(0, 10).reverse();
    return {
      tooltip: { ...baseTooltip, trigger: "axis", axisPointer: { type: "shadow" } },
      grid: { left: 130, right: 30, top: 10, bottom: 20 },
      xAxis: { type: "value", ...baseAxis },
      yAxis: { type: "category", data: top.map(([n]) => n), ...baseAxis, axisLabel: { ...baseAxis.axisLabel, width: 110, overflow: "truncate" } },
      series: [{ type: "bar", data: top.map(([, v]) => Math.round(v.total * 100) / 100), itemStyle: { color: PURPLE_LIGHT, borderRadius: [0, 4, 4, 0] }, barMaxWidth: 20 }],
    };
  }, [vendorData, baseAxis, baseTooltip]);

  const avgByCategoryOpt = useMemo(() => ({
    tooltip: { ...baseTooltip, trigger: "axis", axisPointer: { type: "shadow" } },
    grid: { left: 130, right: 30, top: 10, bottom: 20 },
    xAxis: { type: "value", ...baseAxis },
    yAxis: { type: "category", data: categoryData.map(([n]) => n).reverse(), ...baseAxis, axisLabel: { ...baseAxis.axisLabel, width: 110, overflow: "truncate" } },
    series: [{ type: "bar", data: categoryData.map(([, v]) => Math.round((v.total / v.count) * 100) / 100).reverse(), itemStyle: { color: AMBER, borderRadius: [0, 4, 4, 0] }, barMaxWidth: 20 }],
  }), [categoryData, baseAxis, baseTooltip]);

  const vendorFreqOpt = useMemo(() => {
    const top = vendorData.slice(0, 10).reverse();
    return {
      tooltip: { ...baseTooltip, trigger: "axis", axisPointer: { type: "shadow" } },
      grid: { left: 130, right: 30, top: 10, bottom: 20 },
      xAxis: { type: "value", ...baseAxis, minInterval: 1 },
      yAxis: { type: "category", data: top.map(([n]) => n), ...baseAxis, axisLabel: { ...baseAxis.axisLabel, width: 110, overflow: "truncate" } },
      series: [{ type: "bar", data: top.map(([, v]) => v.count), itemStyle: { color: ROSE, borderRadius: [0, 4, 4, 0] }, barMaxWidth: 20 }],
    };
  }, [vendorData, baseAxis, baseTooltip]);

  const taxBreakdownOpt = useMemo(() => ({
    tooltip: { ...baseTooltip, trigger: "axis" },
    legend: { bottom: 0, textStyle: { color: subTextColor, fontSize: 11 } },
    grid: { left: 50, right: 20, top: 20, bottom: 40 },
    xAxis: { type: "category", data: monthlyData.months, ...baseAxis },
    yAxis: { type: "value", ...baseAxis },
    series: [
      { name: "GST/HST", type: "bar", stack: "tax", data: monthlyData.values.map((v) => Math.round(v.gst * 100) / 100), itemStyle: { color: EMERALD, borderRadius: [0, 0, 0, 0] }, barMaxWidth: 28 },
      { name: "PST/QST", type: "bar", stack: "tax", data: monthlyData.values.map((v) => Math.round(v.pst * 100) / 100), itemStyle: { color: SKY, borderRadius: [4, 4, 0, 0] }, barMaxWidth: 28 },
    ],
  }), [monthlyData, baseAxis, baseTooltip, subTextColor]);

  const subtotalVsTaxOpt = useMemo(() => ({
    tooltip: { ...baseTooltip, trigger: "axis" },
    legend: { bottom: 0, textStyle: { color: subTextColor, fontSize: 11 } },
    grid: { left: 50, right: 20, top: 20, bottom: 40 },
    xAxis: { type: "category", data: monthlyData.months, ...baseAxis },
    yAxis: { type: "value", ...baseAxis },
    series: [
      { name: "Subtotal", type: "bar", data: monthlyData.values.map((v) => Math.round(v.subtotal * 100) / 100), itemStyle: { color: PURPLE, borderRadius: [4, 4, 0, 0] }, barMaxWidth: 24 },
      { name: "Tax", type: "bar", data: monthlyData.values.map((v) => Math.round(v.tax * 100) / 100), itemStyle: { color: ROSE, borderRadius: [4, 4, 0, 0] }, barMaxWidth: 24 },
    ],
  }), [monthlyData, baseAxis, baseTooltip, subTextColor]);

  const taxRateOpt = useMemo(() => ({
    tooltip: { ...baseTooltip, trigger: "item", formatter: (p: { data: number[] }) => `Subtotal: $${p.data[0]}<br/>Tax Rate: ${p.data[1]}%` },
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: { type: "value", name: "Subtotal ($)", ...baseAxis },
    yAxis: { type: "value", name: "Tax Rate (%)", ...baseAxis },
    series: [{
      type: "scatter", data: taxRates.map((r) => [r.subtotal, r.rate]),
      symbolSize: 10, itemStyle: { color: PURPLE, opacity: 0.7 },
    }],
  }), [taxRates, baseAxis, baseTooltip]);

  const statusColors: Record<string, string> = { pending: AMBER, verified: EMERALD, exported: SKY };
  const statusOpt = useMemo(() => ({
    tooltip: { ...baseTooltip, trigger: "item", formatter: "{b}: {c} ({d}%)" },
    legend: { bottom: 0, textStyle: { color: subTextColor, fontSize: 11 } },
    series: [{
      type: "pie", radius: ["45%", "70%"], center: ["50%", "42%"],
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 14, fontWeight: "bold", color: textColor } },
      data: statusData.map(([name, count]) => ({ value: count, name, itemStyle: { color: statusColors[name] ?? SLATE } })),
    }],
  }), [statusData, baseTooltip, subTextColor, textColor]);

  const paymentOpt = useMemo(() => ({
    tooltip: { ...baseTooltip, trigger: "item", formatter: "{b}: {c} ({d}%)" },
    legend: { bottom: 0, textStyle: { color: subTextColor, fontSize: 11 } },
    series: [{
      type: "pie", radius: ["0%", "65%"], center: ["50%", "42%"], roseType: "area",
      label: { show: false },
      data: paymentData.map(([name, count], i) => ({ value: count, name, itemStyle: { color: PALETTE[i % PALETTE.length] } })),
    }],
  }), [paymentData, baseTooltip, subTextColor]);

  const categoryTaxOpt = useMemo(() => ({
    tooltip: { ...baseTooltip, trigger: "item", formatter: "{b}: ${c} ({d}%)" },
    legend: { bottom: 0, textStyle: { color: subTextColor, fontSize: 11 }, type: "scroll" },
    series: [{
      type: "pie", radius: ["40%", "70%"], center: ["50%", "42%"],
      label: { show: false },
      data: categoryData.map(([name, val], i) => ({ value: Math.round(val.tax * 100) / 100, name, itemStyle: { color: PALETTE[i % PALETTE.length] } })),
    }],
  }), [categoryData, baseTooltip, subTextColor]);

  if (loading) {
    return (
      <div className="min-h-full p-6 md:p-8 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <span className="text-sm text-sidebar-text">{t("analytics.loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-content-text">{t("analytics.pageTitle")}</h1>
            <p className="text-sidebar-text text-sm">{t("analytics.pageSubtitle")}</p>
          </div>
        </div>
      </div>

      {/* ── Section 1: Overview KPIs ── */}
      <SectionTitle title={t("analytics.overviewSection")} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard icon={FileText} label={t("analytics.totalReceipts")} value={String(receipts.length)} color="text-primary" bg="bg-primary/10" />
        <KpiCard icon={DollarSign} label={t("analytics.totalSpending")} value={`$${totalSpending.toFixed(2)}`} color="text-emerald-500" bg="bg-emerald-500/10" />
        <KpiCard icon={Receipt} label={t("analytics.totalTax")} value={`$${totalTax.toFixed(2)}`} color="text-rose-500" bg="bg-rose-500/10" />
        <KpiCard icon={TrendingUp} label={t("analytics.avgTransaction")} value={`$${avgTransaction.toFixed(2)}`} color="text-amber-500" bg="bg-amber-500/10" />
      </div>

      {/* ── Section 2: Spending Analysis ── */}
      <SectionTitle title={t("analytics.spendingSection")} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        <ChartCard title={t("analytics.monthlyTrend")}><ReactECharts option={monthlyTrendOpt} style={{ height: 300 }} /></ChartCard>
        <ChartCard title={t("analytics.cumulativeSpending")}><ReactECharts option={cumulativeOpt} style={{ height: 300 }} /></ChartCard>
        <ChartCard title={t("analytics.dailySpending")}><ReactECharts option={dailySpendingOpt} style={{ height: 300 }} /></ChartCard>
        <ChartCard title={t("analytics.monthlyCount")}><ReactECharts option={monthlyCountOpt} style={{ height: 300 }} /></ChartCard>
      </div>

      {/* ── Section 3: Category & Vendor ── */}
      <SectionTitle title={t("analytics.categorySection")} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        <ChartCard title={t("analytics.expenseByCategory")}><ReactECharts option={expenseByCategoryOpt} style={{ height: 340 }} /></ChartCard>
        <ChartCard title={t("analytics.topVendors")}><ReactECharts option={topVendorsOpt} style={{ height: 340 }} /></ChartCard>
        <ChartCard title={t("analytics.avgByCategory")}><ReactECharts option={avgByCategoryOpt} style={{ height: 340 }} /></ChartCard>
        <ChartCard title={t("analytics.vendorFrequency")}><ReactECharts option={vendorFreqOpt} style={{ height: 340 }} /></ChartCard>
      </div>

      {/* ── Section 4: Tax & Payment ── */}
      <SectionTitle title={t("analytics.taxSection")} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-4">
        <ChartCard title={t("analytics.taxBreakdown")}><ReactECharts option={taxBreakdownOpt} style={{ height: 320 }} /></ChartCard>
        <ChartCard title={t("analytics.subtotalVsTax")}><ReactECharts option={subtotalVsTaxOpt} style={{ height: 320 }} /></ChartCard>
        <ChartCard title={t("analytics.taxRateDistribution")}><ReactECharts option={taxRateOpt} style={{ height: 320 }} /></ChartCard>
        <ChartCard title={t("analytics.statusDistribution")}><ReactECharts option={statusOpt} style={{ height: 320 }} /></ChartCard>
        <ChartCard title={t("analytics.paymentDistribution")}><ReactECharts option={paymentOpt} style={{ height: 320 }} /></ChartCard>
        <ChartCard title={t("analytics.categoryTaxShare")}><ReactECharts option={categoryTaxOpt} style={{ height: 320 }} /></ChartCard>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-px flex-1 bg-card-border" />
      <h2 className="text-sm font-semibold text-sidebar-text uppercase tracking-wider">{title}</h2>
      <div className="h-px flex-1 bg-card-border" />
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden">
      <div className="px-5 pt-4 pb-2">
        <h3 className="text-sm font-semibold text-content-text">{title}</h3>
      </div>
      <div className="px-3 pb-3">{children}</div>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, color, bg }: { icon: React.ElementType; label: string; value: string; color: string; bg: string }) {
  return (
    <div className="bg-card-bg border border-card-border rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-sidebar-text mb-0.5 truncate">{label}</p>
        <p className="text-xl font-bold text-content-text truncate">{value}</p>
      </div>
    </div>
  );
}
