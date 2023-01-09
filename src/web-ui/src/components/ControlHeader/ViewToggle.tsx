import ReactDOM from "react-dom";
import { ViewEnum } from "../../common";
import ListViewIcon from "./images/list-view.png";
import IconViewIcon from "./images/grid-view.png";
import GalleryViewIcon from "./images/gallery-view.png";


interface Props {
    currentView: ViewEnum
    setCurrentView: (v: ViewEnum) => void,
}

const imgMap = {
    [ViewEnum.icon]: IconViewIcon,
    [ViewEnum.list]: ListViewIcon,
    [ViewEnum.gallery]: GalleryViewIcon,
}


export default function ViewToggle(props: Props) {
    const header = document.getElementById("control-header");
    if (!header) {
        return null;
    }

    function getNextView() {
        switch(props.currentView) {
            case ViewEnum.icon:
                return ViewEnum.list;
            case ViewEnum.list:
                return ViewEnum.gallery;
            case ViewEnum.gallery:
            default:
                return ViewEnum.icon;
        }
    }

    return ReactDOM.createPortal(<>
        <img className="h-5 my-auto cursor-pointer" alt="" title="how to view directories"
            onClick={() => props.setCurrentView(getNextView())}
            src={imgMap[props.currentView]}
        />
    </>, header)
}
