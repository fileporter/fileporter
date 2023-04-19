import { AxiosError } from "axios";
import { ZodError } from "zod";


interface Props {
    error: unknown
}

export default function ErrorMessageBox({ error }: Props) {
    let errorMessage = "Something went wrong";
    if (error instanceof AxiosError && error.response) {
        errorMessage = `${error.response.status}: ${error.response.statusText}`;
    }
    if (error instanceof ZodError) {
        errorMessage = "The server responded weirdly.";
    }
    return <div className="grid h-full p-5 place-content-center">
        <div className="flex flex-col gap-1 px-2 py-1 text-xl text-center text-white border rounded-lg border-red bg-error">
            <p>{errorMessage}</p>
            <p className="text-xs opacity-75">{`${error}`}</p>
        </div>
    </div>;
}
