import { Link } from 'react-router-dom'
import './Header.css'

export default function Header() {
  return (
    <header className="app-header">
      <Link className="app-header__brand" to="/">
        <span className="app-header__logo">F</span>
        <span className="app-header__title">Flyff Wiki</span>
      </Link>
      <div className="app-header__spacer" />
      <div className="app-header__search">
        <input
          className="app-header__search-input"
          type="search"
          placeholder="문서 검색"
          aria-label="문서 검색"
        />
        <button type="button" className="app-header__search-button">
          검색
        </button>
      </div>
      <div className="app-header__user">
        <span className="app-header__user-icon" aria-hidden="true">
          👤
        </span>
        <div className="app-header__user-info">
          <span className="app-header__user-name">홍길동</span>
          <span className="app-header__user-sub">로그인</span>
        </div>
      </div>
    </header>
  )
}
