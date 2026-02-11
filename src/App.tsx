import './App.css'
import DocsEdit from './pages/docs_edit'
import DocsView from './pages/docs_view'
import History from './pages/history'
import Home from './pages/home'
import EditorTestPage from './pages/editor_test'

import Header from './components/Header'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit" element={<DocsEdit />} />
        <Route path="/view" element={<DocsView />} />
        <Route path="/history" element={<History />} />
        <Route path="/editor-test" element={<EditorTestPage />} />
      </Routes>
    </div>
  )
}

export default App
