import type { FileTypeResponse } from "~/api/types";
import NoAudioIconSrc from "@assets/icons/no-sound.png?inline";
import NoVideoIconSrc from "@assets/icons/no-video.png?inline";
import DownloadIconSrc from "@assets/icons/open-mode/download-mode.png";
import OpenNewTabIconSrc from "@assets/icons/open-mode/open-in-new-tab.png";
import ApiFileDownloadLink from "~/elements/OpenModeLink/ApiFileDownloadLink";
import InternLink from "~/elements/OpenModeLink/InternLink";
import { formatDuration, formatFileSize, getIconForFile } from "~/common";


function NA() {
    return <span className="opacity-50 select-none">N/A</span>;
}

function Icon(props: { src: string, title?: string }) {
    return <img className="h-4 invert" src={props.src} title={props.title} />;
}


export default function FileContextMenu(file: FileTypeResponse) {
    return <>
        <img className="h-10 mx-auto" src={getIconForFile(file)} />
        <div className="grid grid-cols-[auto,1fr] gap-x-3">
            <b>Name</b>
            <span>{file.basename}</span>
            <b>Path</b>
            <span>{file.parent}</span>
            <b>Mime</b>
            {file.mime ? <span>{file.mime}</span> : <NA/>}
            <b>File-size</b>
            <span>{formatFileSize(file.size)}</span>
            <b>Dimensions</b>
            {file.dimensions ? <span>{file.dimensions.width}x{file.dimensions.height}</span> : <NA/>}
            <b>Duration</b>
            <span>{file.duration ? formatDuration(file.duration) : <NA/>}</span>
            <b>Other</b>
            <span className="flex gap-1">
                {!file.has_video && <Icon src={NoVideoIconSrc} title="No Video" />}
                {!file.has_audio && <Icon src={NoAudioIconSrc} title="No Audio" />}
            </span>
        </div>
        <div className="flex justify-evenly">
            <InternLink to={file.path} target="_blank" rel="noopener noreferrer">
                <img className="h-6" src={OpenNewTabIconSrc} alt="new-tab" />
            </InternLink>
            <ApiFileDownloadLink to={file.path}>
                <img className="h-6" src={DownloadIconSrc} alt="download" />
            </ApiFileDownloadLink>
        </div>
    </>;
}
