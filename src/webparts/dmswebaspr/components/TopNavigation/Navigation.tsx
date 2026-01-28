// import * as React from "react";
// import { useState, useEffect, useRef } from "react";

// import { Input } from "antd";
// import { spfi, SPFx } from "@pnp/sp/presets/all";
// import "@pnp/sp/folders";
// import "@pnp/sp/files";
// import "@pnp/sp/webs";

// // font family 

// import "@fontsource/tajawal";       // Regular 400
// import "@fontsource/tajawal/500.css"; // Medium (optional)
// import "@fontsource/tajawal/700.css"; // Bold (optional)

// import "@fortawesome/fontawesome-free/css/all.min.css";


// // Images import

// import logo from "../../assets/img/Logo.png";
// import logoname from "../../assets/img/LogoName.png";

// import LibraryOps from "../../services/bal/Library";
// import { ILibrary } from "../../services/interface/ILibrary";

// export const TopNavigation: React.FunctionComponent = () => {
//     // States for user data
//     const [userName, setUserName] = React.useState<string>('');
//     const [activeLibrary, setActiveLibrary] = useState<ILibrary | null>(null);
//     const [visibleDropdown, setVisibleDropdown] = React.useState<string | null>(null);
//     const [userPhotoUrl, setUserPhotoUrl] = React.useState<string>('');

//     // 🔹 Language State
//     const [language, setLanguage] = useState<"en" | "ar">("en");
//     const [searchQuery, setSearchQuery] = useState<string>("");

//     const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
//     const [baseLibraries, setBaseLibraries] = useState([]);
//     const [translatedLibraries, setTranslatedLibraries] = useState([]);
//     const [isArabic, setIsArabic] = useState(false);

//     // Fetch user details when the component mounts
//     React.useEffect(() => {

//     }, []);

//     // 🔹 Utility: Recursively fetch files
//     const getAllFilesRecursive = async (folderUrl: string): Promise<IFileItem[]> => {
//         const folder = sp.web.getFolderByServerRelativePath(folderUrl);

//         if (folderUrl.toLowerCase().endsWith("/forms")) {
//             return [];
//         }

//         const files = await folder.files
//             .select("Name", "FullName", "TimeLastModified", "Author/Title", "ServerRelativeUrl")
//             .expand("Author")();

//         // ✅ Use Promise.all so translation can use await
//         const mappedFiles: IFileItem[] = await Promise.all(
//             files.map(async (f: any) => {
//                 const translatedName = isArabic
//                     ? await translateText(f.Name, "ar")
//                     : f.Name;

//                 return {
//                     Name: f.Name,
//                     FullName: f.FullName,
//                     TimeLastModified: f.TimeLastModified,
//                     AuthorTitle: f.Author?.Title || "",
//                     IsFolder: false,
//                     ServerRelativeUrl: f.ServerRelativeUrl,
//                     TranslatedName: translatedName
//                 };
//             })
//         );

//         const subFolders = await folder.folders.select("Name", "ServerRelativeUrl")();

//         for (const sf of subFolders) {
//             if (sf.Name !== "Forms") {
//                 const subFiles = await getAllFilesRecursive(sf.ServerRelativeUrl);
//                 mappedFiles.push(...subFiles);
//             }
//         }

//         return mappedFiles;
//     };


//     // Dynamic Translation
//     const handleTranslateClick = async () => {
//         const targetLang = isArabic ? "en" : "ar";

//         // 🔹 Translate libraries only once
//         if (!isArabic && translatedLibraries.length === 0) {
//             const translatedLibs = await Promise.all(
//                 baseLibraries.map(async (lib) => {
//                     const translatedTitle = await translateText(lib.Title, targetLang);
//                     return { ...lib, TranslatedTitle: translatedTitle };
//                 })
//             );

//             setTranslatedLibraries(translatedLibs);

//             if (activeLibrary) {
//                 const updatedActive = translatedLibs.find(
//                     l => l.Id === activeLibrary.Id
//                 );
//                 setActiveLibrary(updatedActive || null);
//             }
//         }

//         const nextIsArabic = !isArabic;

//         // ✅ SAVE GLOBALLY
//         localStorage.setItem("isArabic", nextIsArabic.toString());

//         setIsArabic(nextIsArabic);
//         setLanguage(nextIsArabic ? "ar" : "en");
//         setCurrentIndex(0);
//     };

//     return (
//         <div className="Navbarstrip">
//             <div className="Headingstrip">
//                 {/* Left - Logo */}
//                 <div className="mainlogo">
//                     <img src={logo} className="logo" />
//                     <img src={logoname} alt="" className="logoname" />
//                 </div>

//                 {/* Center - Heading */}
//                 <h1 className="heading"> {isArabic ? "لوحة معلومات نظام إدارة المستندات" : "Document Management System Dashboard"} </h1>

