import type {NodeData, NodeType, Page} from "../utils/types.ts";
import {arrayMove} from "@dnd-kit/sortable";
import {useSyncedState} from "./useSyncedState.ts";
import {updatePage} from "../utils/updatePage.ts";

export const usePageState = (initialState: Page) => {
    const [page, setPage] = useSyncedState(initialState, updatePage);

    const addNode = (node: NodeData, index: number) => {
        setPage((draft) => { draft.nodes.splice(index, 0, node); });
    };

    const removeNodeByIndex = (index: number) => {
        setPage((draft) => { draft.nodes.splice(index, 1); });
    }

    const changeNodeValue = (index: number, value: string) => {
        setPage((draft) => { draft.nodes[index].value = value; });
    }

    const changeNodeType = (index: number, type: NodeType) => {
        setPage((draft) => {
            draft.nodes[index].type = type;
            draft.nodes[index].value = "";
        });
    }

    const setNodes = (nodes: NodeData[]) => {
        setPage((draft) => { draft.nodes = nodes; });
    }

    const setTitle = (title: string) => {
        setPage((draft) => { draft.title = title; });
    }

    const setCoverImage = (cover: string) => {
        setPage((draft) => { draft.cover = cover; });
    }

    const reorderNodes = (id1: string, id2: string) => {
        setPage((draft) => {
            const index1 = draft.nodes.findIndex(node => node.id === id1)
            const index2 = draft.nodes.findIndex(node => node.id === id2)
            draft.nodes = arrayMove(draft.nodes, index1, index2)
        })
    }

    return {
        nodes: page.nodes,
        title: page.title,
        cover: page.cover,
        addNode,
        removeNodeByIndex,
        changeNodeValue,
        changeNodeType,
        setNodes,
        setTitle,
        setCoverImage,
        reorderNodes,
    }
}