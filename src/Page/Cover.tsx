import { useRef, type ChangeEventHandler } from "react";
import styles from "./Cover.module.css";


export const Cover = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onChangeCoverImage = () => {
        fileInputRef.current?.click();
    };

    const onCoverImageUpload: ChangeEventHandler<HTMLInputElement> = async (event) => {
        const target = event.target;
        console.log(target);
    };

    return (
        <div className={styles.cover}>
            <img src="/notionless-banner.png" alt="Cover" className={styles.image} />
            <button className={styles.button} onClick={onChangeCoverImage}>
                Change cover
            </button>
            <input
                onChange={onCoverImageUpload}
                style={{ display: "none" }}
                ref={fileInputRef}
                type="file"
            />
        </div>
    );
};