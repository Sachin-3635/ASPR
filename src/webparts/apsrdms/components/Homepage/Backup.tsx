// import * as React from "react";
// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import type { IApsrdmsProps } from "../IApsrdmsProps";
// import LibraryOps from "../../../services/bal/Library";
// import { ILibrary } from "../../../services/interface/ILibrary";

// import libraraylogo from "../../assets/img/libraraylogo.png";

// import { spfi, SPFx } from "@pnp/sp/presets/all";
// import "@pnp/sp/folders";
// import "@pnp/sp/files";
// import "@pnp/sp/webs";

// interface IFileItem {
//     Name: string;
//     TimeLastModified: string;
//     AuthorTitle: string;
// }

// export const ASPRDMSHome: React.FC<IApsrdmsProps> = (props) => {
//     const { libraryName } = useParams();

//     const [libraries, setLibraries] = useState<ILibrary[]>([]);
//     const [activeLibrary, setActiveLibrary] = useState<ILibrary | null>(null);
//     const [files, setFiles] = useState<IFileItem[]>([]);
//     const [recentFiles, setRecentFiles] = useState<IFileItem[]>([]);

//     const sp = spfi().using(SPFx(props.context));

//     // Load all libraries
//     useEffect(() => {
//         const loadLibraries = async () => {
//             const libOps = LibraryOps();
//             const allLibs = await libOps.getAllLibraries(props);
//             setLibraries(allLibs);

//             const found = allLibs.find((l) => l.Title === libraryName);
//             if (found) {
//                 setActiveLibrary(found);
//             }
//         };
//         loadLibraries();
//     }, [libraryName]);

//     // Load files when activeLibrary changes
//     useEffect(() => {
//         const loadFiles = async () => {
//             if (!activeLibrary) return;

//             try {
//                 const folder = sp.web.getFolderByServerRelativePath(
//                     activeLibrary.RootFolder.ServerRelativeUrl
//                 );

//                 const items = await folder.files
//                     .select("Name", "TimeLastModified", "Author/Title")
//                     .expand("Author")();

//                 const mappedFiles: IFileItem[] = items.map((f: any) => ({
//                     Name: f.Name,
//                     TimeLastModified: f.TimeLastModified,
//                     AuthorTitle: f.Author?.Title || "",
//                 }));

//                 setFiles(mappedFiles);
//                 setRecentFiles(mappedFiles.slice(0, 5));
//             } catch (err) {
//                 console.error("Error fetching files:", err);
//             }
//         };
//         loadFiles();
//     }, [activeLibrary]);

//     return (
//         <div className="dashboard">
//             <h1 className="heading">Document Management System Dashboard</h1>

//             {/* Library Tabs / Boxes */}
//             <div className="libraryTabs">
//                 {libraries.map((lib) => (
//                     <a
//                         key={lib.Id}
//                         href={`#/library/${lib.Title}`}
//                         className={`libraryBox ${activeLibrary?.Id === lib.Id ? "active" : ""
//                             }`}
//                     >
//                         <div className="circle-icon">
//                             <img src={libraraylogo} alt="Library" />
//                         </div>
//                         <h3 className="libraryName">{lib.Title}</h3>
//                     </a>
//                 ))}
//             </div>

//             {/* Content Section */}
//             <div className="contentSection">
//                 {/* Files Box */}
//                 <div className="box">
//                     <div className="box-header">
//                         <h2>Files in {activeLibrary?.Title}</h2>
//                     </div>

//                     <table className="table">
//                         <thead>
//                             <tr>
//                                 <th>Name</th>
//                                 <th>Modified</th>
//                                 <th>Owner</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {files.length > 0 ? (
//                                 files.map((f, i) => (
//                                     <tr key={i}>
//                                         <td>{f.Name}</td>
//                                         <td>{new Date(f.TimeLastModified).toLocaleDateString()}</td>
//                                         <td>{f.AuthorTitle}</td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan={3} className="noData">
//                                         No files found
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Recent Files Box */}
//                 <div className="box recentFiles">
//                     <div className="box-header">
//                         <h2>Recent Files</h2>
//                     </div>

//                     <ul>
//                         {recentFiles.length > 0 ? (
//                             recentFiles.map((f, i) => (
//                                 <li key={i}>
//                                     {f.Name} ({new Date(f.TimeLastModified).toLocaleDateString()})
//                                 </li>
//                             ))
//                         ) : (
//                             <li>No recent files</li>
//                         )}
//                     </ul>
//                 </div>
//             </div>
//         </div>
//     );
// };




import * as React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { IApsrdmsProps } from "../IApsrdmsProps";
import LibraryOps from "../../services/bal/Library";
import { ILibrary } from "../../services/interface/ILibrary";

import libraraylogo from "../../assets/img/libraraylogo.png";

