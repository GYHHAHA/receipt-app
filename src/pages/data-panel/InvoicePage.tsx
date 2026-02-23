import { useTranslation } from "react-i18next";

export default function InvoicePage() {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="text-2xl font-bold text-content-text">
        {t("sidebar.invoice")}
      </h1>
    </div>
  );
}
