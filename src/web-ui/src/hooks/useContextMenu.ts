import { useContext } from "react";
import { ContextMenuContext } from "~/components/ContextMenu";

export default function useContextMenu() {
    return useContext(ContextMenuContext);
}
