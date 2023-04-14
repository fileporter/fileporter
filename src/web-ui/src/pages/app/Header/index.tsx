import PathBar from "./PathBar";
import ShowSettings from "./ShowSettings";
import ToggleFullScreen from "./ToggleFullScreen";


export default function AppHeader() {
    return <div className="flex gap-2 bg-black">
        <PathBar />
        <ToggleFullScreen />
        <ShowSettings />
    </div>;
}
