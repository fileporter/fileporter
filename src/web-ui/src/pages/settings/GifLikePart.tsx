import OptionSwitch from "./util/OptionSwitch";
import { GifLike } from "~/common";
import GifFileIcon from "@assets/icons/files/gif-file.png";
import VideoFileIcon from "@assets/icons/files/video-file.png";
import Description from "./util/Description";
import { useSetting } from "~/hooks/useSettings";


const descriptions: Record<GifLike, string> = {
    [GifLike.enabled]: "Show Videos that are short and have no audio like gif's",
    [GifLike.disabled]: "Show all Videos normally",
};


export default function GifLikePart() {
    const [gifLike, setGifLike] = useSetting("gifLike");

    return <>
        <OptionSwitch current={gifLike} options={[
            {key: GifLike.enabled, imgSrc: GifFileIcon, text: "Gif-like"},
            {key: GifLike.disabled, imgSrc: VideoFileIcon, text: "Video"},
        ]} onSwitch={setGifLike} />
        <Description>{descriptions[gifLike]}</Description>
    </>;
}
