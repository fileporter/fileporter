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
import SearchPage from "./pages/search";


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
    return <>
        <ErrorBoundary key={pathname}>
            <Routes>
                <Route path="/">
                    <Route index element={<URLIndexPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="logout" element={<LogoutPage />} />
                    <Route path="search" element={<SearchPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="~/*" element={<AppPage />} />
                    <Route path="*" element={<Page404NotFound />} />
                </Route>
            </Routes>
        </ErrorBoundary>
    </>;
}
