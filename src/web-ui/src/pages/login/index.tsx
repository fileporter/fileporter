import "./index.css";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useMutation } from "react-query";
import MiniserveIconSrc from "@assets/miniserve.png";
import GithubIconSrc from "@assets/icons/github.png";
import DocsIconSrc from "@assets/icons/documentation.svg";
import MazeBackgroundSrc from "@assets/maze-background.png";
import api from "~/api";
import { AxiosError, HttpStatusCode } from "axios";


const errorMessageIndex: Record<number, undefined | string> = {
    [HttpStatusCode.Unauthorized]: "Invalid username or password",
};


export default function LoginPage() {
    const navigate = useNavigate();
    const pwInput = useRef<HTMLInputElement | null>();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const login = useMutation(
        () => api.login({ username, password }),
        { onSuccess: () => {
            navigate("/", { replace: true });
        }, onError: () => {
            pwInput.current?.focus();
        } },
    );

    return <div className="relative flex flex-col items-center justify-center h-screen pulse-background isolate">
        <img className="absolute inset-0 object-cover -z-10" src={MazeBackgroundSrc} alt="" />
        <div className="grow" />
        <img className={`w-auto h-1/3 ${login.isLoading ? "animate-pulse" : ""}`} src={MiniserveIconSrc} alt="" draggable={false} />
        <form className="flex flex-col w-full max-w-sm gap-1" onSubmit={(event) => {
            event.preventDefault();
            login.mutate();
        }}>
            <div className="px-2 py-px text-center text-white border rounded-md border-red bg-error" style={{visibility: login.isError ? "visible" : "hidden"}}>
                {login.error instanceof AxiosError && login.error.response ?
                    ( errorMessageIndex[login.error.response.status] ?? login.error.response.statusText)
                    :
                    "Login Failed for unknown reasons"
                }
            </div>
            <input
                className="px-2 py-px bg-black rounded-md bg-opacity-60" type="text"
                required autoFocus placeholder="Username"
                onChange={(event) => setUsername(event.target.value)}
            />
            <input
                className="px-2 py-px bg-black rounded-md bg-opacity-60" type="password" ref={el => (pwInput.current = el)}
                required placeholder="Password"
                onChange={(event) => setPassword(event.target.value)}
            />
            <img />
            <input className="px-5 py-px mx-auto bg-black rounded-md cursor-pointer bg-opacity-60 w-fit" type="submit" value="Login" />
        </form>
        <div className="grow" />
        <div className="flex gap-2 px-5 py-1 opacity-50 hover:opacity-100">
            <Link className="group" to="https://github.com/PlayerG9/miniserve#readme" target="_blank">
                <img className="inline-block h-[1rem]" src={GithubIconSrc} alt="" /> <span className="group-hover:underline">miniserve</span>
            </Link>
            <Link className="group" to="https://playerg9.github.io/miniserve" target="_blank">
                <img className="inline-block h-[1rem]" src={DocsIconSrc} alt="" /> <span className="group-hover:underline">docs</span>
            </Link>
        </div>
    </div>;
}
