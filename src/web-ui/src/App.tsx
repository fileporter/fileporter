import { QueryClient, QueryClientProvider } from "react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { HttpError } from "~/common";
import ControlHeader from "~/components/ControlHeader";
import ViewManager from "~/components/ViewManager";
import HookProviders from "~/hooks/HookProviders";
import OfflineHeader from "./components/OfflineHeader";


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
            <HashRouter>
                <Routes>
                    <Route path="*" element={<App />} />
                </Routes>
            </HashRouter>
        </HookProviders>
    </QueryClientProvider>
}


function App() {
    return <>
        <OfflineHeader />
        <ControlHeader />
        <ViewManager />
    </>
}
