import { useNavigate, useMatch } from "react-router-dom";
import styles from "./Breadcrumb.module.css";

export const Breadcrumb = ({ title }: { title: string }) => {
    const navigate = useNavigate();
    const slugMatch = useMatch("/:slug");
    const startMatch = useMatch("/start");
    const isSubPage = slugMatch && !startMatch;

    if (!isSubPage) return null;

    return (
        <div className={styles.breadcrumb}>
            <button className={styles.back} onClick={() => navigate("/")}>
                ← Home
            </button>
            <span className={styles.separator}>/</span>
            <span className={styles.current}>{title || "Untitled"}</span>
        </div>
    );
};
