import OptionSwitch from "./util/OptionSwitch";
import { GalleryMode, ViewMode } from "~/common";
import BookModeIcon from "@assets/icons/gallery-mode/horizontal.png";
import MangaModeIcon from "@assets/icons/gallery-mode/vertical.png";
import Description from "./util/Description";
import { useSetting } from "~/hooks/useSettings";


const descriptions: Record<GalleryMode, string> = {
    [GalleryMode.book]: "Scroll the images horizontally",
    [GalleryMode.manga]: "Scroll the images vertically",
};


export function GalleryModePart() {
    const [viewMode] = useSetting("viewMode");
    const [galleryMode, setGalleryMode] = useSetting("galleryMode");

    if (viewMode !== ViewMode.gallery) {
        return null;
    }

    return <>
        <OptionSwitch current={galleryMode} options={[
            {key: GalleryMode.book, imgSrc: BookModeIcon, text: "Books"},
            {key: GalleryMode.manga, imgSrc: MangaModeIcon, text: "Mangas"},
        ]} onSwitch={setGalleryMode} />
        <Description>{descriptions[galleryMode]}</Description>
    </>;
}
