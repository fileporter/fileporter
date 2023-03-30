import ReactDOM from "react-dom";
import { ViewMode } from "~/common/";
import ListViewIcon from "@assets/icons/list-view.png";
import IconViewIcon from "@assets/icons/grid-view.png";
import GalleryViewIcon from "@assets/icons/gallery-view.png";
import useViewMode from "~/hooks/useViewMode";


const imgMap = {
    [ViewMode.icon]: IconViewIcon,
    [ViewMode.list]: ListViewIcon,
    [ViewMode.gallery]: GalleryViewIcon,
}


export default function ViewToggle() {
    const [viewMode, setViewMode] = useViewMode();

    const header = document.getElementById("control-header");
    if (!header) return null;

    function getNextView() {
        switch(viewMode) {
            case ViewMode.icon:
                return ViewMode.list;
            case ViewMode.list:
                return ViewMode.gallery;
            case ViewMode.gallery:
            default:
                return ViewMode.icon;
        }
    }

    return ReactDOM.createPortal(<>
        <img className="order-10 h-5 my-auto cursor-pointer" alt="" title="how to view directories"
            onClick={() => setViewMode(getNextView())}
            src={imgMap[viewMode]}
        />
    </>, header)
}
