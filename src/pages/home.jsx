import { useMemo } from 'react'
import './home.css'

const STORAGE_KEY = 'docs_edit_content_json'
const META_KEY = 'docs_edit_meta'

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

export default function Home() {
  const { hasDoc, title, updatedAt } = useMemo(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        return { hasDoc: false }
      }
      const doc = JSON.parse(stored)
      const metaRaw = localStorage.getItem(META_KEY)
      const meta = metaRaw ? JSON.parse(metaRaw) : null
      const updated = meta?.updatedAt ? new Date(meta.updatedAt) : null

      return {
        hasDoc: true,
        title: extractTitle(doc),
        updatedAt: updated,
      }
    } catch (error) {
      console.warn('Failed to load saved docs', error)
      return { hasDoc: false }
    }
  }, [])

  return (
    <div className="home">
      <div className="home__container">
        <div className="home__header">
          <div>
            <p className="home__eyebrow">Flyff Wiki</p>
            <h1 className="home__title">문서 관리</h1>
            <p className="home__subtitle">저장된 문서 목록을 확인하고 새 문서를 작성하세요.</p>
          </div>
          <a className="home__primary-button" href="/edit">
            문서 작성
          </a>
        </div>

        <div className="home__section">
          <div className="home__section-header">
            <h2 className="home__section-title">현재 저장된 문서</h2>
          </div>

          {!hasDoc && <div className="home__empty">저장된 문서가 없습니다.</div>}

          {hasDoc && (
            <div className="home__list">
              <div className="home__card">
                <div className="home__card-main">
                  <div className="home__card-title">{title}</div>
                  <div className="home__card-meta">
                    마지막 저장:{' '}
                    {updatedAt ? updatedAt.toLocaleString('ko-KR') : '기록 없음'}
                  </div>
                </div>
                <div className="home__card-actions">
                  <a className="home__link" href="/view">
                    보기
                  </a>
                  <a className="home__link" href="/edit">
                    편집
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
