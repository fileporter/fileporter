import ListViewIcon from "./list-view.png";
import GridViewIcon from "./grid-view.png";


interface Props {
    isIconView: boolean
    setIconView: (v: boolean) => void
}

export default function ViewToggle(props: Props) {
    return <img
        className="h-5 my-auto cursor-pointer" alt=""
        title={`switch to ${props.isIconView ? "List" : "Icon"}-View`}
        onClick={() => props.setIconView(!props.isIconView)}
        src={props.isIconView ? GridViewIcon : ListViewIcon}
    />
}
