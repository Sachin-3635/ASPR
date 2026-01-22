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