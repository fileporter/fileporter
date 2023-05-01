import type { FileTypeResponse } from "~/api/types";
import * as CM from "./ContextElements";
import { formatDuration, formatFileSize, getIconForFile } from "~/common";
import ApiFileDownloadLink from "~/elements/OpenModeLink/ApiFileDownloadLink";
import InternLink from "~/elements/OpenModeLink/InternLink";
import NoAudioIconSrc from "@assets/icons/no-sound.png?inline";
import NoVideoIconSrc from "@assets/icons/no-video.png?inline";
import DownloadIconSrc from "@assets/icons/open-mode/download-mode.png";
import OpenNewTabIconSrc from "@assets/icons/open-mode/open-in-new-tab.png";


export default function FileContextMenu(file: FileTypeResponse) {
    return <>
        <CM.HeaderIcon src={getIconForFile(file)} />
        <CM.Grid>
            <CM.Label>Name</CM.Label>
            <CM.Value>{file.basename}</CM.Value>
            <CM.Label>Path</CM.Label>
            <CM.Value>{file.parent}</CM.Value>
            <CM.Label>Mime</CM.Label>
            {file.mime ? <CM.Value>{file.mime}</CM.Value> : <CM.NA/>}
            <CM.Label>File-size</CM.Label>
            <CM.Value>{formatFileSize(file.size)}</CM.Value>
            <CM.Label>Dimensions</CM.Label>
            {file.dimensions ? <CM.Value>{file.dimensions.width}x{file.dimensions.height}</CM.Value> : <CM.NA/>}
            <CM.Label>Duration</CM.Label>
            <CM.Value>{file.duration ? formatDuration(file.duration) : <CM.NA/>}</CM.Value>
            <CM.Label>Other</CM.Label>
            <CM.Multiple>
                {!file.has_video && <CM.TinyIcon src={NoVideoIconSrc} title="No Video" />}
                {!file.has_audio && <CM.TinyIcon src={NoAudioIconSrc} title="No Audio" />}
            </CM.Multiple>
        </CM.Grid>
        <CM.Space />
        <CM.Options>
            <InternLink to={file.realpath} target="_blank" title="Open in a new Tab">
                <img className="h-6" src={OpenNewTabIconSrc} alt="new-tab" />
            </InternLink>
            <ApiFileDownloadLink to={file.path} title="Download the File">
                <img className="h-6" src={DownloadIconSrc} alt="download" />
            </ApiFileDownloadLink>
        </CM.Options>
    </>;
}
