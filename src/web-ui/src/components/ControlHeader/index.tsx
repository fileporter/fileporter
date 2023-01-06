// import ControlButtons from "./ControlButtons";
import PathBar from "./PathBar";
import ViewToggle from "./ViewToggle";

interface Props {
    isIconView: boolean
    setIconView: (v: boolean) => void,
}

export default function ControlHeader(props: Props) {
    return <div className="flex gap-1 px-2 py-px bg-black rounded-md bg-opacity-30">
        {/* <ControlButtons /> */}
        <PathBar />
        <ViewToggle isIconView={props.isIconView} setIconView={props.setIconView} />
    </div>
}
