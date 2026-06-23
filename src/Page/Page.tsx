import { useFocusedNodeIndex } from "./useFocusedNodeIndex";
import { Cover } from "./Cover";
import { Spacer } from "./Spacer";
import { Title } from "./Title";
import { nanoid } from "nanoid";
import {BasicNode} from "../Node/BasicNode.tsx";
import {useAppState} from "../state/AppStateContext.tsx";

export const Page = () => {
    const {title, nodes, addNode, setTitle} = useAppState();
    const [focusedNodeIndex, setFocusedNodeIndex] = useFocusedNodeIndex({ nodes });

    return (
        <>
            <Cover />
            <div>
                <Title title={title} changePageTitle={setTitle} addNode={addNode} />
                {nodes.map((node, index) => (
                    <BasicNode
                        key={node.id}
                        node={node}
                        isFocused={focusedNodeIndex === index}
                        updateFocusedIndex={setFocusedNodeIndex}
                        index={index}
                    />
                ))}
                <Spacer
                    handleClick={() => addNode({type: "text", id: nanoid(), value: ""}, nodes.length)}
                    showHint={!nodes.length}
                />
            </div>
        </>
    )


};