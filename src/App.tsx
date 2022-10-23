import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';
import BattleField from './components/BattleField';
import Editor from './pages/Editor';

function App() {
  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <Editor />
      </DndProvider>
    </div>
  );
}

export default App;
