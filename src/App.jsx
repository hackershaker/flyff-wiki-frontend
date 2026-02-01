import './App.css'
import DocsEdit from './pages/docs_edit.jsx'
import DocsView from './pages/docs_view.jsx'
import Home from './pages/home.jsx'

function App() {
  const pathname = window.location.pathname

  if (pathname === '/edit') {
    return <DocsEdit />
  }
  if (pathname === '/view') {
    return <DocsView />
  }

  return <Home />
}

export default App
