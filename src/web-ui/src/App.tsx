import { QueryClient, QueryClientProvider } from "react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { HttpError } from "~/common";
import ControlHeader from "~/components/ControlHeader";
import ViewManager from "~/components/DirectoryViews/ViewManager";
import HookProviders from "~/hooks/HookProviders";


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


export default function Provider() {
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
        <ControlHeader />
        <ViewManager />
    </>
}
