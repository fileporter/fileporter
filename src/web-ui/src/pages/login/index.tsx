import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useMutation } from "react-query";
import axios, { type AxiosError, type AxiosResponse } from "axios";
import { HTTP_401_UNAUTHORIZED } from "~/common/httpStatusIndex";
import MiniserveIconSrc from "@assets/miniserve.png";
import GithubIconSrc from "@assets/icons/github.png";
import DocsIconSrc from "@assets/icons/documentation.svg";


const errorMessageIndex: Record<number, undefined | string> = {
    [HTTP_401_UNAUTHORIZED]: "Invalid username or password",
};


export default function LoginPage() {
    const navigate = useNavigate();
    const pwInput = useRef<HTMLInputElement | null>();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const login = useMutation<AxiosResponse, AxiosError>(
        () => axios.post("/auth/login", { username, password }),
        { onSuccess: () => {
            navigate("/", { replace: true });
        }, onError: () => {
            pwInput.current?.focus();
        } },
    );

    return <div className="flex flex-col items-center justify-center h-screen">
        <div className="grow" />
        <img className={`w-auto h-1/3 ${login.isLoading ? "animate-pulse" : ""}`} src={MiniserveIconSrc} alt="" draggable={false} />
        <form className="flex flex-col w-full max-w-sm gap-1" onSubmit={(event) => {
            event.preventDefault();
            login.mutate();
        }}>
            <div className="px-2 py-px text-center text-white bg-red-500 border border-red-800 rounded-md" style={{visibility: login.isError ? "visible" : "hidden"}}>
                {login.error?.response ?
                    ( errorMessageIndex[login.error.response.status] ?? login.error.response.statusText)
                    :
                    "Login Failed for unknown reasons"
                }
            </div>
            <input
                className="px-2 py-px bg-black bg-opacity-50 rounded-md" type="text"
                required autoFocus placeholder="Username"
                onChange={(event) => setUsername(event.target.value)}
            />
            <input
                className="px-2 py-px bg-black bg-opacity-50 rounded-md" type="password" ref={el => (pwInput.current = el)}
                required placeholder="Password"
                onChange={(event) => setPassword(event.target.value)}
            />
            <img />
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
