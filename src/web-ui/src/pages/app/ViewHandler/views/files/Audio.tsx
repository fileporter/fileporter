import { apiUrl } from "~/common";
import { FileTypeResponse } from "~/types";


export default function Audio(file: FileTypeResponse) {
    const srcUrl = apiUrl(`/files/${file.path}`);
    return <div className="grid h-screen p-1 place-content-center">
        <audio src={srcUrl} controls autoPlay className="w-[90vw] rounded-md h-fit" />
    </div>
}
