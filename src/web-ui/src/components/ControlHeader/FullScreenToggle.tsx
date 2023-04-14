import ReactDOM from "react-dom";
import useIsFullScreen from "~/hooks/useIsFullScreen";
import FullScreenIcon from "@assets/icons/full-screen.png";
import MinimizeIcon from "@assets/icons/minimize.png";


export default function FullScreenToggle() {
    const isFullScreen = useIsFullScreen();
    const header = document.getElementById("control-header");
    if (!header) {
        return null;
    }

    return ReactDOM.createPortal(<>
        <img className="order-10 h-5 my-auto cursor-pointer hue-rotate-color" alt="" title="request fullscreen for better experience"
            onClick={() => {
                if (isFullScreen) {
                    document.exitFullscreen();
                } else {
                    document.documentElement
                        .requestFullscreen()
                        .catch(() => {
                            // eslint-disable-next-line no-alert
                            alert("Fullscreen failed"); // TODO: make this better
                        });
                }
            }}
            src={isFullScreen ? MinimizeIcon : FullScreenIcon}
        />
    </>, header);
}
