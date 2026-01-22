import * as React from 'react';
import './Footer.scss';
import { useLocation } from "react-router-dom";
export const FooterHome: React.FunctionComponent = () => {
    const location = useLocation();
    const isArabic = location.state?.isArabic ?? localStorage.getItem("isArabic") === "true";
    return (
        <div className="footer-container">
            <div className="footer-copyright">
                <div className={`document-page ${isArabic ? "rtl" : "ltr"}`}>
                    {isArabic ? "© 2025 هيئة تنظيم الخدمات العامة (APSR)." : "2026 Authority for Public Services Regulation (APSR)."}
                </div>
            </div>
        </div>

    );
};
