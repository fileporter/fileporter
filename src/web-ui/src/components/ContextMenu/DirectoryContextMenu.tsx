import type { DirectoryTypeResponse } from "~/api/types";
import * as CM from "./ContextElements";
import InternLink from "~/elements/OpenModeLink/InternLink";
import OpenNewTabIconSrc from "@assets/icons/open-mode/open-in-new-tab.png";
import { getIconForFolder } from "~/common";


export default function DirectoryContextMenu(directory: DirectoryTypeResponse) {
    return <>
        <CM.HeaderIcon src={getIconForFolder(directory)} />
        <CM.Grid>
            <CM.Label>Name</CM.Label>
            <CM.Value>{directory.basename}</CM.Value>
            <CM.Label>Path</CM.Label>
            <CM.Value>{directory.parent}</CM.Value>
        </CM.Grid>
        <CM.Space />
        <CM.Options>
            <InternLink to={directory.path} target="_blank" title="Open in a new Tab">
                <img className="h-6" src={OpenNewTabIconSrc} alt="new-tab" />
            </InternLink>
        </CM.Options>
    </>;
}
