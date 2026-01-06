import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { IApsrdmsSolutionProps } from "../IApsrdmsSolutionProps";
import { spfi, SPFx } from "@pnp/sp/presets/all";

import logo from "../../assets/img/Logo.png";
import logoname from "../../assets/img/LogoName.png";

export const Dashboard: React.FC<IApsrdmsSolutionProps> = (props) => {
    const sp = spfi().using(SPFx(props.context));
    const navigate = useNavigate();
    const location = useLocation();

    const [userName, setUserName] = useState<string>("");
    const [userPhotoUrl, setUserPhotoUrl] = useState<string>("");

    // ✅ new state for library
    const [firstLibraryName, setFirstLibraryName] = useState<string>("");

    // Libraries to exclude
    const excludeLibraries = [
        "Documents",
        "Form Templates",
        "Site Assets",
        "Site Pages",
        "Style Library",
        "Images",
        "Site Collection Documents",
        "Site Collection Images",
        "Customized Reports",
        "Pages",
        "Banner", // 👈 exclude Banner
        "MicroFeed"
    ];

    // Fetch user profile
    useEffect(() => {
        const loadUser = async () => {
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
        loadUser();
    }, []);

    // ✅ fetch first non-excluded document library
    useEffect(() => {
        const spLocal = spfi().using(SPFx(props.currentSPContext));

        spLocal.web.lists
            .filter("BaseTemplate eq 101 and Hidden eq false")
            .select("Title")()
            .then((libs) => {
                const validLib = libs.find(l => !excludeLibraries.includes(l.Title));
                if (validLib) {
                    setFirstLibraryName(validLib.Title);
                }
            })
            .catch((err) => {
                console.error("Error fetching libraries:", err);
            });
    }, [props.currentSPContext]);

    // ✅ redirect if /library path is hit directly
    useEffect(() => {
        if (location.pathname.toLowerCase() === "/library" && firstLibraryName) {
            navigate(`/Library/${firstLibraryName}`);
        }
    }, [location.pathname, firstLibraryName]);

    // 🔹 Active tab detection
    const currentPath = location.pathname.toLowerCase();
    const isDashboard = currentPath.includes("/dashboard");
    const isHome = currentPath.startsWith("/library/");
    const activeTab = isDashboard ? "Dashboard" : isHome ? "Home" : "";

    return (
        <div className="dashboard">
            <div className="Navbarstrip">
                <div className="Headingstrip">
                    <div className="mainlogo">
                        <img src={logo} className="logo" />
                        <img src={logoname} alt="" className="logoname" />
                    </div>

                    <h1 className="heading">Document Management System Dashboard</h1>

                    <div className="userProfile">
                        {userPhotoUrl && <img src={userPhotoUrl} alt="User Profile" />}
                        <div>
                            <span>{userName}</span>
                        </div>
                    </div>
                </div>
                <div className="Headline"></div>
                {/* Navigation Tabs */}
                <div className="topbannerboxDashboard">
                    <div className="navmainsection">
                        <ul className="nav-tabs" style={{ margin: "4px" }}>
                            <li
                                className={activeTab === "Home" ? "active" : ""}
                                onClick={() =>
                                    firstLibraryName && navigate(`/library/${firstLibraryName}`)
                                }
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
        </div>
    );
};
