import "./index.css";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useMutation } from "react-query";
import fileporterIconSrc from "@assets/fileporter.png";
import GithubIconSrc from "@assets/icons/github.png";
import DocsIconSrc from "@assets/icons/documentation.svg";
import MazeBackgroundSrc from "@assets/abstract-background.png";
import api from "~/api";
import { AxiosError, HttpStatusCode } from "axios";


const errorMessageIndex: Record<number, undefined | JSX.Element> = {
    [HttpStatusCode.Unauthorized]: <>Invalid username or password</>,
    [HttpStatusCode.TooManyRequests]: <>Too many attempts. Please wait a while.</>,
    // [HttpStatusCode.TooManyRequests]: <>You have entered the wrong credentials too many times. Please wait a little.</>,
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
        }, retry: false },
    );

    return <div className="relative flex flex-col items-center justify-center h-screen pulse-background isolate">
        <img className="fixed inset-0 object-cover w-full h-full -z-10" src={MazeBackgroundSrc} alt="" />
        <div className="grow" />
        <img className={`w-auto h-1/3 ${login.isLoading ? "animate-pulse" : ""}`} src={fileporterIconSrc} alt="" draggable={false} />
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
            <Link className="group" to="https://github.com/fileporter/fileporter#readme" target="_blank">
                <img className="inline-block h-[1rem]" src={GithubIconSrc} alt="" /> <span className="group-hover:underline">fileporter</span>
            </Link>
            <Link className="group" to="https://fileporter.github.io/docs" target="_blank">
                <img className="inline-block h-[1rem]" src={DocsIconSrc} alt="" /> <span className="group-hover:underline">docs</span>
            </Link>
        </div>
    </div>;
}
