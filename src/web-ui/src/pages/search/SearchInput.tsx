import { useSearchParams } from "react-router-dom";
import RegexIconSrc from "@assets/icons/regex.png";
import SensitiveIconSrc from "@assets/icons/sensitive.png";
import FileIconSrc from "@assets/icons/files/default-file.png";
import DirectoryIconSrc from "@assets/icons/files/directory.png";


export default function SearchInput() {
    const [searchParams, setSearchParams] = useSearchParams();

    function setSearchParam(key: string, value: string) {
        setSearchParams(last => {
            const next = new URLSearchParams(last);
            next.set(key, value);
            return next;
        });
    }

    const isRegex = searchParams.get("regex") === "true";
    const isSensitive = searchParams.get("sensitive") === "true";
    const allowFiles = searchParams.get("files") ? searchParams.get("files") === "true" : true;
    const allowDirectories = searchParams.get("directories") ? searchParams.get("directories") === "true" : true;

    return <div className="flex gap-1 px-1">
        <input
            className="px-2 py-px bg-black rounded-md grow bg-opacity-60"
            autoFocus
            value={searchParams.get("query") ?? ""}
            onChange={(event) => setSearchParam("query", event.target.value)}
        />
        <ToggleIcon src={RegexIconSrc} value={isRegex} setValue={(state) => setSearchParam("regex", `${state}`)} title="regex" />
        <ToggleIcon src={SensitiveIconSrc} value={isSensitive} setValue={(state) => setSearchParam("sensitive", `${state}`)} title="case-sensitive" />
        <ToggleIcon src={FileIconSrc} value={allowFiles} setValue={(state) => setSearchParam("files", `${state}`)} title="allow files" />
        <ToggleIcon src={DirectoryIconSrc} value={allowDirectories} setValue={(state) => setSearchParam("directories", `${state}`)} title="allow directories" />
    </div>;
}

interface Props {
    src: string
    value: boolean
    setValue: (v: boolean) => void
    title: string
}

function ToggleIcon(props: Props) {
    return <button className={`rounded-md bg-accent aspect-square ${props.value ? "bg-opacity-50" : "bg-opacity-0"}`} onClick={() => props.setValue(!props.value)} title={props.title}>
        <img className="h-4 m-auto" src={props.src} />
    </button>;
}
