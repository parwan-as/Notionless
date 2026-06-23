import { useEffect, useState } from "react";
import type {NodeType} from "../utils/types";
import { useOverflowsScreenBottom } from "./useOverflowsScreenBottom";
import styles from "./CommandPanel.module.css";
import cx from "classnames";

type CommandPanelProps = {
    nodeText: string;
    selectItem: (nodeType: NodeType) => void;
};

type SupportedNodeType = {
    value: NodeType;
    name: string;
};

const supportedNodeTypes: SupportedNodeType[] = [
    { value: "text", name: "Text" },
    { value: "list", name: "List" },
    { value: "page", name: "Page" },
    { value: "image", name: "Image" },
    { value: "heading1", name: "Heading 1" },
    { value: "heading2", name: "Heading 2" },
    { value: "heading3", name: "Heading 3" },
];

export const CommandPanel = ({ selectItem, nodeText }: CommandPanelProps) => {
    const { overflows, ref } = useOverflowsScreenBottom();
    const normalizedValue = nodeText.toLowerCase().replace(/\//, "");
    const matchedIndex = supportedNodeTypes.findIndex((item) => item.value.match(normalizedValue));
    const selectedItemIndex = matchedIndex === -1 ? 0 : matchedIndex;

    const [highlightedIndex, setHighlightedIndex] = useState(selectedItemIndex);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                selectItem(supportedNodeTypes[highlightedIndex].value);
            }
            if (event.key === "ArrowDown") {
                event.preventDefault();
                setHighlightedIndex((prev) => Math.min(prev + 1, supportedNodeTypes.length - 1));
            }
            if (event.key === "ArrowUp") {
                event.preventDefault();
                setHighlightedIndex((prev) => Math.max(prev - 1, 0));
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [highlightedIndex, selectItem]);

    return (
        <div
            ref={ref}
            onMouseDown={(e) => e.preventDefault()}
            className={cx(styles.panel, {
                [styles.reverse]: overflows,
            })}
        >
            <div className={styles.title}>Blocks</div>
            <ul>
                {supportedNodeTypes.map((type, index) => {
                    const selected = highlightedIndex === index;

                    return (
                        <li
                            key={type.value}
                            className={cx({
                                [styles.selected]: selected,
                            })}
                            onClick={() => selectItem(type.value)}
                        >
                            {type.name}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};