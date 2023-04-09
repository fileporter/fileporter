import Header from "./Header";
import ScrollProgressFix from "./ScrollProgressFix";
import ViewHandler from "./ViewHandler";


export default function AppPage() {
    return <>
        <ScrollProgressFix />
        <Header />
        <ViewHandler />
    </>;
}
