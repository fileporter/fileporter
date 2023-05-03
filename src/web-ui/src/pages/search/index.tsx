import HeadPart from "./HeadPart";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";

export default function Search() {
    return <div className="flex flex-col items-center min-h-screen gap-2">
        <HeadPart />
        <SearchInput />
        <main className="flex flex-col items-center w-full max-w-xl gap-2 px-2 grow">
            <SearchResults />
        </main>
    </div>;
}
