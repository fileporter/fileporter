import { NavigateOptions, useLocation, useNavigate } from "react-router-dom";

type UpdateValue = string | ((old: string) => string)
type setHashFunction = (update: UpdateValue, options?: NavigateOptions) => void

export default function useUrlHash(): [string, setHashFunction] {
    const location = useLocation();
    const navigate = useNavigate();

    const hash = location.hash.slice(1);

    function setHash(update: UpdateValue, options?: NavigateOptions) {
        if (typeof update === "function") {
            update = update(hash);
        }
        navigate({
            pathname: location.pathname,
            search: location.search,
            hash: `#${update}`,
        }, options)
    }

    return [hash, setHash];
}
