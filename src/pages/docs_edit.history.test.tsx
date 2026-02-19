import { render, screen, waitFor } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

import DocsEdit from './docs_edit'
import { server } from '../mocks/node'
import { MemoryRouter } from 'react-router-dom'

const STORAGE_KEY = 'docs_edit_content_json'
const META_KEY = 'docs_edit_meta'
const HISTORY_KEY = 'docs_edit_history'

/**
 * Build a minimal TipTap document JSON with a title and a paragraph.
 *
 * - 인자: `title`(문서 제목), `contentText`(본문 텍스트).
 * - 리턴값: TipTap JSON 문서 객체.
 * - 사용 예시: `buildDocument('문서 1', '내용 1')`.
 * - 동작 흐름: H1 제목 노드 + 본문 문단 노드 생성 -> doc 래핑 -> 반환.
 * - 주의사항: 제목은 H1로 넣어 편집 화면에서 타이틀로 분리됩니다.
 */
const buildDocument = (title, contentText) => ({
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: title }],
    },
    {
      type: 'paragraph',
      content: [{ type: 'text', text: contentText }],
    },
  ],
})

/**
 * Clear editor-related local storage keys to start a fresh document.
 *
 * - 인자: 없음.
 * - 리턴값: void.
 * - 사용 예시: `resetEditorStorage()`로 새 문서 작성 흐름을 만들 수 있습니다.
 * - 동작 흐름: 콘텐츠/메타 키 삭제.
 * - 주의사항: 임시 편집 내용이 사라질 수 있습니다.
 */
const resetEditorStorage = () => {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(META_KEY)
}

/**
 * Save a document through the DocsEdit UI and return the stored document id.
 *
 * - 인자: `doc`(TipTap JSON 문서).
 * - 리턴값: 저장 후 생성/사용된 문서 id 문자열.
 * - 사용 예시: `const docId = await saveDocumentThroughEditor(doc)`.
 * - 동작 흐름: 로컬 스토리지에 문서 저장 -> 컴포넌트 렌더 -> 저장 클릭 -> 이력/메타 반영 대기.
 * - 주의사항: 비동기 저장이 완료될 때까지 `waitFor`로 기다립니다.
 */
const saveDocumentThroughEditor = async (doc) => {
  const previousHistoryLength = JSON.parse(
    localStorage.getItem(HISTORY_KEY) ?? '[]'
  ).length
  localStorage.setItem(STORAGE_KEY, JSON.stringify(doc))
  const { unmount } = render(
    <MemoryRouter>
      <DocsEdit />
    </MemoryRouter>
  )

  screen.getByRole('button', { name: '문서 저장' }).click()

  await waitFor(() => {
    const meta = JSON.parse(localStorage.getItem(META_KEY) ?? '{}')
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]')
    expect(meta.documentId).toBeTruthy()
    expect(history.length).toBeGreaterThan(previousHistoryLength)
  })

  const meta = JSON.parse(localStorage.getItem(META_KEY) ?? '{}')
  unmount()
  return String(meta.documentId)
}

describe('DocsEdit history flow', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  it('tracks history per document across create and edit flows', async () => {
    const doc1 = buildDocument('문서1', '내용1')
    const doc2 = buildDocument('문서2', '내용2')
    const doc1Edited = buildDocument('문서1', '내용1-편집')

    // 1) 문서1 생성
    const doc1Id = await saveDocumentThroughEditor(doc1)

    // 2) 문서2 생성 (새 문서 모드로 전환)
    resetEditorStorage()
    const doc2Id = await saveDocumentThroughEditor(doc2)

    // 3) 문서1 편집: 메타를 문서1로 되돌린 뒤 저장
    localStorage.setItem(
      META_KEY,
      JSON.stringify({ documentId: doc1Id, category: 'jobs', updatedAt: new Date().toISOString() })
    )
    await saveDocumentThroughEditor(doc1Edited)

    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]')
    const doc1History = history.filter(
      (entry) => String(entry?.documentId ?? '') === String(doc1Id)
    )
    const doc2History = history.filter(
      (entry) => String(entry?.documentId ?? '') === String(doc2Id)
    )

    expect(doc1History).toHaveLength(2)
    expect(doc2History).toHaveLength(1)
  })
})
