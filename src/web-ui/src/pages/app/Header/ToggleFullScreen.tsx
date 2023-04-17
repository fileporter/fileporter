import useIsFullScreen from "~/hooks/useIsFullScreen";
import FullScreenIcon from "@assets/icons/header/full-screen.png";
import MinimizeIcon from "@assets/icons/header/minimize.png";


export default function ToggleFullScreen() {
    const isFullScreen = useIsFullScreen();

    return <button className="my-auto h-fit" onClick={() => {
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
    }}>
        <img className="h-5 cursor-pointer" src={isFullScreen ? MinimizeIcon : FullScreenIcon} alt="⬜" title="request fullscreen for better experience" />
    </button>;
}
