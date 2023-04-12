import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import MiniserveIconSrc from "@assets/images/miniserve.png";
import GithubIconSrc from "@assets/images/github.png";
import DocsIconSrc from "@assets/images/documentation.svg";
import { useMutation } from "react-query";
import axios from "axios";


export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const login = useMutation(
        () => axios.post("/auth/login", { username, password }),
        { onSuccess: () => {
            navigate("/", { replace: true });
        } },
    );

    return <div className="flex flex-col items-center justify-center h-screen">
        <div className="grow" />
        <img className="w-auto h-1/3" src={MiniserveIconSrc} alt="" draggable={false} />
        {/* TODO: error-box-style */}
        <div className="" style={{visibility: login.isError ? "visible" : "hidden"}}>
            {`${login.error}`}
        </div>
        <form className="flex flex-col w-full max-w-sm gap-1" onSubmit={(event) => {
            event.preventDefault();
            login.mutate();
        }}>
            <input
                className="px-2 py-px bg-black bg-opacity-50 rounded-md" type="text"
                required autoFocus placeholder="Username"
                onChange={(event) => setUsername(event.target.value)}
            />
            <input
                className="px-2 py-px bg-black bg-opacity-50 rounded-md" type="password"
                required placeholder="Password"
                onChange={(event) => setPassword(event.target.value)}
            />
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
