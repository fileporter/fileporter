import { createRef, useEffect } from "react";


export default function Image(props: JSX.IntrinsicElements["img"]) {
    const imageRef = createRef<HTMLImageElement>();

    // custom lazy loading
    useEffect(() => {
        if (!imageRef.current) {
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    (entry.target as HTMLImageElement).src = props.src!;
                }
            });
        }, { rootMargin: "50vh auto" });
        observer.observe(imageRef.current);
        return observer.unobserve(imageRef.current);
    }, []);

    return <img ref={imageRef} {...props} src={undefined} />;
}
