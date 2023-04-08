import { QueryClient, QueryClientProvider } from "react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { HttpError } from "~/common";
import HookProviders from "~/hooks/HookProviders";
import OfflineHeader from "~/components/OfflineHeader";
import AppPage from "~/pages/app";
import LoginPage from "./pages/login";
import SettingsPage from "./pages/settings";
import URLIndexPage from "./pages/slash";


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error,) => {
                if (error instanceof HttpError) {
                    return false;
                }
                return failureCount > 3;
            }
        }
    }
});


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
            </Route>
        </Routes>
    </>;
}
