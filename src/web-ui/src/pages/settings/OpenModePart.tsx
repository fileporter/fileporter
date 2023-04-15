import useOpenMode from "~/hooks/useOpenMode";
import OptionSwitch from "./util/OptionSwitch";
import { OpenMode } from "~/common";
import InternModeIcon from "@assets/icons/open-mode/browser-mode.png";
import DownloadModeIcon from "@assets/icons/open-mode/download-mode.png";
import Description from "./util/Description";


const descriptions: Record<OpenMode, string> = {
    [OpenMode.intern]: "Use builtin tools to display the file in a correct format.",
    [OpenMode.download]: "Always download a file.",
};


export function OpenModePart() {
    const [openMode, setOpenMode] = useOpenMode();

    return <>
        <OptionSwitch current={openMode} options={[
            {key: OpenMode.intern, imgSrc: InternModeIcon, text: "Intern"},
            {key: OpenMode.download, imgSrc: DownloadModeIcon, text: "Download"},
        ]} onSwitch={setOpenMode} />
        <Description>{descriptions[openMode]}</Description>
    </>;
}
