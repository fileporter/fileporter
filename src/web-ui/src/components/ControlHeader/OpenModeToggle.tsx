import ReactDOM from "react-dom";
import FileModeIcon from "./images/file-mode.png";
import BrowserModeIcon from "./images/browser-mode.png";
import { OpenMode } from "~/common/";


interface Props {
    openMode: OpenMode
    setOpenMode: (v: OpenMode) => void,
}


export default function ViewToggle(props: Props) {
    const header = document.getElementById("control-header");
    if (!header) {
        return null;
    }

    return ReactDOM.createPortal(<>
        <img className="order-10 h-5 my-auto cursor-pointer" alt="" title="how to open files"
            onClick={() => props.setOpenMode(props.openMode === OpenMode.intern ? OpenMode.browser : OpenMode.intern)}
            src={props.openMode === OpenMode.intern ? FileModeIcon : BrowserModeIcon}
        />
    </>, header)
}
