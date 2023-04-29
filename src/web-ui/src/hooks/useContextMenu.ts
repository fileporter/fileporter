import { useContext } from "react";
import { ContextMenuContext } from "~/components/ContextMenu/Provider";

export default function useContextMenu() {
    return useContext(ContextMenuContext);
}
