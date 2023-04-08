import { QueryClientProvider } from "react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import HookProviders from "~/hooks/HookProviders";
import OfflineHeader from "~/components/OfflineHeader";
import { queryClient } from "./config";
import AppPage from "~/pages/app";
import LoginPage from "~/pages/login";
import SettingsPage from "~/pages/settings";
import URLIndexPage from "~/pages/slash";
import Page404NotFound from "~/pages/Page404NotFound";


export default function ProviderCollection() {
    return <QueryClientProvider client={queryClient}>
        <HookProviders>
            {/* <HashRouter basename={import.meta.env.BASE_URL}> */}
            <HashRouter>
                <OfflineHeader />
                <UIRoutes />
            </HashRouter>
        </HookProviders>
    </QueryClientProvider>
}


export function UIRoutes() {
    return <>
        <Routes>
            <Route path="/">
                <Route index element={<URLIndexPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="~/*" element={<AppPage />} />
                <Route path="*" element={<Page404NotFound />} />
            </Route>
        </Routes>
    </>;
}
