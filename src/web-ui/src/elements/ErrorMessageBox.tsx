import { AxiosError } from "axios";
import { type PropsWithChildren } from "react";


interface Props extends PropsWithChildren {
    error: unknown
}

export default function ErrorMessageBox({ error, children }: Props) {
    let errorMessage = "Something went wrong";
    if (error instanceof AxiosError && error.response) {
        errorMessage = `${error.response.status}: ${error.response.statusText}`;
    }
    return <div className="grid h-full p-5 place-content-center">
        <div className="flex flex-col gap-1 px-2 py-1 text-xl text-center text-white border rounded-lg border-red bg-error max-w-[90vw]">
            <p>{errorMessage}</p>
            <p className="text-xs opacity-75">{`${error}`}</p>
            {children}
        </div>
    </div>;
}
