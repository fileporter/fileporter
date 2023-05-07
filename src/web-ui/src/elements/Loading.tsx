// import fileporterIconSrc from "@assets/fileporter.png";


export default function Loading() {
    return <div className="grid h-full grow place-content-center">
        {/* <img className="w-1/2 h-auto max-h-full m-auto opacity-25 animate-pulse" src={fileporterIconSrc} alt="Loading..." /> */}
        <div className="w-20 h-20 rounded-[50%] animate-spin border-8 border-accent border-r-transparent border-l-transparent" />
    </div>;
}
