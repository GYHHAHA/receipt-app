import { useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  Building2,
  Upload,
  Search,
  Save,
  X,
} from "lucide-react";

interface FormData {
  clientId: string;
  contactName: string;
  companyBusinessNumber: string;
  companyTaxCode: string;
  companyTaxRate: string;
  clientStatus: string;
  subscriptionPlanUserCount: string;
  subscriptionStartDate: string;
  renewalDate: string;
  showNewFlagHours: string;
  showNewFlagCheckbox: boolean;
  accountItem: string;
  receiptCycleDays: string;
  reviewDaysForReceiptIntro: string;
  contact: string;
  email: string;
  phone: string;
  mobile: string;
  address1: string;
  address2: string;
  city: string;
  provinceCode: string;
  zipCode: string;
  country: string;
  accountingSystemName: string;
  makeFilingFieldsReadonly: boolean;
}

const initialFormData: FormData = {
  clientId: "22249",
  contactName: "",
  companyBusinessNumber: "",
  companyTaxCode: "",
  companyTaxRate: "",
  clientStatus: "",
  subscriptionPlanUserCount: "",
  subscriptionStartDate: "",
  renewalDate: "",
  showNewFlagHours: "",
  showNewFlagCheckbox: false,
  accountItem: "",
  receiptCycleDays: "",
  reviewDaysForReceiptIntro: "",
  contact: "",
  email: "",
  phone: "",
  mobile: "",
  address1: "",
  address2: "",
  city: "",
  provinceCode: "",
  zipCode: "",
  country: "",
  accountingSystemName: "",
  makeFilingFieldsReadonly: false,
};

const inputClass =
  "w-full rounded-xl border border-card-border bg-content-bg px-4 py-2.5 text-sm text-content-text placeholder-sidebar-text focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all";

const selectClass =
  "w-full rounded-xl border border-card-border bg-content-bg px-4 py-2.5 text-sm text-content-text appearance-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all cursor-pointer";

const labelClass = "block text-xs font-medium text-sidebar-text mb-1.5";

