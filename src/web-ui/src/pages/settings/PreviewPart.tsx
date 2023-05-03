import OptionSwitch from "./util/OptionSwitch";
import { Previews } from "~/common";
import PreviewFileIcon from "@assets/icons/files/view-file.png";
import NormalFileIcon from "@assets/icons/files/default-file.png";
import Description from "./util/Description";
import { useSetting } from "~/hooks/useSettings";


const descriptions: Record<Previews, string> = {
    [Previews.enabled]: "Show a small preview of the file content",
    [Previews.disabled]: "Show an Icon according to the file-type",
};


export default function PreviewPart() {
    const [previews, setPreviews] = useSetting("previews");

    return <>
        <OptionSwitch current={previews} options={[
            {key: Previews.enabled, imgSrc: PreviewFileIcon, text: "Preview"},
            {key: Previews.disabled, imgSrc: NormalFileIcon, text: "Icon"},
        ]} onSwitch={setPreviews} />
        <Description>{descriptions[previews]}</Description>
    </>;
}
