import './App.css'
import DocsEdit from './pages/docs_edit.jsx'
import DocsView from './pages/docs_view.jsx'
import Home from './pages/home.jsx'

import Header from './components/Header.jsx'

function App() {
  const pathname = window.location.pathname
  let content = <Home />

  if (pathname === '/edit') {
    content = <DocsEdit />
  }
  if (pathname === '/view') {
    content = <DocsView />
  }

  return <div>
    <Header />
    {content}
  </div>
}

export default App
