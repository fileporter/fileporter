import { QueryClientProvider } from "react-query";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { Provider as SettingsProvider } from "~/hooks/useSettings";
import OfflineHeader from "~/components/OfflineHeader";
import { queryClient } from "./config";
import AppPage from "~/pages/app";
import LoginPage from "~/pages/login";
import SettingsPage from "~/pages/settings";
import URLIndexPage from "~/pages/slash";
import Page404NotFound from "~/pages/Page404NotFound";
import LogoutPage from "./pages/logout";
import ErrorBoundary from "./components/ErrorBoundary";


export default function ProviderCollection() {
    return <QueryClientProvider client={queryClient}>
        <SettingsProvider>
            <HashRouter>
                <OfflineHeader />
                <UIRoutes />
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
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="~/*" element={<AppPage />} />
                    <Route path="*" element={<Page404NotFound />} />
                </Route>
            </Routes>
        </ErrorBoundary>
    </>;
}
