import { useLocation } from "react-router-dom";

export default function usePath() {
    const { pathname } = useLocation();
    return pathname.slice(2);  // remove the '~/' part
}
