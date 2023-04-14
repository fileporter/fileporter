import NotFoundSrc from "@assets/404.gif";


export default function Page404NotFound() {
    return <div className="grid h-screen place-content-center">
        <img className="h-[50vh] w-auto max-w-[90vw]" src={NotFoundSrc} alt="404 Page not Found" />
    </div>;
}
