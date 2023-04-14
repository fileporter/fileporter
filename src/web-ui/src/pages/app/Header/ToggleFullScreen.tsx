import useIsFullScreen from "~/hooks/useIsFullScreen";
import FullScreenIcon from "@assets/icons/header/full-screen.png";
import MinimizeIcon from "@assets/icons/header/minimize.png";


export default function ToggleFullScreen() {
    const isFullScreen = useIsFullScreen();

    return <img className="inline-block h-5 my-auto cursor-pointer" alt="⬜" title="request fullscreen for better experience"
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
    />;
}
