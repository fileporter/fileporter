import ReactDOM from "react-dom";
import useIsFullScreen from "../../hooks/useIsFullScreen";

import FullScreenIcon from "./images/full-screen.png";
import MinimizeIcon from "./images/minimize.png";

export default function FullScreenToggle() {
    const isFullScreen = useIsFullScreen();
    const header = document.getElementById("control-header");
    if (!header) return null;

    return ReactDOM.createPortal(<>
        <img className="order-9 h-5 my-auto cursor-pointer" alt="" title="request fullscreen for better experience"
            onClick={() => {
                if (isFullScreen) {
                    document.exitFullscreen();
                } else {
                    document.documentElement.requestFullscreen();
                }
            }}
            src={isFullScreen ? MinimizeIcon : FullScreenIcon}
        />
    </>, header)
}
