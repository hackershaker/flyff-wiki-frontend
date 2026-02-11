import './Layout.css'

export default function Layout({ children }) {
  /**
   * Reset editor storage when starting a brand-new document from the header.
   *
   * - 인자: 없음.
   * - 리턴값: void.
   * - 사용 예시: 헤더의 "편집" 메뉴 클릭 시 호출합니다.
   * - 동작 흐름: 로컬 스토리지의 문서/메타 키 삭제 -> 편집 화면에서 새 문서 시작.
   * - 주의사항: 기존 임시 편집 내용이 제거되므로 새 문서 작성에만 사용합니다.
   */
  const handleNewDocClick = () => {
    try {
      localStorage.removeItem('docs_edit_content_json')
      localStorage.removeItem('docs_edit_meta')
    } catch (error) {
      console.warn('Failed to reset editor storage from header', error)
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="app-header__brand" href="/">
          <span className="app-header__logo">F</span>
          <span className="app-header__title">Flyff Wiki</span>
        </a>
        <nav className="app-header__nav">
          <a className="app-header__link" href="/">
            홈
          </a>
          <a className="app-header__link" href="/edit" onClick={handleNewDocClick}>
            편집
          </a>
          <a className="app-header__link" href="/view">
            보기
          </a>
        </nav>
      </header>
      <main className="app-main">{children}</main>
    </div>
  )
}
