import Header from "./Header";
import ScrollProgressFix from "./ScrollProgressFix";
import ViewHandler from "./ViewHandler";


export default function AppPage() {
    return <div className="grid grid-cols-[1fr] grid-rows-[auto,1fr] min-h-screen">
        <ScrollProgressFix />
        <Header />
        <main className="max-w-[100vw]">
            <ViewHandler />
        </main>
    </div>;
}
