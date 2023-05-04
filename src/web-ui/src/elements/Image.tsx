import { createRef, useEffect } from "react";
import DownloadFailedIcon from "@assets/icons/download-fail.png";


type ImageProps = Omit<JSX.IntrinsicElements["img"], "onError" | "onClick" | "loading">


export default function Image(props: ImageProps) {
    const imageRef = createRef<HTMLImageElement>();

    // custom lazy loading
    useEffect(() => {
        const image = imageRef.current;
        if (!image) {
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const img = entry.target as HTMLImageElement;
                if (entry.isIntersecting) {
                    img.src = props.src!;
                } else if (!img.complete) {
                    img.src = ""; // cancel loading in case someone scrolls really fast
                }
            });
        }, { rootMargin: "100% 0px" });
        observer.observe(image);
        return () => observer.unobserve(image);
    }, [imageRef.current]);

    const onError: React.ReactEventHandler<HTMLImageElement> = ({ currentTarget }) => {
        currentTarget.onerror = null;
        currentTarget.src = DownloadFailedIcon;
    };

    return <img ref={imageRef} {...props} src={undefined}
        onLoad={({ currentTarget }) => {
            currentTarget.onerror = null;
        }}
        onError={onError}
        onClick={({ currentTarget }) => {
            if (currentTarget.onerror === null && !currentTarget.complete) {
                const url = new URL(props.src!);
                url.searchParams.set("ts", Date.now().toString());
                currentTarget.src = url.toString();
                currentTarget.onerror = onError as never;
            }
        }}
    />;
}
