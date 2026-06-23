import type {NodeData} from "../utils/types";
import styles from "./Node.module.css";
import {
    useEffect,
    useRef,
    type FormEventHandler,
    type KeyboardEventHandler,
} from "react";
import { nanoid } from "nanoid";
import {useAppState} from "../state/AppStateContext.tsx";

type BasicNodeProps = {
    node: NodeData;
    updateFocusedIndex(index: number): void;
    isFocused: boolean;
    index: number;
};

export const BasicNode = ({
                              node,
                              updateFocusedIndex,
                              isFocused,
                              index,
                          }: BasicNodeProps) => {
    const nodeRef = useRef<HTMLDivElement>(null);

    const { changeNodeValue, removeNodeByIndex, addNode } = useAppState();

    useEffect(() => {
        if (isFocused) {
            nodeRef.current?.focus();
        } else {
            nodeRef.current?.blur();
        }
    }, [isFocused]);

    useEffect(() => {
        if (nodeRef.current && !isFocused) {
            nodeRef.current.textContent = node.value;
        }
    }, [isFocused, node]);

    const handleInput: FormEventHandler<HTMLDivElement> = ({currentTarget}) => {
        const {textContent} = currentTarget;
        changeNodeValue(index, textContent);
    }

    const handleClick = () => {
        updateFocusedIndex(index);
    }

    const onKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
        const target = event.target as HTMLDivElement;
        if (event.key === "Enter") {
            event.preventDefault();
            if (target.textContent?.[0] === "/") {
                return;
            }
            addNode({type: node.type, id: nanoid(), value: ""}, index + 1);
            updateFocusedIndex(index + 1);
        }
        if (event.key === "Backspace") {
            if (target.textContent?.length === 0) {
                event.preventDefault();
                removeNodeByIndex(index);
                updateFocusedIndex(index - 1);
            } else if (window?.getSelection()?.anchorOffset === 0) {
                event.preventDefault();
                removeNodeByIndex(index - 1);
                updateFocusedIndex(index - 1);
            }
        }
    }

    return <div
        ref={nodeRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onClick={handleClick}
        onKeyDown={onKeyDown}
        className={styles.node}
    />
};