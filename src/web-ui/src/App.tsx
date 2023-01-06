import { QueryClient, QueryClientProvider } from "react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { HttpError } from "./common";
import ControlHeader from "./components/ControlHeader";
import IconView from "./components/views/icon";
// import ListView from "./components/views/list";


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
        <HashRouter>
            <Routes>
                <Route path="*" element={<App />} />
            </Routes>
        </HashRouter>
    </QueryClientProvider>
}


function App() {
    return <div>
        <ControlHeader />
        <IconView />
        {/* <ListView /> */}
    </div>
}
