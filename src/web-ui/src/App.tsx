import { QueryClientProvider } from "react-query";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { SettingsProvider } from "~/hooks/useSettings";
import ContextMenuProvider from "~/components/ContextMenu/Provider";
import OfflineHeader from "~/components/OfflineHeader";
import { queryClient } from "~/config";
import URLIndexPage from "~/pages/slash";
import LoginPage from "~/pages/login";
import LogoutPage from "~/pages/logout";
import SettingsPage from "~/pages/settings";
import AppPage from "~/pages/app";
import Page404NotFound from "~/pages/Page404NotFound";
import ErrorBoundary from "~/components/ErrorBoundary";
import { useEffect } from "react";


export default function ProviderCollection() {
    return <QueryClientProvider client={queryClient}>
        <SettingsProvider>
            <HashRouter>
                <ContextMenuProvider>
                    <OfflineHeader />
                    <UIRoutes />
                </ContextMenuProvider>
            </HashRouter>
        </SettingsProvider>
    </QueryClientProvider>;
}


export function UIRoutes() {
    const { pathname } = useLocation();

    useEffect(() => {
        const paths = pathname.slice(1).split("/");
        if (paths[0] === "~") {
            document.title = `fileporter - ${paths[paths.length - 1] || "~"}`;
        } else {
            const page = paths[0];
            document.title = `fileporter ~ ${page.charAt(0).toUpperCase()}${page.substring(1).toLowerCase()}`;
        }
    }, [pathname]);

    return <>
        <ErrorBoundary key={pathname}>
            <Routes>
                <Route path="/">
                    <Route index element={<URLIndexPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="logout" element={<LogoutPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="~/*" element={<AppPage />} />
                    <Route path="*" element={<Page404NotFound />} />
                </Route>
            </Routes>
        </ErrorBoundary>
    </>;
}
