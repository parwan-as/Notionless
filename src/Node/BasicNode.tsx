import type {NodeData, NodeType} from "../utils/types";
import styles from "./Node.module.css";
import {
    useEffect,
    useRef,
    type FormEventHandler,
    type KeyboardEventHandler,
} from "react";
import { nanoid } from "nanoid";
import {useAppState} from "../state/AppStateContext.tsx";
import {CommandPanel} from "./CommandPanel.tsx";
import cx from "classnames";

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
    const showCommandPanel = isFocused && node?.value?.match(/^\//);

    const { changeNodeValue, removeNodeByIndex, addNode, changeNodeType } = useAppState();

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

    const parseCommand = (nodeType: NodeType) => {
        if (nodeRef.current) {
            changeNodeType(index, nodeType);
            nodeRef.current.textContent = "";
        }
    };

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
            if (node.type === "list" && target.textContent?.length === 0) {
                changeNodeType(index, "text");
                return;
            }
            addNode({type: node.type, id: nanoid(), value: ""}, index + 1);
            updateFocusedIndex(index + 1);
        }
        if (event.key === "Tab") {
            event.preventDefault();
        }
        if (event.key === "Backspace") {
            if (target.textContent?.length === 0) {
                event.preventDefault();
                if (node.type === "list") {
                    changeNodeType(index, "text");
                    return;
                }
                removeNodeByIndex(index);
                updateFocusedIndex(index - 1);
            } else if (window?.getSelection()?.anchorOffset === 0) {
                event.preventDefault();
                removeNodeByIndex(index - 1);
                updateFocusedIndex(index - 1);
            }
        }
    }

    return (
        <div style={{ position: "relative" }}>
            {showCommandPanel && (
                <CommandPanel selectItem={parseCommand} nodeText={node.value} />
            )}
            <div
                onInput={handleInput}
                onClick={handleClick}
                onKeyDown={onKeyDown}
                ref={nodeRef}
                contentEditable
                suppressContentEditableWarning
                className={cx(styles.node, styles[node.type])}
            />
        </div>
    );
};