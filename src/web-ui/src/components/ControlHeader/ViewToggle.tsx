import ListViewIcon from "./images/list-view.png";
import IconViewIcon from "./images/grid-view.png";
import GalleryViewIcon from "./images/gallery-view.png";
import { ViewEnum } from "../../common";


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

    return <img className="h-5 my-auto cursor-pointer" alt=""
        onClick={() => props.setCurrentView(getNextView())}
        src={imgMap[props.currentView]}
    />
}
