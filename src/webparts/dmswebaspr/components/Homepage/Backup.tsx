import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import type { IDmswebasprProps } from "../IDmswebasprProps";
import { Modal } from '@fluentui/react';
import LibraryOps from "../../services/bal/Library";
import { ILibrary } from "../../services/interface/ILibrary";
import BannerOps from "../../services/bal/banner";
import { IBanner } from "../../services/interface/IBanner";

import { PeoplePicker, PrincipalType, IPeoplePickerContext } from "@pnp/spfx-controls-react/lib/PeoplePicker";

import { spfi, SPFx } from "@pnp/sp/presets/all";
import "@pnp/sp/folders";
import "@pnp/sp/files";
import "@pnp/sp/webs";

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Table, Button, message, Input } from "antd";

// font family 

import "@fontsource/tajawal";       // Regular 400
import "@fontsource/tajawal/500.css"; // Medium (optional)
import "@fontsource/tajawal/700.css"; // Bold (optional)

// -----------------------------------

import {
    FileOutlined, FilePdfOutlined, FileWordOutlined, FileExcelOutlined,
    FilePptOutlined, FileImageOutlined, FileZipOutlined, FileTextOutlined,
    FileMarkdownOutlined, CodeOutlined, FolderOutlined
} from "@ant-design/icons";

import { DownloadOutlined, DeleteOutlined } from "@ant-design/icons";


// Images import

import logo from "../../assets/img/Logo.png";
import logoname from "../../assets/img/LogoName.png";
import libraraylogo from "../../assets/img/libraraylogo.png";
import DownArrow from "../../assets/img/DownArrow.png";
import Plus from "../../assets/img/Plus.png";
import Upload from "../../assets/img/Upload.png";
import rightblack from "../../assets/img/Rightblack.png";
import leftblack from "../../assets/img/Leftblack.png";

// ----------------------------------------------------------------


interface IFileItem {
    Name: string;
    TimeLastModified: string;
    AuthorTitle: string;
    IsFolder: boolean;
    ServerRelativeUrl: string;
}

