interface Props {
    children: JSX.Element[]
}


export default function OptionSwitch(props: Props) {
    return <>
        {props.children}
    </>;
}
