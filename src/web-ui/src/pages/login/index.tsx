import { Link } from "react-router-dom";
import MiniserveIconSrc from "@assets/images/miniserve.png";
import GithubIconSrc from "@assets/images/github.png";
import DocsIconSrc from "@assets/images/documentation.svg";


export default function LoginPage() {
    return <div className="flex flex-col items-center justify-center h-screen">
        <div className="grow" />
        <img className="w-auto h-1/3" src={MiniserveIconSrc} alt="" draggable={false} />
        <div className="" style={{visibility: false ? "visible" : "hidden"}}>
            Bad Password (TODO)
        </div>
        <form className="flex flex-col w-full max-w-sm gap-1" onSubmit={(event) => {
            event.preventDefault();
            console.log("Hey")
        }}>
            <input className="px-2 py-px bg-black bg-opacity-50 rounded-md" type="text" required autoFocus placeholder="Username" />
            <input className="px-2 py-px bg-black bg-opacity-50 rounded-md" type="password" required placeholder="Password" />
            <input className="px-5 py-px mx-auto bg-black bg-opacity-50 rounded-md cursor-pointer w-fit" type="submit" value="Login" />
        </form>
        <div className="grow" />
        <div className="flex gap-2 px-5 py-1 opacity-50 hover:opacity-100">
            <Link className="group" to="https://github.com/PlayerG9/miniserve">
                <img className="inline-block h-[1rem]" src={GithubIconSrc} alt="" /> <span className="group-hover:underline">miniserve</span>
            </Link>
            <Link className="group" to="https://playerg9.github.io/miniserve">
                <img className="inline-block h-[1rem]" src={DocsIconSrc} alt="" /> <span className="group-hover:underline">docs</span>
            </Link>
        </div>
    </div>;
}
