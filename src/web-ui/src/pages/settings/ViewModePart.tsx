import OptionSwitch from "./util/OptionSwitch";
import { ViewMode } from "~/common";
import GalleryViewIcon from "@assets/icons/view-mode/gallery-view.png";
import IconViewIcon from "@assets/icons/view-mode/grid-view.png";
import ListViewIcon from "@assets/icons/view-mode/list-view.png";
import Description from "./util/Description";
import { useSetting } from "~/hooks/useSettings";


const descriptions: Record<ViewMode, string> = {
    [ViewMode.icon]: "Displaying the files and directories in a Icon-Grid.",
    [ViewMode.list]: "Displaying the files and directories in a list.",
    [ViewMode.gallery]: "Displaying the files and directories in an Image-Gallery.",
};



export function ViewModePart() {
    const [viewMode, setViewMode] = useSetting("viewMode");

    return <>
        <OptionSwitch current={viewMode} options={[
            {key: ViewMode.icon, imgSrc: IconViewIcon, text: "Icon"},
            {key: ViewMode.list, imgSrc: ListViewIcon, text: "List"},
            {key: ViewMode.gallery, imgSrc: GalleryViewIcon, text: "Gallery"},
        ]} onSwitch={setViewMode} />
        <Description>{descriptions[viewMode]}</Description>
    </>;
}
