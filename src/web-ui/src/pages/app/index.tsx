import Header from "./Header";
import ScrollProgressFix from "./ScrollProgressFix";
import ViewHandler from "./ViewHandler";


export default function AppPage() {
    return <div className="flex flex-col h-screen">
        <ScrollProgressFix />
        <Header />
        <main className="grow">
            <ViewHandler />
        </main>
    </div>;
}
