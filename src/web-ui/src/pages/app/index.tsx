import ControlHeader from "./Header";
import ScrollProgressFix from "./ScrollProgressFix";
import ViewHandler from "./ViewHandler";


export default function AppPage() {
    return <>
        <ScrollProgressFix />
        <ControlHeader />
        <ViewHandler />
    </>;
}
