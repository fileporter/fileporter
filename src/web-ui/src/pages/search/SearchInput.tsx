import { useSearchParams } from "react-router-dom";

export default function SearchInput() {
    const [searchParams, setSearchParams] = useSearchParams();

    return <div>
        <input value={searchParams.get("query") ?? ""} onChange={(event) => {
            setSearchParams(last => {
                const next = new URLSearchParams(last);
                next.set("query", event.target.value);
                return next;
            });
        }} />
    </div>;
}
