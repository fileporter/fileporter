import type { LinkProps } from "react-router-dom";
import { Link } from "react-router-dom";
import { OpenMode } from "~/common";
import ApiFileDownloadLink from "./ApiFileDownloadLink";
import { useSetting } from "~/hooks/useSettings";


const componentMap = {
    [OpenMode.intern]: Link,
    [OpenMode.download]: ApiFileDownloadLink,
};


export default function OpenModeLink(props: LinkProps) {
    const [openMode] = useSetting("openMode");
    const LinkComp = componentMap[openMode];
    return <LinkComp {...props} />;
}
