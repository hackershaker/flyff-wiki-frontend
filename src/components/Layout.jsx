import './Layout.css'

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="app-header__brand" href="/">
          <span className="app-header__logo">F</span>
          <span className="app-header__title">Flyff Wiki</span>
        </a>
        <nav className="app-header__nav">
          <a className="app-header__link" href="/">홈</a>
          <a className="app-header__link" href="/edit">편집</a>
          <a className="app-header__link" href="/view">보기</a>
        </nav>
      </header>
      <main className="app-main">{children}</main>
    </div>
    
  )
}
