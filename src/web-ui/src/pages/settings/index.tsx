import { HeadPart } from "./HeadPart";
import { OpenModePart } from "./OpenModePart";
import { SortModePart } from "./SortModePart";
import { ViewModePart } from "./ViewModePart";


export default function SettingsPage() {
    return <>
        <HeadPart />
        <ViewModePart />
        <OpenModePart />
        <SortModePart />    
    </>;
}
