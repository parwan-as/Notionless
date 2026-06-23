import { nanoid } from "nanoid";

export const createPage = () => {
    const slug = nanoid();
    const id = nanoid();

    return {
        id,
        slug,
        title: "Untitled",
        nodes: [],
        cover: "notionless-banner.png",
    }
}