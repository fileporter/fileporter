interface Props {
    error: Error
}

export default function ErrorMessageBox(props: Props) {
    return <p className="text-xl text-center text-red-300">
        {props.error.toString()}
    </p>;
}
