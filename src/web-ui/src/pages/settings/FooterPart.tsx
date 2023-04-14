import { Link } from "react-router-dom";
import GithubIconSrc from "@assets/icons/github.png";
import DocsIconSrc from "@assets/icons/documentation.svg";


export default function FooterPart() {
    return <>
        <div className="flex gap-2 px-5 py-1 opacity-50 hover:opacity-100">
            <Link className="group" to="https://github.com/PlayerG9/miniserve#readme" target="_blank">
                <img className="inline-block h-[1rem]" src={GithubIconSrc} alt="" /> <span className="group-hover:underline">miniserve</span>
            </Link>
            <Link className="group" to="https://playerg9.github.io/miniserve" target="_blank">
                <img className="inline-block h-[1rem]" src={DocsIconSrc} alt="" /> <span className="group-hover:underline">docs</span>
            </Link>
        </div>
    </>;
}
