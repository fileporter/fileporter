import ReactDOM from "react-dom";
import { ViewMode } from "~/common/";
import ListViewIcon from "@assets/icons/list-view.png";
import IconViewIcon from "@assets/icons/grid-view.png";
import GalleryViewIcon from "@assets/icons/gallery-view.png";


interface Props {
    currentView: ViewMode
    setCurrentView: (v: ViewMode) => void,
}

const imgMap = {
    [ViewMode.icon]: IconViewIcon,
    [ViewMode.list]: ListViewIcon,
    [ViewMode.gallery]: GalleryViewIcon,
}


export default function ViewToggle(props: Props) {
    const header = document.getElementById("control-header");
    if (!header) {
        return null;
    }

    function getNextView() {
        switch(props.currentView) {
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
            onClick={() => props.setCurrentView(getNextView())}
            src={imgMap[props.currentView]}
        />
    </>, header)
}
