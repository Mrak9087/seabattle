import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Link } from "react-router-dom";
import EditorBlock from "./EditorBlock";

const Editor = () => {
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="editor">
            <EditorBlock />
            <Link to='/battle'>В бой</Link>
            </div>
        </DndProvider>
    )
}

export default Editor;