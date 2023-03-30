import ReactDOM from "react-dom";
import { OpenMode } from "~/common/";
import useOpenMode from "~/hooks/useOpenMode";
import FileModeIcon from "@assets/icons/file-mode.png";
import BrowserModeIcon from "@assets/icons/browser-mode.png";
import DownloadModeIcon from "@assets/icons/download-mode.png";


const imgMap = {
    [OpenMode.intern]: FileModeIcon,
    [OpenMode.browser]: BrowserModeIcon,
    [OpenMode.download]: DownloadModeIcon,
}


export default function ViewToggle() {
    const [openMode, setOpenMode] = useOpenMode();

    const header = document.getElementById("control-header");
    if (!header) return null;

    function getNextMode() {
        switch(openMode) {
            case OpenMode.intern:
                return OpenMode.browser;
            case OpenMode.browser:
                return OpenMode.download;
            case OpenMode.download:
            default:
                return OpenMode.intern;
        }
    }

    return ReactDOM.createPortal(<>
        <img className="order-10 h-5 my-auto cursor-pointer" alt="" title="how to open files"
            onClick={() => setOpenMode(getNextMode())}
            src={imgMap[openMode]}
        />
    </>, header)
}
