import type { LinkProps } from "react-router-dom";
import { Link } from "react-router-dom";
import { OpenMode } from "~/common";
import useOpenMode from "~/hooks/useOpenMode";
import ApiFileLink from "./ApiFileLink";
import ApiFileDownloadLink from "./ApiFileDownloadLink";


const componentMap = {
    [OpenMode.intern]: Link,
    [OpenMode.browser]: ApiFileLink,
    [OpenMode.download]: ApiFileDownloadLink,
};


export default function OpenModeLink(props: LinkProps) {
    const [openMode] = useOpenMode();
    const LinkComp = componentMap[openMode];
    return <LinkComp {...props} />;
}
