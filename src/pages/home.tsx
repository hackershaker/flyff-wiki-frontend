import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './home.css'
import { getDocuments } from '../services/documentService'

// Local storage keys shared with edit/view pages to keep a consistent document payload.
const STORAGE_KEY = 'docs_edit_content_json'
const META_KEY = 'docs_edit_meta'

/**
 * Extract the first H1 heading from a document JSON to build a readable title.
 *
 * @param {import('@tiptap/react').JSONContent | undefined | null} doc
 * The TipTap document JSON to parse for a title.
 * @returns {string} The extracted title or a fallback label.
 */
function extractTitle(doc) {
  if (!doc || !Array.isArray(doc.content)) {
    return '문서'
  }

  const headingNode = doc.content.find(
    (node) => node.type === 'heading' && node.attrs?.level === 1
  )
  const titleText = headingNode?.content?.map((node) => node.text).join('').trim()
  return titleText || '문서'
}

/**
 * Resolve the JSON document to store for the view page.
 *
 * - If the backend provided full TipTap JSON content, reuse it.
 * - If only a title exists, build a minimal document so the view page can render.
 *
 * @param {unknown} rawDocument
 * The raw document payload returned from the backend list API.
 * @param {string} fallbackTitle
 * The title to use when a full JSON document is not available.
 * @returns {import('@tiptap/react').JSONContent}
 * The JSON content that should be stored for the view page.
 */
function resolveViewContent(rawDocument, fallbackTitle) {
  if (rawDocument?.content && rawDocument.content.type === 'doc') {
    return rawDocument.content
  }

  if (rawDocument?.type === 'doc') {
    return rawDocument
  }

  return {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: fallbackTitle || '문서' }],
      },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: '내용이 없습니다. /edit에서 문서를 작성해 주세요.' }],
      },
    ],
  }
}

/**
 * Clear editor-related local storage to start a fresh document.
 *
 * - 인자: 없음.
 * - 리턴값: void.
 * - 사용 예시: `handleCreateDocClick()`에서 호출하여 새 문서 작성 모드로 전환합니다.
 * - 동작 흐름: 콘텐츠/메타 키 삭제 -> 다음 편집 진입 시 기본값 사용.
 * - 주의사항: 저장된 임시 편집 내용이 사라질 수 있으니 새 문서 작성 시에만 호출합니다.
 */
const resetEditorStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(META_KEY)
  } catch (error) {
    console.warn('Failed to reset editor storage', error)
  }
}

/**
 * Home page with a clean, card-based layout for categories and document lists.
 *
 * @returns {JSX.Element} Home page UI.
 */
