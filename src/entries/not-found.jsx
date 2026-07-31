import React from "react";
import { mountPage } from "../components/SiteShell.jsx";
import { NotFoundPage } from "../pages/NotFoundPage.jsx";

// 404 页面不属于任何导航项，传 null 让导航不高亮任何条目。
mountPage(null, <NotFoundPage />);
