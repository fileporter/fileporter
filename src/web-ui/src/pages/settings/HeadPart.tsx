import { Link, useSearchParams } from "react-router-dom";
import fileporterIconSrc from "@assets/fileporter.png";
import CloseIconSrc from "@assets/icons/cross.svg?inline";


export function HeadPart() {
    const [searchParams] = useSearchParams();

    return <nav className="flex w-full px-2 bg-black">
        <img className="inline-block h-5 my-auto" src={fileporterIconSrc} alt="" />
        <span className="text-xl text-center select-none grow">⚙ Settings</span>
        <Link to={`/~${searchParams.get("origin") ?? "/"}`}>
            <img className="inline-block h-4 my-auto invert" src={CloseIconSrc} alt="X" />
        </Link>
    </nav>;
}
