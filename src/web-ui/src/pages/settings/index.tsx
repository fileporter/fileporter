import { HeadPart } from "./HeadPart";
import { OpenModePart } from "./OpenModePart";
import { SortModePart } from "./SortModePart";
import { ViewModePart } from "./ViewModePart";


export default function SettingsPage() {
    return <div className="flex flex-col gap-2">
        <HeadPart />
        <ViewModePart />
        <OpenModePart />
        <SortModePart />
    </div>;
}