export const ASPRDMSHome: React.FC<IDmswebasprProps> = (props) => {
    const { libraryName } = useParams();

    const [firstLibraryName, setFirstLibraryName] = React.useState<string>('');

    const navigate = useNavigate();
    const location = useLocation();

    const [bannerItems, setBannerItems] = React.useState<IBanner[]>();
    const [libraries, setLibraries] = useState<ILibrary[]>([]);
    const [activeLibrary, setActiveLibrary] = useState<ILibrary | null>(null);
    const [files, setFiles] = useState<IFileItem[]>([]);
    const [recentFiles, setRecentFiles] = useState<IFileItem[]>([]);
    const [currentFolder, setCurrentFolder] = useState<string | null>(null);
    const [breadcrumb, setBreadcrumb] = useState<IFileItem[]>([]);

    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);

    const [showModal, setShowModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");

    const [showModalFile, setShowModalFile] = useState(false);
    const [newFile, setNewFile] = useState("");

    const [searchQuery, setSearchQuery] = useState<string>("");

    const [selectedUsers, setSelectedUsers] = React.useState<any[]>([]);
    const [viewUsers, setViewUsers] = useState<any[]>([]);

    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const peoplePickerContext: IPeoplePickerContext = {
        msGraphClientFactory: props.currentSPContext.msGraphClientFactory as unknown as IPeoplePickerContext["msGraphClientFactory"],
        spHttpClient: props.currentSPContext.spHttpClient as unknown as IPeoplePickerContext["spHttpClient"],
        absoluteUrl: props.currentSPContext.pageContext.web.absoluteUrl,
    };

    const [fileList, setFileList] = React.useState<File[]>([]);

    // stop multiclick on folder in table

    const [isNavigating, setIsNavigating] = useState(false);

    // ----------------------------------------------------------


    // 🔹 User profile state
    const [userName, setUserName] = useState<string>("");
    const [userEmail, setUserEmail] = useState<string>("");
    const [userPhotoUrl, setUserPhotoUrl] = useState<string>("");

    const itemsPerPage = 5; // sliding window size
    const [currentIndex, setCurrentIndex] = useState(
        Math.max(libraries.length - itemsPerPage, 0)
    ); // start from the latest 5


    // pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const totalPages = Math.ceil(files.length / pageSize);
    const paginatedFiles = files.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const sp = spfi().using(SPFx(props.context));

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const sp = spfi().using(SPFx(props.currentSPContext));

        // Get first visible document library (BaseTemplate 101 = Document Library)
        sp.web.lists
            .filter("BaseTemplate eq 101 and Hidden eq false")
            .select("Title")
            .top(1)()
            .then((libs) => {
                if (libs.length > 0) {
                    setFirstLibraryName(libs[0].Title);
                }
            })
            .catch((err) => {
                console.error("Error fetching libraries:", err);
            });
    }, [props.currentSPContext]);

    useEffect(() => {
        if (location.pathname.toLowerCase() === '/library' && firstLibraryName) {
            navigate(`/Library/${firstLibraryName}`);
        }
    }, [location.pathname, firstLibraryName]);

    // ✅ Close dropdown if clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // --------------------------------------- Banner part ---------------------------------------

    BannerOps().getTopBanner("*,Id,EncodedAbsUrl,FileLeafRef,FileDirRef,FileRef,FSObjType,Created,Status", "",
        "Status eq 'Active'", { column: 'Created', isAscending: false }, 1000, props)
        .then(results => {
            setBannerItems(results);
        });


    // ----------------------   Banner Slider ---------------------------------

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: true,
    };



    const prevLibrary = () => {
        setCurrentIndex((prev) => Math.min(prev + 1, libraries.length - 1));
    };

    const nextLibrary = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };


    //  ----------------------   Create a folder popup  ----------------------


    const closeModal = () => {
        setShowModal(false);
        setNewFolderName("");
    };

    const closeModalfile = () => {
        setShowModalFile(false);
        setNewFile("");
    };
    // ------------------------------------------------------------------


    // Get current 5 libraries
    const visibleLibraries = libraries.slice(
        currentIndex,
        currentIndex + itemsPerPage
    );

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const renderPageNumbers = () => {
        const pages: (number | string)[] = [];
        const firstVisible = 2; // show first 2
        const lastVisible = 2;  // show last 2

        if (totalPages <= 7) {
            // Show all if small
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            // Always show first 2
            for (let i = 1; i <= firstVisible; i++) pages.push(i);

            if (currentPage > firstVisible + 2) {
                // Add dots if we skipped some
                pages.push("...");
            }

            // Middle pages (only if not near start or end)
            if (currentPage > firstVisible && currentPage < totalPages - lastVisible + 1) {
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
            }

            if (currentPage < totalPages - lastVisible - 1) {
                // Add dots if we skipped some
                pages.push("...");
            }

            // Always show last 2
            for (let i = totalPages - lastVisible + 1; i <= totalPages; i++) {
                pages.push(i);
            }
        }

        return pages;
    };

    const toggleDropdown = () => setIsOpen(!isOpen);

    // 🔹 Utility: Recursively fetch files
    const getAllFilesRecursive = async (folderUrl: string): Promise<IFileItem[]> => {
        const folder = sp.web.getFolderByServerRelativePath(folderUrl);

        // Files in current folder
        const files = await folder.files
            .select("Name", "TimeLastModified", "Author/Title", "ServerRelativeUrl")
            .expand("Author")();

        const mappedFiles: IFileItem[] = files.map((f: any) => ({
            Name: f.Name,
            TimeLastModified: f.TimeLastModified,
            AuthorTitle: f.Author?.Title || "",
            IsFolder: false,
            ServerRelativeUrl: f.ServerRelativeUrl,
        }));

        // Subfolders
        const subFolders = await folder.folders.select("Name", "ServerRelativeUrl")();

        for (const sf of subFolders) {
            const subFiles = await getAllFilesRecursive(sf.ServerRelativeUrl);
            mappedFiles.push(...subFiles);
        }

        return mappedFiles;
    };


    // 🔹 Fetch Current Logged-in User
    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const user = await sp.web.currentUser();
                setUserName(user.Title);
                setUserEmail(user.Email);
                setUserPhotoUrl(
                    `${window.location.origin}/_layouts/15/userphoto.aspx?size=L&username=${user.Email}`
                );
            } catch (err) {
                console.error("Error fetching user details:", err);
            }
        };
        loadUserProfile();
    }, []);

    // ----------------------------------------------------

    // 🔹 Load all libraries
    
    useEffect(() => {
        const loadLibraries = async () => {
            const libOps = LibraryOps();
            const allLibs = await libOps.getAllLibraries(props);
            setLibraries(allLibs);

            const found = allLibs.find((l) => l.Title === libraryName);
            if (found) {
                setActiveLibrary(found);
                setCurrentFolder(null);
                setBreadcrumb([]);
            }
        };
        loadLibraries();
    }, [libraryName]);

    const currentPath = location.pathname.toLowerCase();
    const isDashboard = currentPath.includes("/dashboard");
    const isHome = currentPath.startsWith("/library/");
    const activeTab = isDashboard ? "Dashboard" : isHome ? "Home" : "";

    // 🔹 Load files/folders for browsing
    useEffect(() => {
        const loadFiles = async (folderUrl?: string) => {
            if (!activeLibrary) return;

            try {
                const folder = sp.web.getFolderByServerRelativePath(
                    folderUrl || activeLibrary.RootFolder.ServerRelativeUrl
                );

                const subFolders = await folder.folders
                    .select("Name", "TimeLastModified", "ServerRelativeUrl")();

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
            } catch (err) {
                console.error("Error fetching files/folders:", err);
            }
        };

        loadFiles(currentFolder || undefined);
    }, [activeLibrary, currentFolder]);

    // 🔹 Load recent files across entire library
    useEffect(() => {
        const loadRecentFilesFromLibrary = async () => {
            if (!activeLibrary) return;

            try {
                const allFiles = await getAllFilesRecursive(activeLibrary.RootFolder.ServerRelativeUrl);

                const sorted = allFiles.sort(
                    (a, b) =>
                        new Date(b.TimeLastModified).getTime() -
                        new Date(a.TimeLastModified).getTime()
                );

                setRecentFiles(sorted.slice(0, 5)); // top 5 recent
            } catch (err) {
                console.error("Error loading recent files:", err);
            }
        };

        if (activeLibrary) {
            loadRecentFilesFromLibrary();
        }
    }, [activeLibrary]);

    // 🔹 Handle item click

    const handleItemClick = async (item: IFileItem) => {
        if (isNavigating) return; // 🚫 ignore extra clicks

        if (item.IsFolder) {
            setIsNavigating(true); // ⏳ lock clicks
            setBreadcrumb((prev) => [...prev, item]);
            setCurrentFolder(item.ServerRelativeUrl);

            // optional: small delay so double clicks don’t fire again
            setTimeout(() => setIsNavigating(false), 500);
        } else {
            window.open(item.ServerRelativeUrl + "?web=1", "_blank");
        }
    };

    // 🔹 Handle breadcrumb click

    const handleBreadcrumbClick = (index: number) => {
        if (isNavigating) return;

        setIsNavigating(true);
        const newPath = breadcrumb.slice(0, index + 1);
        setBreadcrumb(newPath);
        setCurrentFolder(newPath[newPath.length - 1].ServerRelativeUrl);

        setTimeout(() => setIsNavigating(false), 500);
    };

    const filteredLibraries = (searchQuery
        ? libraries.filter((lib) =>
            lib.Title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : visibleLibraries
    );

    return (
        <div className="dashboard">

            <div className="Navbarstrip">
            <div className="Headingstrip">
                {/* Left - Logo */}
                <div className="mainlogo">
                    <img src={logo} className="logo" />
                    <img src={logoname} alt="" className="logoname" />
                </div>

                {/* Center - Heading */}
                <h1 className="heading">Document Management System Dashboard </h1>

                {/* Right - User Profile */}
                <div className="userProfile">
                    {userPhotoUrl && <img src={userPhotoUrl} alt="User Profile" />}
                    <div>
                        <span>{userName}</span>
                    </div>
                </div>
            </div>
            <div className="Headline"></div>
            <div className="topbannerbox">
                <div className="LibSearch">
                    {/* Search Input */}
                    <Input.Search
                        placeholder="Find a Library"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="Sealib"
                        allowClear
                    />
                </div>
                <div className="navmainsection">
                    <ul className="nav-tabs">

                        <li
                            className={activeTab === "Home" ? "active" : ""}
                            onClick={() => {
                                if (libraryName) {
                                    navigate(`/library/${libraryName}`);
                                } else if (firstLibraryName) {
                                    // fallback if no current library
                                    navigate(`/library/${firstLibraryName}`);
                                }
                            }}
                        >
                            Home
                        </li>

                        <li
                            className={activeTab === "Dashboard" ? "active" : ""}
                            onClick={() => navigate("/dashboard")}
                        >
                            Dashboard
                        </li>
                    </ul>
                </div>
            </div>
            </div>

            {/* Library Tabs */}

            <div className="block-banner">
                <div className="carousel-container">

                    {bannerItems && bannerItems.length > 0 ? (
                        bannerItems.length === 1 ? (
                            <div>
                                <div className="banner-container">
                                    <img src={bannerItems[0].EncodedAbsUrl} className="banner-image" />
                                </div>
                                <div className="Headingtitle">

                                </div>
                            </div>
                        ) : (
                            <Slider {...sliderSettings}>
                                {bannerItems.map((item) => (
                                    <div key={item.Id}>
                                        <div className="banner-container">
                                            <img src={item.EncodedAbsUrl} alt={item.Title} className="banner-image" />
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        )
                    ) : (
                        <p>No banners available</p>
                    )}

                </div>
            </div>

            <div className="libraryContainer">
                {/* Heading + Dropdown */}

                {/* Repository Boxes */}
                <div className="librarySliderWrapper">

                    <div className="libraryTabs">
                        {filteredLibraries.length > 0 ? (
                            filteredLibraries.map((lib) => (
                                <a
                                    key={lib.Id}
                                    href={`#/library/${lib.Title}`}
                                    className={`circleBox ${activeLibrary?.Id === lib.Id ? "active" : ""}`}
                                >
                                    <div className="circle-icon">
                                        <img src={libraraylogo} alt="Library" />
                                        <p className="circleName">{lib.Title}</p>
                                    </div>
                                </a>
                            ))
                        ) : (
                            <p style={{ textAlign: "center", marginTop: "20px" }}>No libraries found</p>
                        )}
                    </div>

                    {!searchQuery && (
                        <div className="sliderButtons">
                            <button className="sliderBtn left" onClick={nextLibrary} disabled={currentIndex === 0}>
                                <img src={leftblack} alt="Previous" className="iconblack" />
                            </button>
                            <button
                                className="sliderBtn right"
                                onClick={prevLibrary}
                                disabled={currentIndex + itemsPerPage >= libraries.length}
                            >
                                <img src={rightblack} alt="Next" className="iconblack" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="Buttondrop">
                <div className="libhead">
                    <div className="dropdown" ref={dropdownRef}>
                        <button className="dropbtn" onClick={toggleDropdown}>
                            Create & Upload <img src={DownArrow} className="downArrow" />
                        </button>

                        <div className={`dropdown-content ${isOpen ? "show" : ""}`}>
                            <a onClick={() => { setShowModal(true); setIsOpen(false); }} className="cursor"><span className="icon"><img src={Plus} alt="" /></span> New Folder</a>
                            <a onClick={() => { setShowModalFile(true); setIsOpen(false); }} className="cursor"><span className="icon"><img src={Upload} alt="" /></span> Upload File</a>
                            <Link to="/Request" target="_blank"><span className="icon"><img src={Plus} alt="" /></span> Create Repository</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="contentSection">
                {/* Files Table */}

                <div className="block">
                    <div className="box-header">
                        <h2>Folders & Files of {activeLibrary?.Title}</h2>
                    </div>
                    <div className="box">

                        {activeLibrary && (
                            <div className="arrow-breadcrumbs">
                                <div
                                    className="arrow-crumb"
                                    onClick={() => {
                                        setBreadcrumb([]);
                                        setCurrentFolder(null);
                                    }}
                                >
                                    {activeLibrary.Title}
                                </div>

                                {breadcrumb.map((b, i) => (
                                    <div
                                        key={i}
                                        className="arrow-crumb"
                                        onClick={() => handleBreadcrumbClick(i)}
                                    >
                                        {b.Name}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Files Table */}
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Modified</th>
                                    <th>Owner</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedFiles.length > 0 ? (
                                    paginatedFiles.map((f, i) => (
                                        <tr
                                            key={i}
                                            onClick={() => handleItemClick(f)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <td>
                                                {(f.Name, f.IsFolder ? "Folder" : "File")}{" "}
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
                                        <td colSpan={4} className="noData">
                                            No files or folders found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Numbered Pagination */}
                        {files.length > pageSize && (

                            <div className="pagination">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    «
                                </button>

                                {renderPageNumbers().map((p, index) =>
                                    p === "..." ? (
                                        <span key={index} className="dots">...</span>
                                    ) : (
                                        <button
                                            key={p}
                                            className={p === currentPage ? "active" : ""}
                                            onClick={() => handlePageChange(Number(p))}
                                        >
                                            {p}
                                        </button>
                                    )
                                )}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    »
                                </button>
                            </div>

                        )}

                    </div>
                </div>

                {/* Recent Files */}
                <div className="block">
                    <div className="box-headersec">
                        <h2>Recent Files</h2>
                    </div>
                    <div className="box recentFiles">
                        <ul>

                            {recentFiles.length > 0 ? (
                                recentFiles.map((f, i) => (
                                    <li
                                        key={i}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => window.open(f.ServerRelativeUrl + "?web=1", "_blank")}
                                    >
                                        {(f.Name, "File")}{" "}
                                        <span style={{ marginLeft: "6px" }}>{f.Name}</span>{" "}
                                        ({new Date(f.TimeLastModified).toLocaleDateString()})
                                    </li>
                                ))
                            ) : (
                                <li>No recent files</li>
                            )}

                        </ul>

                    </div>
                </div>
            </div>

        </div >
    );
};
