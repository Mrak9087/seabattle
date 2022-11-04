import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import EditorBlock from './EditorBlock';

import './editor.css';

const Editor = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="editor">
        <EditorBlock />
      </div>
    </DndProvider>
  );
};

export default Editor;
