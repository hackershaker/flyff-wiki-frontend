import { useMemo } from 'react'
import './history.css'

const HISTORY_KEY = 'docs_edit_history'
const META_KEY = 'docs_edit_meta'

/**
 * Load and normalize history entries from local storage.
 *
 * @param {string} documentId
 * The current document identifier used to filter history entries.
 * @returns {Array<{ id: string, title: string, editorId: string, editedAt: string, documentId: string }>}
 * The history entries filtered by document and sorted by most recent first.
 * @example
 * const entries = loadHistoryEntries('doc-123')
 */
const loadHistoryEntries = (documentId) => {
  try {
    const stored = localStorage.getItem(HISTORY_KEY)
    const parsed = stored ? JSON.parse(stored) : []
    if (!Array.isArray(parsed)) {
      return []
    }
    if (!documentId) {
      return []
    }
    return parsed.filter(
      (entry) => String(entry?.documentId ?? '') === String(documentId)
    )
  } catch (error) {
    console.warn('Failed to load history entries', error)
    return []
  }
}

/**
 * Resolve the current document id from stored editor metadata.
 *
 * @returns {string}
 * The current document id or an empty string when not available.
 * @example
 * const documentId = resolveCurrentDocumentId()
 */
const resolveCurrentDocumentId = () => {
  try {
    const metaRaw = localStorage.getItem(META_KEY)
    if (!metaRaw) {
      return ''
    }
    const meta = JSON.parse(metaRaw)
    return meta?.documentId ? String(meta.documentId) : ''
  } catch (error) {
    console.warn('Failed to parse stored meta for history', error)
    return ''
  }
}

/**
 * Format an ISO timestamp for display in the history list.
 *
 * @param {string | undefined | null} editedAt
 * The ISO timestamp from a history entry.
 * @returns {string}
 * A human-friendly formatted timestamp.
 * @example
 * formatEditedAt('2025-01-01T00:00:00Z')
 */
const formatEditedAt = (editedAt) => {
  if (!editedAt) {
    return '기록 없음'
  }
  const parsed = new Date(editedAt)
  if (Number.isNaN(parsed.getTime())) {
    return '기록 없음'
  }
  return parsed.toLocaleString('ko-KR')
}

/**
 * History page showing recent document edits.
 *
 * @returns {JSX.Element} The history page layout.
 */
export default function History() {
  const documentId = useMemo(() => resolveCurrentDocumentId(), [])
  const historyItems = useMemo(() => loadHistoryEntries(documentId), [documentId])
  const hasDocument = Boolean(documentId)
  const hasHistory = historyItems.length > 0

  return (
    <div className="history">
      <div className="history__container">
        <section className="history__section card">
          <div className="history__header">
            <div>
              <p className="history__eyebrow">Flyff Wiki</p>
              <h1 className="history__title">변경 이력</h1>
              <p className="history__subtitle">최근 수정 기록을 목록으로 확인합니다.</p>
            </div>
            <span className="history__count">총 {historyItems.length}건</span>
          </div>

          {!hasDocument && (
            <div className="history__empty">
              문서를 선택한 뒤 변경 이력으로 이동해 주세요.
            </div>
          )}

          {hasDocument && !hasHistory && (
            <div className="history__empty">변경 이력이 없습니다.</div>
          )}

          {hasDocument && hasHistory && (
            <div className="history__table">
              <div className="history__row history__row--head">
                <span className="history__cell">문서 제목</span>
                <span className="history__cell">바꾼 사람 아이디</span>
                <span className="history__cell">바꾼 시간</span>
              </div>
              {historyItems.map((item, index) => (
                <div className="history__row" key={`${item.id}-${index}`}>
                  <span className="history__cell">
                    <span className="history__cell-label">문서 제목</span>
                    <span className="history__cell-value">{item.title || '문서'}</span>
                  </span>
                  <span className="history__cell">
                    <span className="history__cell-label">바꾼 사람 아이디</span>
                    <span className="history__cell-value">{item.editorId || 'guest'}</span>
                  </span>
                  <span className="history__cell">
                    <span className="history__cell-label">바꾼 시간</span>
                    <span className="history__cell-value">{formatEditedAt(item.editedAt)}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
