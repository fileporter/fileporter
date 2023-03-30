import ReactDOM from "react-dom";
import { SortMode } from "~/common/";

import AlphabeticSortIcon from "@assets/icons/alphabetic-sort.svg";
import NumericSortIcon from "@assets/icons/numeric-sort.svg";
import useSortMode from "~/hooks/useSortMode";


export default function ViewToggle() {
    const [sortMode, setSortMode] = useSortMode();

    const header = document.getElementById("control-header");
    if (!header) return null;

    return ReactDOM.createPortal(<>
        <img className="order-10 h-5 my-auto cursor-pointer" alt="" title="how to sort files"
            onClick={() => setSortMode(sortMode === SortMode.numeric ? SortMode.alphabetic : SortMode.numeric)}
            src={sortMode === SortMode.alphabetic ? AlphabeticSortIcon : NumericSortIcon}
        />
    </>, header)
}
