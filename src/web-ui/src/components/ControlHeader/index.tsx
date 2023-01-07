// import ControlButtons from "./ControlButtons";
import { ViewEnum } from "../../common";
import PathBar from "./PathBar";
import ViewToggle from "./ViewToggle";

interface Props {
    currentView: ViewEnum
    setCurrentView: (v: ViewEnum) => void,
}

export default function ControlHeader(props: Props) {
    return <div className="sticky top-0 flex gap-1 px-2 py-px bg-black rounded-md bg-opacity-70">
        {/* <ControlButtons /> */}
        <PathBar />
        <ViewToggle {...props} />
    </div>
}
