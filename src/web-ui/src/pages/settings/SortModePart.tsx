import OptionSwitch from "./util/OptionSwitch";
import { SortMode } from "~/common";
import AlphabeticSortIcon from "@assets/icons/sort-mode/alphabetic-sort.svg";
import NumericSortIcon from "@assets/icons/sort-mode/numeric-sort.svg";
import Description from "./util/Description";
import { useSetting } from "~/hooks/useSettings";


const descriptions: Record<SortMode, string> = {
    [SortMode.alphabetic]: "Sorting by comparing the letters in the filename.",
    [SortMode.numeric]: "Sorting by comparing all numbers in the filename",
};


export function SortModePart() {
    const [sortMode, setSortMode] = useSetting("sortMode");

    return <>
        <OptionSwitch current={sortMode} options={[
            {key: SortMode.alphabetic, imgSrc: AlphabeticSortIcon, text: "Alphabetic"},
            {key: SortMode.numeric, imgSrc: NumericSortIcon, text: "Numeric"},
        ]} onSwitch={setSortMode} />
        <Description>{descriptions[sortMode]}</Description>
    </>;
}
