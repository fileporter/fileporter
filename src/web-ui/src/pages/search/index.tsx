import HeadPart from "./HeadPart";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";

export default function SearchPage() {
    return <div className="flex flex-col min-h-screen gap-2">
        <HeadPart />
        <SearchInput />
        <SearchResults />
    </div>;
}