export default function Home() {
  // Static categories keep the UI consistent while backend categories are planned.
  const categoryItems = [
    { id: 'jobs', title: '직업', description: '전직/스킬/빌드', href: '/view' },
    { id: 'items', title: '아이템', description: '장비/소모품/강화', href: '/view' },
    { id: 'monsters', title: '몬스터', description: '필드/던전/보스', href: '/view' },
    { id: 'quests', title: '퀘스트', description: '진행/보상/조건', href: '/view' },
    { id: 'maps', title: '지역', description: '사냥터/던전/이동', href: '/view' },
    { id: 'systems', title: '시스템', description: '성장/경제/기능', href: '/view' },
  ]

  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadDocuments = async () => {
      try {
        const list = await getDocuments()
        if (isMounted) {
          setDocuments(Array.isArray(list) ? list : [])
          setErrorMessage('')
        }
      } catch (error) {
        console.error('Failed to load documents', error)
        if (isMounted) {
          setErrorMessage('문서 목록을 불러오지 못했습니다.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadDocuments()

    return () => {
      isMounted = false
    }
  }, [])

  // Convert raw API documents into view models used by the UI sections.
  const viewModels = useMemo(() => {
    return documents.map((doc, index) => {
      // Prefer explicit title from the backend, fall back to extracting from JSON.
      const title = doc?.title?.trim() || extractTitle(doc?.content ?? doc)
      const category = doc?.category ?? '미분류'
      const savedAt = doc?.savedAt ? new Date(doc.savedAt) : null
      // Resolve a stable document identifier for history filtering and navigation.
      const resolvedId = doc?.id ?? doc?.savedAt ?? `doc-${index}`
      return {
        id: String(resolvedId),
        title,
        category,
        savedAt,
        rawDocument: doc,
      }
    })
  }, [documents])

  // Temporary heuristics until popularity data is available from the backend.
  const recentDocs = useMemo(() => viewModels.slice(0, 6), [viewModels])
  const hasDoc = viewModels.length > 0

  /**
   * Prepare a brand-new document by clearing stored editor data.
   *
   * - 인자: 없음.
   * - 리턴값: void.
   * - 사용 예시: "문서 작성" 버튼 클릭 시 호출합니다.
   * - 동작 흐름: 로컬 스토리지 초기화 -> 편집 화면에서 새 문서로 시작.
   */
  const handleCreateDocClick = () => {
    resetEditorStorage()
  }

  /**
   * Persist the selected document in localStorage so the view page renders it.
   *
   * @param {typeof viewModels[number]} doc
   * The view model containing the raw document payload and metadata.
   * @returns {void}
   * This function updates localStorage as a side effect for navigation.
   * - 참고사항: documentId를 저장하여 변경 이력 페이지에서 문서별로 필터링합니다.
   */
  const handleRecentDocClick = (doc) => {
    const viewContent = resolveViewContent(doc.rawDocument, doc.title)
    const updatedAt = doc.savedAt ? doc.savedAt.toISOString() : new Date().toISOString()

    localStorage.setItem(STORAGE_KEY, JSON.stringify(viewContent))
    localStorage.setItem(
      META_KEY,
      JSON.stringify({
        updatedAt,
        category: doc.category,
        documentId: doc.id,
      })
    )
  }

  return (
    <div className="home">
      <div className="home__container">
        <section className="home__hero card">
          <div className="home__hero-copy">
            <p className="home__eyebrow">Flyff Wiki</p>
            <h1 className="home__title">모두가 함께 만드는 게임 지식</h1>
            <p className="home__subtitle">
              검색하고, 읽고, 바로 기여할 수 있는 위키 홈입니다.
            </p>
          </div>
          <div className="home__hero-actions">
            <Link
              className="home__primary-button"
              to="/edit"
              onClick={handleCreateDocClick}
            >
              문서 작성
            </Link>
            <div className="home__hero-count">
              <span className="home__hero-count-label">저장된 문서</span>
              <span className="home__hero-count-value">
                {isLoading ? 0 : viewModels.length}개
              </span>
            </div>
          </div>
        </section>

        <section className="home__section card">
          <div className="home__section-header">
            <h2 className="home__section-title">빠른 카테고리</h2>
            <span className="home__section-count">총 {categoryItems.length}개</span>
          </div>
          <div className="home__category-grid">
            {categoryItems.map((category) => (
              <Link key={category.id} className="home__category-card" to={category.href}>
                <div className="home__category-title">{category.title}</div>
                <div className="home__category-desc">{category.description}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="home__section card">
          <div className="home__section-header">
            <h2 className="home__section-title">최근 업데이트</h2>
            <span className="home__section-count">
              총 {isLoading ? 0 : viewModels.length}개
            </span>
          </div>

          {isLoading && <div className="home__empty">문서 목록을 불러오는 중입니다.</div>}

          {!isLoading && errorMessage && (
            <div className="home__empty">{errorMessage}</div>
          )}

          {!isLoading && !errorMessage && !hasDoc && (
            <div className="home__empty">저장된 문서가 없습니다.</div>
          )}

          {!isLoading && !errorMessage && hasDoc && (
            <div className="home__recent-list">
              {recentDocs.map((doc) => (
                <Link
                  key={doc.id}
                  className="home__recent-link"
                  to="/view"
                  onClick={() => handleRecentDocClick(doc)}
                >
                  {doc.title}
                </Link>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
