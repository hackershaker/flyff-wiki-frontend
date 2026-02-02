import './App.css'
import DocsEdit from './pages/docs_edit.jsx'
import DocsView from './pages/docs_view.jsx'
import Home from './pages/home.jsx'
import EditorTestPage from './pages/editor_test.jsx'

import Header from './components/Header.jsx'

function App() {
  const pathname = window.location.pathname
  let content = <Home />

  if (pathname === '/edit') {
    content = <DocsEdit />
  } else if (pathname === '/view') {
    content = <DocsView />
  } else if (pathname === '/editor-test') {
    content = <EditorTestPage />
  }

  return <div>
    <Header />
    {content}
  </div>
}

export default App
