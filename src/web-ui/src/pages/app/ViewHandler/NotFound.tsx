import NotFoundSrc from "@assets/404.gif";


export default function PageNotFound() {
    return <div className="grid h-full place-content-center">
        <img className="h-[50vw] max-h-[50vh] w-auto max-w-[90vw]" src={NotFoundSrc} alt="404 Page not Found" />
        <p className="text-xl text-center ">Directory or File not Found</p>
    </div>;
}
