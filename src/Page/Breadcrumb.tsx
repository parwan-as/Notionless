import { useNavigate, useMatch } from "react-router-dom";
import { supabase } from "../supabaseClient";
import styles from "./Breadcrumb.module.css";

export const Breadcrumb = ({ title }: { title: string }) => {
    const navigate = useNavigate();
    const slugMatch = useMatch("/:slug");
    const startMatch = useMatch("/start");
    const isSubPage = slugMatch && !startMatch;

    return (
        <div className={styles.breadcrumb}>
            {isSubPage && (
                <>
                    <button className={styles.back} onClick={() => navigate("/")}>
                        ← Home
                    </button>
                    <span className={styles.separator}>/</span>
                    <span className={styles.current}>{title || "Untitled"}</span>
                </>
            )}
            <button
                className={styles.logout}
                onClick={() => supabase.auth.signOut()}
            >
                Log out
            </button>
        </div>
    );
};