//                 {/* Right - User Profile */}
//                 <div className="userProfile">
//                     {userPhotoUrl && <img src={userPhotoUrl} alt="User Profile" />}
//                     <div>
//                         <span>{userName}</span>
//                     </div>
//                 </div>
//             </div>
//             <div className="Headline"></div>
//             <div className={isArabic ? "erp-topbannerbox" : "topbannerbox"}>
//                 <div className="navmainsection">
//                     <ul className="nav-tabs">
//                         <li>
//                             <div className={isArabic ? "erp-lang-toggle" : "lang-toggle"}>
//                                 <button
//                                     className={`lang-btn ${language === "en" ? "active" : ""}`}
//                                     onClick={handleTranslateClick}
//                                 >
//                                     {/* <span className="icon">🌐</span> */}
//                                     <i className="fas fa-globe-americas icon"></i>
//                                     ENG
//                                 </button>

//                                 <button
//                                     className={`lang-btn ${language === "ar" ? "active" : ""}`}
//                                     onClick={handleTranslateClick}
//                                 >
//                                     {/* <span className="icon">🌐</span> */}
//                                     <i className="fas fa-globe-asia icon"></i>
//                                     العربية
//                                 </button>
//                             </div>

//                         </li>

//                     </ul>
//                 </div>
//                 <div className="LibSearch">
//                     {/* Search Input */}
//                     <Input.Search
//                         placeholder="Find a Library"
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         className="Sealib"
//                         allowClear
//                     />
//                 </div>
//             </div>
//             <div className="Headlinetwo"></div>
//         </div>
//     );
// };



import * as React from "react";
import { useState, useEffect } from "react";
import { Input } from "antd";
import "@fontsource/tajawal";
import "@fortawesome/fontawesome-free/css/all.min.css";

import logo from "../../assets/img/Logo.png";
import logoname from "../../assets/img/LogoName.png";

import { spfi, SPFx } from "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import { IDmswebasprProps } from "../IDmswebasprProps";

export const TopNavigation: React.FC<IDmswebasprProps> = (props) => {
  // ✅ Navigation owns language
  const [isArabic, setIsArabic] = useState<boolean>(
    localStorage.getItem("isArabic") === "ar"
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState("User");
  const [userPhotoUrl, setUserPhotoUrl] = useState("");

  const sp = props.context
    ? spfi().using(SPFx(props.context))
    : null;

    useEffect(() => {
  const savedLang = localStorage.getItem("isArabic");

  // 🔹 Force Arabic on first load
  if (!savedLang) {
    localStorage.setItem("isArabic", "ar");

    // 🔥 notify all pages
    window.dispatchEvent(new Event("languageChanged"));
  }
}, []);

  useEffect(() => {
    if (!sp) return;

    const loadUserProfile = async () => {
      try {
        const user = await sp.web.currentUser();
        setUserName(user.Title);
        setUserPhotoUrl(
          `${window.location.origin}/_layouts/15/userphoto.aspx?size=L&username=${user.Email}`
        );
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };

    loadUserProfile();
  }, [sp]);
const handleTranslateClick = () => {
  const next = !isArabic;
  setIsArabic(next);
  localStorage.setItem("isArabic", next ? "ar" : "en");
  window.dispatchEvent(new Event("languageChanged"));
};

  return (
    <div className="Navbarstrip" dir={isArabic ? "rtl" : "ltr"}>
      <div className="Headingstrip">
        <div className="mainlogo">
          <img src={logo} className="logo" />
          <img src={logoname} className="logoname" />
        </div>

        <h1 className="heading">
          {isArabic
            ? "لوحة معلومات نظام إدارة المستندات"
            : "Document Management System Dashboard"}
        </h1>

        <div className="userProfile">
          {userPhotoUrl && <img src={userPhotoUrl} alt="User" />}
          <span>{userName}</span>
        </div>
      </div>

      <div className="Headline"></div>

      <div className={isArabic ? "erp-topbannerbox" : "topbannerbox"}>
        <div className="navmainsection">
          <div className={isArabic ? "erp-lang-toggle" : "lang-toggle"}>
            <button
              className={`lang-btn ${!isArabic ? "active" : ""}`}
              onClick={handleTranslateClick}
            >
              <i className="fas fa-globe-americas icon"></i> ENG
            </button>

            <button
              className={`lang-btn ${isArabic ? "active" : ""}`}
              onClick={handleTranslateClick}
            >
              <i className="fas fa-globe-asia icon"></i> العربية
            </button>
          </div>
        </div>

        <div className="LibSearch">
          <Input.Search
            placeholder={isArabic ? "ابحث عن مكتبة" : "Find a Library"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
          />
        </div>
      </div>

      <div className="Headlinetwo"></div>
    </div>
  );
};
