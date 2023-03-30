import ReactDOM from "react-dom";
import FileModeIcon from "@assets/icons/file-mode.png";
import BrowserModeIcon from "@assets/icons/browser-mode.png";
import { OpenMode } from "~/common/";
import useOpenMode from "~/hooks/useOpenMode";


export default function ViewToggle() {
    const [openMode, setOpenMode] = useOpenMode();

    const header = document.getElementById("control-header");
    if (!header) return null;

    return ReactDOM.createPortal(<>
        <img className="order-10 h-5 my-auto cursor-pointer" alt="" title="how to open files"
            onClick={() => setOpenMode(openMode === OpenMode.intern ? OpenMode.browser : OpenMode.intern)}
            src={openMode === OpenMode.intern ? FileModeIcon : BrowserModeIcon}
        />
    </>, header)
}
