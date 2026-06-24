import type {NodeData} from "../utils/types";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../state/AppStateContext";
import { createLinkedPage, deletePage, fetchPageTitle } from "../utils/pages";
import cx from "classnames";
import styles from "./Node.module.css"

type PageNodeProps = {
    node: NodeData;
    isFocused: boolean;
    index: number;
    updateFocusedIndex: (index: number) => void;
};

export const PageNode = ({ node, isFocused, index, updateFocusedIndex }: PageNodeProps) => {
    const navigate = useNavigate();
    const [pageTitle, setPageTitle] = useState("");
    const { removeNodeByIndex, changeNodeValue } = useAppState();
    const inputRef = useRef<HTMLInputElement>(null);

    const displayName = pageTitle || node.value;
    const goToPage = () => navigate(`/${node.value}`);

    useEffect(() => {
        if (isFocused && !node.value) {
            inputRef.current?.focus();
        }
    }, [isFocused, node.value]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!node.value) return;
            if (event.key === "Backspace") {
                event.preventDefault();
                removeNodeByIndex(index);
            }
            if (event.key === "Enter") {
                event.preventDefault();
                navigate(`/${node.value}`);
            }
        };
        if (isFocused) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isFocused, removeNodeByIndex, index, navigate, node.value]);

    useEffect(() => {
        if (node.value) {
            fetchPageTitle(node.value).then((title) => {
                if (title) setPageTitle(title);
            });
        }
    }, [node.value]);

    const handleCreate = async (title: string) => {
        if (!title.trim()) {
            removeNodeByIndex(index);
            return;
        }
        const slug = await createLinkedPage(title);
        if (!slug) return;
        setPageTitle(title);
        changeNodeValue(index, slug);
    };

    const handleDelete = async () => {
        if (window.confirm(`Delete "${displayName}"? This cannot be undone.`)) {
            await deletePage(node.value);
            removeNodeByIndex(index);
        }
    };

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleCreate(event.currentTarget.value);
        }
        if (event.key === "Escape") {
            removeNodeByIndex(index);
        }
    };

    if (!node.value) {
        return (
            <input
                ref={inputRef}
                className={cx(styles.node, styles.page)}
                placeholder="Page title..."
                onKeyDown={handleInputKeyDown}
                onBlur={(e) => handleCreate(e.target.value)}
                onClick={() => updateFocusedIndex(index)}
            />
        );
    }

    return (
        <div
            className={cx(styles.node, styles.page, styles.pageLink, {
                [styles.focused]: isFocused,
            })}
        >
            <span onClick={goToPage}>📄 {displayName}</span>
            <button className={styles.pageDelete} onClick={handleDelete}>
                ✕
            </button>
        </div>
    );
};
