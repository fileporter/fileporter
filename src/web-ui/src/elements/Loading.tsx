// import MiniserveIconSrc from "@assets/miniserve.png";


export default function Loading() {
    return <div className="h-[90vh] flex">
        {/* <img className="w-1/2 h-auto max-h-full m-auto opacity-25 animate-pulse" src={MiniserveIconSrc} alt="Loading..." /> */}
        <div className="w-10 h-10 mx-auto border-t-4 rounded-full border-t-blue-500 animate-spin" />
    </div>;
}
