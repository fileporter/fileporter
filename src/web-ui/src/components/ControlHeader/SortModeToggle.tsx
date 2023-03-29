import ReactDOM from "react-dom";
import { SortMode } from "~/common/";

import AlphabeticSortIcon from "./images/alphabetic-sort.svg";
import NumericSortIcon from "./images/numeric-sort.svg";


interface Props {
    sortMode: SortMode
    setSortMode: (v: SortMode) => void,
}


export default function ViewToggle(props: Props) {
    const header = document.getElementById("control-header");
    if (!header) return null;

    return ReactDOM.createPortal(<>
        <img className="order-10 h-5 my-auto cursor-pointer" alt="" title="how to open files"
            onClick={() => props.setSortMode(props.sortMode === SortMode.numeric ? SortMode.alphabetic : SortMode.numeric)}
            src={props.sortMode === SortMode.alphabetic ? AlphabeticSortIcon : NumericSortIcon}
        />
    </>, header)
}
