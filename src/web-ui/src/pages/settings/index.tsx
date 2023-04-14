import FooterPart from "./FooterPart";
import { HeadPart } from "./HeadPart";
import LogoutPart from "./LogoutPart";
import { OpenModePart } from "./OpenModePart";
import { SortModePart } from "./SortModePart";
import { ViewModePart } from "./ViewModePart";


export default function SettingsPage() {
    return <div className="flex flex-col items-center min-h-screen gap-2">
        <HeadPart />
        <ViewModePart />
        <OpenModePart />
        <SortModePart />
        <Grow />
        <LogoutPart />
        <FooterPart />
    </div>;
}


function Grow() {
    return <div className="grow" />;
}
