import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { HttpError, ViewEnum } from "./common";
import ControlHeader from "./components/ControlHeader";
import ViewManager from "./components/views/ViewManager";


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
    const [currentView, setCurrentView] = useState(ViewEnum.icon);

    return <div>
        <ControlHeader {...{currentView, setCurrentView}} />
        {/* <GalleryView /> */}
        <ViewManager view={currentView} />
    </div>
}
