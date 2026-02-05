import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './home.css'
import { getDocuments } from '../services/documentService.js'

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
      return {
        id: doc?.id ?? doc?.savedAt ?? `doc-${index}`,
        title,
        category,
        savedAt,
      }
    })
  }, [documents])

  // Temporary heuristics until popularity data is available from the backend.
  const recentDocs = useMemo(() => viewModels.slice(0, 6), [viewModels])
  const popularDocs = useMemo(() => viewModels.slice(0, 6), [viewModels])

  const hasDoc = viewModels.length > 0

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
            <Link className="home__primary-button" to="/edit">
              문서 작성
            </Link>
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
            <div className="home__list">
              {recentDocs.map((doc) => (
                <div className="home__card" key={doc.id}>
                  <div className="home__card-main">
                    <div className="home__card-title">{doc.title}</div>
                    <div className="home__card-badge">{doc.category}</div>
                    <div className="home__card-meta">
                      마지막 저장:{' '}
                      {doc.savedAt ? doc.savedAt.toLocaleString('ko-KR') : '기록 없음'}
                    </div>
                  </div>
                  <div className="home__card-actions">
                    <Link className="home__link" to="/view">
                      보기
                    </Link>
                    <Link className="home__link" to="/edit">
                      편집
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="home__section card">
          <div className="home__section-header">
            <h2 className="home__section-title">인기 문서</h2>
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
            <div className="home__list">
              {popularDocs.map((doc) => (
                <div className="home__card" key={`${doc.id}-popular`}>
                  <div className="home__card-main">
                    <div className="home__card-title">{doc.title}</div>
                    <div className="home__card-badge">{doc.category}</div>
                    <div className="home__card-meta">
                      마지막 저장:{' '}
                      {doc.savedAt ? doc.savedAt.toLocaleString('ko-KR') : '기록 없음'}
                    </div>
                  </div>
                  <div className="home__card-actions">
                    <Link className="home__link" to="/view">
                      보기
                    </Link>
                    <Link className="home__link" to="/edit">
                      편집
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
