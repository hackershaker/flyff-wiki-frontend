import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './home.css'
import { getDocuments } from '../services/documentService.js'

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

  const viewModels = useMemo(() => {
    return documents.map((doc, index) => {
      const title = extractTitle(doc?.content ?? doc)
      const savedAt = doc?.savedAt ? new Date(doc.savedAt) : null
      return {
        id: doc?.id ?? doc?.savedAt ?? `doc-${index}`,
        title,
        savedAt,
      }
    })
  }, [documents])

  const hasDoc = viewModels.length > 0

  return (
    <div className="home">
      <div className="home__container">
        <div className="home__header">
          <div>
            <p className="home__eyebrow">Flyff Wiki</p>
            <h1 className="home__title">문서 관리</h1>
            <p className="home__subtitle">저장된 문서 목록을 확인하고 새 문서를 작성하세요.</p>
          </div>
          <Link className="home__primary-button" to="/edit">
            문서 작성
          </Link>
        </div>

        <div className="home__section">
          <div className="home__section-header">
            <h2 className="home__section-title">현재 저장된 문서</h2>
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
              {viewModels.map((doc) => (
                <div className="home__card" key={doc.id}>
                  <div className="home__card-main">
                    <div className="home__card-title">{doc.title}</div>
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
        </div>
      </div>
    </div>
  )
}
