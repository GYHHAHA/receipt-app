import { useTranslation } from "react-i18next";

export default function SubscriptionPage() {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="text-2xl font-bold text-content-text">
        {t("sidebar.subscription")}
      </h1>
    </div>
  );
}