import { spfi, SPFx } from "@pnp/sp/presets/all";
import "@pnp/sp/folders";
import "@pnp/sp/files";
import "@pnp/sp/webs";


import {
    UploadOutlined, PlusOutlined, EditOutlined,
    FileOutlined, FilePdfOutlined, FileWordOutlined, FileExcelOutlined,
    FilePptOutlined, FileImageOutlined, FileZipOutlined, FileTextOutlined,
    FileMarkdownOutlined, CodeOutlined, FolderOutlined, DownloadOutlined, EyeOutlined, DeleteOutlined
} from "@ant-design/icons";

interface IFileItem {
    Name: string;
    TimeLastModified: string;
    AuthorTitle: string;
    IsFolder: boolean;
    ServerRelativeUrl: string;
}

export const ASPRDMSHome: React.FC<IApsrdmsProps> = (props) => {
    const { libraryName } = useParams();

    const [libraries, setLibraries] = useState<ILibrary[]>([]);
    const [activeLibrary, setActiveLibrary] = useState<ILibrary | null>(null);
    const [files, setFiles] = useState<IFileItem[]>([]);
    const [recentFiles, setRecentFiles] = useState<IFileItem[]>([]);
    const [currentFolder, setCurrentFolder] = useState<string | null>(null);
    const [breadcrumb, setBreadcrumb] = useState<IFileItem[]>([]);

    const sp = spfi().using(SPFx(props.context));

    // Load all libraries
    useEffect(() => {
        const loadLibraries = async () => {
            const libOps = LibraryOps();
            const allLibs = await libOps.getAllLibraries(props);
            setLibraries(allLibs);

            const found = allLibs.find((l) => l.Title === libraryName);
            if (found) {
                setActiveLibrary(found);
                setCurrentFolder(null); // reset to root
                setBreadcrumb([]); // reset breadcrumbs
            }
        };
        loadLibraries();
    }, [libraryName]);

    // Load files/folders when activeLibrary or currentFolder changes
    useEffect(() => {
        const loadFiles = async (folderUrl?: string) => {
            if (!activeLibrary) return;

            try {
                const folder = sp.web.getFolderByServerRelativePath(
                    folderUrl || activeLibrary.RootFolder.ServerRelativeUrl
                );

                // Get subfolders
                const subFolders = await folder.folders
                    .select("Name", "TimeLastModified", "ServerRelativeUrl")();

                // Get files
                const fileItems = await folder.files
                    .select("Name", "TimeLastModified", "Author/Title", "ServerRelativeUrl")
                    .expand("Author")();

                const mappedItems: IFileItem[] = [
                    ...subFolders.map((f: any) => ({
                        Name: f.Name,
                        TimeLastModified: f.TimeLastModified,
                        AuthorTitle: "",
                        IsFolder: true,
                        ServerRelativeUrl: f.ServerRelativeUrl,
                    })),
                    ...fileItems.map((f: any) => ({
                        Name: f.Name,
                        TimeLastModified: f.TimeLastModified,
                        AuthorTitle: f.Author?.Title || "",
                        IsFolder: false,
                        ServerRelativeUrl: f.ServerRelativeUrl,
                    })),
                ];

                setFiles(mappedItems);
                setRecentFiles(mappedItems.filter((i) => !i.IsFolder).slice(0, 5));
            } catch (err) {
                console.error("Error fetching files/folders:", err);
            }
        };

        loadFiles(currentFolder || undefined);
    }, [activeLibrary, currentFolder]);



    // Handle folder/file click
    const handleItemClick = (item: IFileItem) => {
        if (item.IsFolder) {
            setBreadcrumb([...breadcrumb, item]);
            setCurrentFolder(item.ServerRelativeUrl);
        } else {
            window.open(item.ServerRelativeUrl, "_blank");
        }
    };

    // Handle breadcrumb click
    const handleBreadcrumbClick = (index: number) => {
        const newPath = breadcrumb.slice(0, index + 1);
        setBreadcrumb(newPath);
        setCurrentFolder(newPath[newPath.length - 1].ServerRelativeUrl);
    };


    const getFileIcon = (fileName: string, type: "Folder" | "File") => {
        if (type === "Folder") return <FolderOutlined style={{ color: "#fa8c16" }} />;

        const extension = fileName.split(".").pop()?.toLowerCase();

        switch (extension) {
            // <span  style={{  fontSize:"120px" }}>📁</span>
            case "pdf":
                return <FilePdfOutlined style={{ color: "red" }} />;
            case "doc":
            case "docx":
                return <FileWordOutlined style={{ color: "blue", }} />;
            case "xls":
            case "csv":
            case "xlsx":
                return <FileExcelOutlined style={{ color: "green", }} />;
            case "ppt":
            case "pptx":
                return <FilePptOutlined style={{ color: "orange", }} />;
            case "txt":
                return <FileTextOutlined style={{ color: "gray", }} />;
            case "md":
                return <FileMarkdownOutlined style={{ color: "purple", }} />;


            case "jpg":
            case "jpeg":
            case "png":
            case "gif":
            case "bmp":
            case "svg":
            case "webp":
                return <FileImageOutlined style={{ color: "#13c2c2", }} />;

            case "mp4":
            case "avi":
            case "mov":
            case "wmv":
            case "flv":
            case "mkv":
                return <FileOutlined style={{ color: "#722ed1", }} />;

            case "mp3":
            case "wav":
            case "aac":
            case "flac":
            case "ogg":
                return <FileOutlined style={{ color: "#faad14", }} />;

            case "zip":
            case "rar":
            case "7z":
            case "tar":
            case "gz":
                return <FileZipOutlined style={{ color: "#d48806", }} />;

            case "js":
            case "ts":
            case "jsx":
            case "tsx":
            case "html":
            case "css":
            case "scss":
            case "json":
            case "xml":
            case "sql":
            case "py":
            case "java":
            case "c":
            case "cpp":
            case "cs":
            case "php":
            case "rb":
            case "sh":
                return <CodeOutlined style={{ color: "#1890ff", }} />;

            default:
                return <FileOutlined style={{ color: "gray", }} />;
        }
    };


    return (
        <div className="dashboard">
            <h1 className="heading">Document Management System Dashboard</h1>

            {/* Library Tabs / Boxes */}
            <div className="libraryTabs">
                {libraries.map((lib) => (
                    <a
                        key={lib.Id}
                        href={`#/library/${lib.Title}`}
                        className={`libraryBox ${activeLibrary?.Id === lib.Id ? "active" : ""}`}
                    >
                        <div className="circle-icon">
                            <img src={libraraylogo} alt="Library" />
                        </div>
                        <h3 className="libraryName">{lib.Title}</h3>
                    </a>
                ))}
            </div>

            {/* Content Section */}
            <div className="contentSection">
                {/* Files Box */}
                <div className="box">
                    <div className="box-header">
                        <h2>Folders & Files of {activeLibrary?.Title}</h2>
                    </div>

                    {/* Breadcrumbs */}
                    {activeLibrary && (
                        <div className="breadcrumbs">
                            <span
                                className="crumb"
                                onClick={() => {
                                    setBreadcrumb([]);
                                    setCurrentFolder(null);
                                }}
                            >
                                {activeLibrary.Title}
                            </span>
                            {breadcrumb.map((b, i) => (
                                <span key={i}>
                                    {" "}›{" "}
                                    <span
                                        className="crumb"
                                        onClick={() => handleBreadcrumbClick(i)}
                                    >
                                        {b.Name}
                                    </span>
                                </span>
                            ))}
                        </div>
                    )}

                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Modified</th>
                                <th>Owner</th>
                            </tr>
                        </thead>
                        <tbody>
                            {files.length > 0 ? (
                                files.map((f, i) => (
                                    // <tr
                                    //     key={i}
                                    //     onClick={() => handleItemClick(f)}
                                    //     style={{ cursor: "pointer" }}
                                    // >
                                    //     <td>{f.IsFolder ? "📁 " : "📄 "}{f.Name}</td>
                                    //     <td>
                                    //         {f.TimeLastModified
                                    //             ? new Date(f.TimeLastModified).toLocaleDateString()
                                    //             : "-"}
                                    //     </td>
                                    //     <td>{f.AuthorTitle}</td>
                                    // </tr>
                                    <tr
                                        key={i}
                                        onClick={() => {
                                            if (f.IsFolder) {
                                                // Navigate inside folder
                                                handleItemClick(f);
                                            } else {
                                                // Open file in new tab with ?web=1
                                                window.open(`${f.ServerRelativeUrl}?web=1`, "_blank");
                                            }
                                        }}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <td>
                                            {getFileIcon(f.Name, f.IsFolder ? "Folder" : "File")}{" "}
                                            <span style={{ marginLeft: "6px" }}>{f.Name}</span>
                                        </td>
                                        <td>
                                            {f.TimeLastModified
                                                ? new Date(f.TimeLastModified).toLocaleDateString()
                                                : "-"}
                                        </td>
                                        <td>{f.AuthorTitle}</td>
                                    </tr>

                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="noData">
                                        No files or folders found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Recent Files Box */}
                <div className="box recentFiles">
                    <div className="box-header">
                        <h2>Recent Files</h2>
                    </div>

                    <ul>
                        {recentFiles.length > 0 ? (
                            recentFiles.map((f, i) => (
                                <li key={i}>
                                    {f.Name} ({new Date(f.TimeLastModified).toLocaleDateString()})
                                </li>
                            ))
                        ) : (
                            <li>No recent files</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};





