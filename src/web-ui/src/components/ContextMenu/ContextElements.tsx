import type { PropsWithChildren } from "react";


export function NA() {
    return <span className="opacity-50 select-none">N/A</span>;
}

export function Space() {
    return <div className="grow" />;
}

export function HeaderIcon(props: { src: string }) {
    return <img className="mx-auto h-14" src={props.src} />;
}

export function TinyIcon(props: { src: string, title?: string }) {
    return <img className="h-4 invert" src={props.src} title={props.title} />;
}

export function Grid(props: PropsWithChildren) {
    return <div className="grid grid-cols-[auto,1fr] gap-x-3">
        {props.children}
    </div>;
}

export function Label(props: PropsWithChildren) {
    return <b className="select-none">{props.children}</b>;
}

export function Value(props: PropsWithChildren) {
    return <span>{props.children}</span>;
}

export function Multiple(props: PropsWithChildren) {
    return <div className="flex gap-1">
        {props.children}
    </div>;
}

export function Options(props: PropsWithChildren) {
    return <div className="flex gap-1 justify-evenly">
        {props.children}
    </div>;
}
