import * as React from "react";
import "./Footer.scss";

export const FooterHome: React.FunctionComponent = () => {
  const [isArabic, setIsArabic] = React.useState<boolean>(
    localStorage.getItem("isArabic") === "ar"
  );

  React.useEffect(() => {
    const syncLanguage = () => {
      setIsArabic(localStorage.getItem("isArabic") === "ar");
    };

    window.addEventListener("languageChanged", syncLanguage);
    window.addEventListener("storage", syncLanguage);

    return () => {
      window.removeEventListener("languageChanged", syncLanguage);
      window.removeEventListener("storage", syncLanguage);
    };
  }, []);

  return (
    <div className="footer-container">
      <div className="footer-copyright">
        <div className={`document-page ${isArabic ? "rtl" : "ltr"}`}>
          {isArabic
            ? "© 2025 هيئة تنظيم الخدمات العامة (APSR)."
            : "© 2026 Authority for Public Services Regulation (APSR)."}
        </div>
      </div>
    </div>
  );
};
