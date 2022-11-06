import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './Layout';
import Battle from './pages/Battle';
import Editor from './pages/Editor';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Editor />} />
          <Route path="battle" element={<Battle />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
