import type {NodeData} from "../utils/types";
import {type ChangeEvent, useEffect, useRef } from "react";
import { useAppState } from "../state/AppStateContext";
import cx from "classnames";
import styles from "./Node.module.css";
import { FileImage } from "../components/FileImage";
import { uploadImage } from "../utils/uploadImage";
import { deleteImage } from "../utils/deleteImage";

type ImageNodeProps = {
    node: NodeData;
    isFocused: boolean;
    index: number;
    updateFocusedIndex: (index: number) => void;
};

export const ImageNode = ({ node, isFocused, index, updateFocusedIndex }: ImageNodeProps) => {
    const { removeNodeByIndex, changeNodeValue, changeNodeType } = useAppState();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const didOpen = useRef(false);

    useEffect(() => {
        if (!node.value && !didOpen.current) {
            didOpen.current = true;
            fileInputRef.current?.click();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            event.preventDefault();
            if (event.key === "Backspace") {
                if (node.value) deleteImage(node.value);
                removeNodeByIndex(index);
            }
            if (event.key === "Enter") {
                fileInputRef.current?.click();
            }
        };
        if (isFocused) {
            window.addEventListener("keydown", handleKeyDown);
        } else {
            window.removeEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isFocused, removeNodeByIndex, index, node.value]);

    const onImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const target = event.target;
        if (!target.files) {
            changeNodeType(index, "text");
            return;
        }
        try {
            const result = await uploadImage(target.files[0]);
            if (result?.filePath) {
                changeNodeValue(index, result.filePath);
            }
        } catch {
            changeNodeType(index, "text");
        }
    };

    return (
        <div
            className={cx(styles.node, styles.image, {
                [styles.focused]: isFocused,
            })}
            onClick={() => updateFocusedIndex(index)}
        >
            <FileImage filePath={node.value} />
            <input
                type="file"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={onImageUpload}
            />
        </div>
    );
};