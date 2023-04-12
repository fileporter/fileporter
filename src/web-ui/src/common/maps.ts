import { Link } from "react-router-dom";
import ApiFileDownloadLink from "~/elements/OpenModeLink/ApiFileDownloadLink";
import ApiFileLink from "~/elements/OpenModeLink/ApiFileLink";
import { OpenMode } from "./enums";

export const OpenModeLinkMap = {
    [OpenMode.intern]: Link,
    [OpenMode.browser]: ApiFileLink,
    [OpenMode.download]: ApiFileDownloadLink,
}
