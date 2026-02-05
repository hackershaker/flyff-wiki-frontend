import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

const THEME_STORAGE_KEY = 'flyff-wiki-theme'

/**
 * Determine the initial theme to apply to the document.
 *
 * - Uses the persisted preference if available.
 * - Falls back to the system preference when no setting is stored.
 * - Defaults to light to avoid flashing on first render.
 *
 * @returns {'light' | 'dark'} The theme to apply at startup.
 */
function getInitialTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') {
    return stored
  }
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  return prefersDark ? 'dark' : 'light'
}

export default function Header() {
  const [theme, setTheme] = useState(getInitialTheme)

  // Apply the theme to the document root and persist it for future visits.
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  // Toggle between light and dark mode for the user.
  const handleToggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'))
  }

  const themeLabel = theme === 'dark' ? '라이트 모드' : '다크 모드'

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
      <button
        type="button"
        className="app-header__theme-toggle"
        onClick={handleToggleTheme}
        aria-pressed={theme === 'dark'}
      >
        {themeLabel}
      </button>
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
