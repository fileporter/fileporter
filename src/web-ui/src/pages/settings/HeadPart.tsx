import { Link, useSearchParams } from "react-router-dom";
import FileporterIconSrc from "@assets/fileporter.png";
import CloseIconSrc from "@assets/icons/cross.svg?inline";


export default function HeadPart() {
    const [searchParams] = useSearchParams();

    const origin = searchParams.get("origin");
    const scrollY = parseInt(searchParams.get("scrollY") ?? "0");

    return <nav className="flex w-full px-2 bg-black">
        <img className="inline-block h-5 my-auto" src={FileporterIconSrc} alt="" />
        <span className="text-xl text-center select-none grow">⚙ Settings</span>
        <Link
            to={`/~${origin?.length ? origin : "/"}`}
            onClick={() => {
                setTimeout(() => {
                    document.documentElement.scrollTo({ left: 0, top: scrollY });
                }, 50);
            }}
        >
            <img className="inline-block h-4 my-auto invert" src={CloseIconSrc} alt="X" />
        </Link>
    </nav>;
}
