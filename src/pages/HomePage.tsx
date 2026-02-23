import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { ScanLine, ShieldCheck, BarChart3, Smartphone, ArrowRight } from "lucide-react";
import selfEmployedImg from "@/assets/self-employed.jpg";
import smallBusinessImg from "@/assets/small-business.jpg";
import accountantImg from "@/assets/accountant.jpg";
import logo from "@/assets/datamond-with-text_logo.png";

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const solutions = [
    { img: selfEmployedImg, title: t("home.selfEmployed"), desc: t("home.selfEmployedDesc"), btn: t("home.seeDetails"), to: "/user-center/company" as const },
    { img: smallBusinessImg, title: t("home.smallBusiness"), desc: t("home.smallBusinessDesc"), btn: t("home.seeDetails"), to: "/data-panel/receipt" as const },
    { img: accountantImg, title: t("home.accountant"), desc: t("home.accountantDesc"), btn: t("home.seePlans"), to: "/user-center/subscription" as const },
  ];

  const features = [
    { icon: ScanLine, title: t("home.feature1Title"), desc: t("home.feature1Desc") },
    { icon: ShieldCheck, title: t("home.feature2Title"), desc: t("home.feature2Desc") },
    { icon: BarChart3, title: t("home.feature3Title"), desc: t("home.feature3Desc") },
    { icon: Smartphone, title: t("home.feature4Title"), desc: t("home.feature4Desc") },
  ];

  return (
    <div className="min-h-full">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-10 pb-16 md:px-12 md:pt-16 md:pb-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/8 via-transparent to-primary-light/5" />
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-primary-light/5 blur-3xl" />

        <div className="max-w-3xl mx-auto text-center">
          <img src={logo} alt="Datamond" className="h-10 mx-auto mb-6 brightness-0 opacity-60 dark:invert dark:opacity-80" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-content-text leading-tight mb-4">
            {t("home.heroTitle")}
          </h1>
          <p className="text-base md:text-lg text-sidebar-text max-w-xl mx-auto mb-8 leading-relaxed">
            {t("home.heroSubtitle")}
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => navigate({ to: "/data-panel/receipt" })}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors cursor-pointer"
            >
              {t("home.getStarted")}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate({ to: "/contact-us" })}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-content-text bg-card-bg border border-card-border hover:bg-sidebar-hover transition-colors cursor-pointer"
            >
              {t("home.learnMore")}
            </button>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="px-6 pb-16 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-content-text mb-2">{t("home.solutionsTitle")}</h2>
            <div className="w-16 h-1 bg-primary rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {solutions.map((s) => (
              <div
                key={s.title}
                className="group bg-card-bg border border-card-border rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-lg font-bold text-content-text mb-2">{s.title}</h3>
                  <p className="text-sm text-sidebar-text leading-relaxed mb-4">{s.desc}</p>
                  <button
                    onClick={() => navigate({ to: s.to })}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors cursor-pointer"
                  >
                    {s.btn}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="px-6 pb-16 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-content-text mb-2">{t("home.whyTitle")}</h2>
            <div className="w-16 h-1 bg-primary rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-card-bg border border-card-border rounded-2xl p-6 text-center hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-content-text mb-2">{f.title}</h3>
                <p className="text-xs text-sidebar-text leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pb-8 md:px-12">
        <div className="max-w-5xl mx-auto pt-6 border-t border-card-border text-center">
          <p className="text-xs text-sidebar-text">
            Copyright © 2015 - 2026 Datamond Corp., All Rights Reserved. Version: 3.1.4
          </p>
        </div>
      </footer>
    </div>
  );
}
