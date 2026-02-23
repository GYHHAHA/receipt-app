import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Send,
  Trash2,
  Building2,
} from "lucide-react";

export default function ContactUsPage() {
  const { t } = useTranslation();
  const [comment, setComment] = useState("");

  const handleClear = () => setComment("");

  const handleSend = () => {
    if (!comment.trim()) return;
    const subject = encodeURIComponent("Contact Form Message");
    const body = encodeURIComponent(comment);
    window.location.href = `mailto:contact@receiptcanada.com?subject=${subject}&body=${body}`;
  };

  const contactItems = [
    {
      icon: MapPin,
      label: t("contact.officeTitle"),
      value: t("contact.address"),
      multiline: true,
    },
    {
      icon: Mail,
      label: t("contact.emailLabel"),
      value: t("contact.emailValue"),
      href: "mailto:contact@receiptcanada.com",
    },
    {
      icon: Phone,
      label: t("contact.phoneLabel"),
      value: t("contact.phoneValue"),
      href: "tel:+19050000000",
    },
    {
      icon: Clock,
      label: t("contact.hoursLabel"),
      value: t("contact.hoursValue"),
    },
  ];

  return (
    <div className="min-h-full p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-content-text">
          {t("contact.title")}
        </h1>
        <p className="mt-2 text-sidebar-text text-sm">
          {t("contact.subtitle")}
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Contact Info Card */}
        <div className="lg:col-span-2 bg-card-bg border border-card-border rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-primary to-primary-light p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Datamond Corp.
                </h2>
                <p className="text-white/70 text-xs">Receipt Canada</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {contactItems.map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-sidebar-text uppercase tracking-wider mb-1">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm text-content-text hover:text-primary transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm text-content-text whitespace-pre-line leading-relaxed">
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Form Card */}
        <div className="lg:col-span-3 bg-card-bg border border-card-border rounded-2xl p-6 flex flex-col">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-content-text">
              {t("contact.formTitle")}
            </h2>
            <p className="mt-1 text-sidebar-text text-sm">
              {t("contact.formSubtitle")}
            </p>
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t("contact.commentPlaceholder")}
            className="flex-1 min-h-[220px] w-full rounded-xl border border-card-border bg-content-bg p-4 text-sm text-content-text placeholder-sidebar-text resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />

          <div className="flex items-center justify-end gap-3 mt-5">
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-sidebar-text bg-content-bg border border-card-border hover:bg-sidebar-hover transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              {t("contact.clearButton")}
            </button>
            <button
              onClick={handleSend}
              disabled={!comment.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              {t("contact.sendButton")}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 pt-6 border-t border-card-border text-center">
        <p className="text-xs text-sidebar-text">
          {t("contact.copyright")}
        </p>
        <p className="text-xs text-sidebar-group mt-1">
          {t("contact.version")}
        </p>
      </div>
    </div>
  );
}