function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function CompanyPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormData>(initialFormData);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setForm(initialFormData);
    setLogoPreview(null);
  };

  return (
    <div className="min-h-full p-6 md:p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-content-text">
              {t("company.pageTitle")}
            </h1>
            <p className="text-sidebar-text text-sm">
              {t("company.pageSubtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-primary to-primary-light px-6 py-4">
          <h2 className="text-base font-semibold text-white">
            {t("company.profileSection")}
          </h2>
        </div>

        <div className="p-6">
          {/* Row 1: Client #, Contact Name, Logo */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-5 gap-y-4 mb-5">
            <div className="md:col-span-3">
              <FormField label={t("company.clientId")}>
                <input
                  type="text"
                  value={form.clientId}
                  readOnly
                  className={`${inputClass} bg-sidebar-hover cursor-not-allowed opacity-70`}
                />
              </FormField>
            </div>
            <div className="md:col-span-5">
              <FormField label={t("company.contactName")} required>
                <input
                  type="text"
                  value={form.contactName}
                  onChange={(e) => updateField("contactName", e.target.value)}
                  className={inputClass}
                />
              </FormField>
            </div>
            <div className="md:col-span-4">
              <FormField label={t("company.uploadLogo")}>
                <div className="flex items-center gap-3">
                  {logoPreview && (
                    <img
                      src={logoPreview}
                      alt="Logo"
                      className="w-10 h-10 rounded-lg object-cover border border-card-border"
                    />
                  )}
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    {t("company.uploadLogo")}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </FormField>
            </div>
          </div>

          {/* Row 2: Business Number, Tax Code, Tax Rate */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-4 mb-5">
            <FormField label={t("company.companyBusinessNumber")}>
              <input
                type="text"
                value={form.companyBusinessNumber}
                onChange={(e) =>
                  updateField("companyBusinessNumber", e.target.value)
                }
                className={inputClass}
              />
            </FormField>
            <FormField label={t("company.companyTaxCode")}>
              <input
                type="text"
                value={form.companyTaxCode}
                onChange={(e) => updateField("companyTaxCode", e.target.value)}
                className={inputClass}
              />
            </FormField>
            <FormField label={t("company.companyTaxRate")}>
              <input
                type="text"
                value={form.companyTaxRate}
                onChange={(e) => updateField("companyTaxRate", e.target.value)}
                className={inputClass}
              />
            </FormField>
          </div>

          {/* Row 3: Client Status, Subscription Plan User Count */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 mb-5">
            <FormField label={t("company.clientStatus")}>
              <select
                value={form.clientStatus}
                onChange={(e) => updateField("clientStatus", e.target.value)}
                className={selectClass}
              >
                <option value="">{t("company.pleaseSelectOne")}</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </FormField>
            <FormField label={t("company.subscriptionPlanUserCount")}>
              <input
                type="number"
                value={form.subscriptionPlanUserCount}
                onChange={(e) =>
                  updateField("subscriptionPlanUserCount", e.target.value)
                }
                className={inputClass}
              />
            </FormField>
          </div>

          {/* Row 4: Subscription Start Date, Renewal Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 mb-5">
            <FormField label={t("company.subscriptionStartDate")}>
              <input
                type="date"
                value={form.subscriptionStartDate}
                onChange={(e) =>
                  updateField("subscriptionStartDate", e.target.value)
                }
                className={inputClass}
              />
            </FormField>
            <FormField label={t("company.renewalDate")}>
              <input
                type="date"
                value={form.renewalDate}
                onChange={(e) => updateField("renewalDate", e.target.value)}
                className={inputClass}
              />
            </FormField>
          </div>

          {/* Row 5: Show new flag hours + checkbox */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 mb-5">
            <FormField label={t("company.showNewFlagHours")}>
              <input
                type="number"
                value={form.showNewFlagHours}
                onChange={(e) =>
                  updateField("showNewFlagHours", e.target.value)
                }
                className={inputClass}
              />
            </FormField>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.showNewFlagCheckbox}
                  onChange={(e) =>
                    updateField("showNewFlagCheckbox", e.target.checked)
                  }
                  className="w-4 h-4 rounded border-card-border text-primary accent-primary cursor-pointer"
                />
                <span className="text-sm text-content-text group-hover:text-primary transition-colors">
                  {t("company.showNewFlagCheckbox")}
                </span>
              </label>
            </div>
          </div>

          {/* Row 6: Account Item */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
            <FormField label={t("company.accountItem")}>
              <div className="relative">
                <input
                  type="text"
                  value={form.accountItem}
                  onChange={(e) => updateField("accountItem", e.target.value)}
                  className={`${inputClass} pr-10`}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sidebar-text pointer-events-none" />
              </div>
            </FormField>
          </div>
        </div>
      </div>

      {/* General Info Section */}
      <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-primary to-primary-light px-6 py-4">
          <h2 className="text-base font-semibold text-white">
            {t("company.generalSection")}
          </h2>
        </div>

        <div className="p-6">
          {/* Row 1: Receipt Cycle Days, Review Days */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 mb-5">
            <FormField label={t("company.receiptCycleDays")}>
              <input
                type="number"
                value={form.receiptCycleDays}
                onChange={(e) =>
                  updateField("receiptCycleDays", e.target.value)
                }
                className={inputClass}
              />
            </FormField>
            <FormField label={t("company.reviewDaysForReceiptIntro")}>
              <input
                type="number"
                value={form.reviewDaysForReceiptIntro}
                onChange={(e) =>
                  updateField("reviewDaysForReceiptIntro", e.target.value)
                }
                className={inputClass}
              />
            </FormField>
          </div>

          {/* Row 2: Contact, Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 mb-5">
            <FormField label={t("company.contactField")} required>
              <input
                type="text"
                value={form.contact}
                onChange={(e) => updateField("contact", e.target.value)}
                className={inputClass}
              />
            </FormField>
            <FormField label={t("company.email")} required>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className={inputClass}
              />
            </FormField>
          </div>

          {/* Row 3: Phone, Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 mb-5">
            <FormField label={t("company.phone")}>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className={inputClass}
              />
            </FormField>
            <FormField label={t("company.mobile")} required>
              <input
                type="tel"
                value={form.mobile}
                onChange={(e) => updateField("mobile", e.target.value)}
                className={inputClass}
              />
            </FormField>
          </div>

          {/* Row 4: Address 1, Address 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 mb-5">
            <FormField label={t("company.address1")} required>
              <input
                type="text"
                value={form.address1}
                onChange={(e) => updateField("address1", e.target.value)}
                className={inputClass}
              />
            </FormField>
            <FormField label={t("company.address2")}>
              <input
                type="text"
                value={form.address2}
                onChange={(e) => updateField("address2", e.target.value)}
                className={inputClass}
              />
            </FormField>
          </div>

          {/* Row 5: City, Province/Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 mb-5">
            <FormField label={t("company.city")} required>
              <input
                type="text"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                className={inputClass}
              />
            </FormField>
            <FormField label={t("company.provinceCode")} required>
              <select
                value={form.provinceCode}
                onChange={(e) => updateField("provinceCode", e.target.value)}
                className={selectClass}
              >
                <option value="">{t("company.pleaseSelectOne")}</option>
                <option value="ON">Ontario (ON)</option>
                <option value="QC">Quebec (QC)</option>
                <option value="BC">British Columbia (BC)</option>
                <option value="AB">Alberta (AB)</option>
                <option value="MB">Manitoba (MB)</option>
                <option value="SK">Saskatchewan (SK)</option>
                <option value="NS">Nova Scotia (NS)</option>
                <option value="NB">New Brunswick (NB)</option>
                <option value="NL">Newfoundland and Labrador (NL)</option>
                <option value="PE">Prince Edward Island (PE)</option>
                <option value="NT">Northwest Territories (NT)</option>
                <option value="YT">Yukon (YT)</option>
                <option value="NU">Nunavut (NU)</option>
              </select>
            </FormField>
          </div>

          {/* Row 6: Zip Code, Country */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 mb-5">
            <FormField label={t("company.zipCode")} required>
              <input
                type="text"
                value={form.zipCode}
                onChange={(e) => updateField("zipCode", e.target.value)}
                className={inputClass}
              />
            </FormField>
            <FormField label={t("company.country")}>
              <input
                type="text"
                value={form.country}
                onChange={(e) => updateField("country", e.target.value)}
                className={inputClass}
              />
            </FormField>
          </div>

          {/* Row 7: Accounting System Name + Checkbox */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
            <FormField label={t("company.accountingSystemName")}>
              <select
                value={form.accountingSystemName}
                onChange={(e) =>
                  updateField("accountingSystemName", e.target.value)
                }
                className={selectClass}
              >
                <option value="">{t("company.pleaseSelectOne")}</option>
                <option value="quickbooks">QuickBooks</option>
                <option value="sage">Sage</option>
                <option value="xero">Xero</option>
                <option value="freshbooks">FreshBooks</option>
                <option value="wave">Wave</option>
                <option value="other">Other</option>
              </select>
            </FormField>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.makeFilingFieldsReadonly}
                  onChange={(e) =>
                    updateField("makeFilingFieldsReadonly", e.target.checked)
                  }
                  className="w-4 h-4 rounded border-card-border text-primary accent-primary cursor-pointer"
                />
                <span className="text-sm text-content-text group-hover:text-primary transition-colors">
                  {t("company.makeFilingFieldsReadonly")}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={handleCancel}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-sidebar-text bg-card-bg border border-card-border hover:bg-sidebar-hover transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
          {t("company.cancel")}
        </button>
        <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary-hover transition-colors cursor-pointer">
          <Save className="w-4 h-4" />
          {t("company.save")}
        </button>
      </div>
    </div>
  );
}
