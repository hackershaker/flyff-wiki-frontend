import './App.css'
import DocsEdit from './pages/docs_edit.jsx'
import DocsView from './pages/docs_view.jsx'
import Home from './pages/home.jsx'
import EditorTestPage from './pages/editor_test.jsx'

import Header from './components/Header.jsx'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit" element={<DocsEdit />} />
        <Route path="/view" element={<DocsView />} />
        <Route path="/editor-test" element={<EditorTestPage />} />
      </Routes>
    </div>
  )
}

export default App
