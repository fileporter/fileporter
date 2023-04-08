import ControlHeader from "~/components/ControlHeader";
import ScrollProgressFix from "~/components/ScrollProgressFix";
import ViewManager from "~/components/ViewManager";


export default function AppPage() {
    return <>
        <ScrollProgressFix />
        <ControlHeader />
        <ViewManager />
    </>;
}
