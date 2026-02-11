import { http } from 'msw'

const DOCUMENTS_STORAGE_KEY_PREFIX = 'msw_documents'

/**
 * Resolve the storage key for MSW documents.
 *
 * - 인자: 없음.
 * - 리턴값: 로컬 스토리지 키 문자열.
 * - 사용 예시: `const key = resolveDocumentsStorageKey()`.
 * - 동작 흐름: dev 서버 ID 확인 -> 접두사와 조합 -> 키 반환.
 * - 주의사항: dev 서버 ID가 없으면 기본 접두사를 그대로 사용합니다.
 * - 참고사항: dev 서버 재시작 시 키가 바뀌어 문서가 초기화됩니다.
 */
const resolveDocumentsStorageKey = () => {
  // eslint-disable-next-line no-undef
  const serverId = typeof __DEV_SERVER_ID__ !== 'undefined' ? __DEV_SERVER_ID__ : ''
  return serverId ? `${DOCUMENTS_STORAGE_KEY_PREFIX}_${serverId}` : DOCUMENTS_STORAGE_KEY_PREFIX
}

/**
 * Load persisted MSW documents from localStorage (browser only).
 *
 * - 인자: 없음.
 * - 리턴값: 문서 배열.
 * - 사용 예시: `const docs = loadStoredDocuments()`.
 * - 동작 흐름: localStorage 접근 가능 여부 확인 -> JSON 파싱 -> 배열 반환.
 * - 주의사항: Node 환경에서는 localStorage가 없어 빈 배열을 반환합니다.
 */
const loadStoredDocuments = () => {
  if (typeof localStorage === 'undefined') {
    return []
  }
  try {
    const stored = localStorage.getItem(resolveDocumentsStorageKey())
    const parsed = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.warn('Failed to load stored MSW documents', error)
    return []
  }
}

/**
 * Persist MSW documents into localStorage (browser only).
 *
 * - 인자: `documents`(문서 배열).
 * - 리턴값: void.
 * - 사용 예시: `persistDocuments(savedDocuments)`.
 * - 동작 흐름: localStorage 접근 가능 여부 확인 -> JSON 직렬화 -> 저장.
 * - 주의사항: 저장 실패 시 무시하고 경고 로그를 남깁니다.
 */
const persistDocuments = (documents) => {
  if (typeof localStorage === 'undefined') {
    return
  }
  try {
    localStorage.setItem(resolveDocumentsStorageKey(), JSON.stringify(documents))
  } catch (error) {
    console.warn('Failed to persist MSW documents', error)
  }
}

/**
 * Normalize the document id into a string for comparisons and storage.
 *
 * - 인자: `value`(string/number/undefined).
 * - 리턴값: 문자열 id 또는 빈 문자열.
 * - 사용 예시: `const id = normalizeDocumentId(payload.id)`.
 * - 동작 흐름: nullish 체크 -> 문자열 변환 -> trim -> 반환.
 * - 주의사항: 빈 문자열은 유효하지 않은 id로 취급합니다.
 */
const normalizeDocumentId = (value) => {
  if (value === undefined || value === null) {
    return ''
  }
  return String(value).trim()
}

/**
 * Compute the next numeric document id from stored documents.
 *
 * - 인자: `documents`(문서 배열).
 * - 리턴값: 다음으로 사용할 숫자 id.
 * - 사용 예시: `const nextId = resolveNextDocumentId(savedDocuments)`.
 * - 동작 흐름: 숫자 id만 추출 -> 최대값 계산 -> +1 반환.
 * - 주의사항: 숫자 id가 없으면 1을 반환합니다.
 */
const resolveNextDocumentId = (documents) => {
  let maxId = 0
  documents.forEach((doc) => {
    const rawId = normalizeDocumentId(doc?.id)
    const numericId = Number.parseInt(rawId, 10)
    if (!Number.isNaN(numericId)) {
      maxId = Math.max(maxId, numericId)
    }
  })
  return maxId + 1
}

let savedDocuments = loadStoredDocuments()
let nextDocumentId = resolveNextDocumentId(savedDocuments)

/**
 * Upsert document data into the in-memory list.
 *
 * - 인자: `payload`(요청 바디 JSON).
 * - 리턴값: 저장된 문서 객체.
 * - 사용 예시: `const saved = upsertDocument(payload)`.
 * - 동작 흐름: id 정규화 -> 저장 시각 갱신 -> 기존 문서 교체/신규 추가 -> 최신순 유지.
 * - 주의사항: id가 없으면 새 id를 발급합니다.
 * - 참고사항: 최신 문서를 리스트 앞에 배치해 "최근 업데이트" 정렬을 보장합니다.
 */
const upsertDocument = (payload) => {
  const normalizedId = normalizeDocumentId(payload?.id)
  const documentId = normalizedId || String(nextDocumentId++)
  const now = new Date().toISOString()
  const savedDocument = {
    ...payload,
    id: documentId,
    savedAt: now,
  }
  const existingIndex = savedDocuments.findIndex(
    (doc) => normalizeDocumentId(doc?.id) === documentId
  )
  if (existingIndex === -1) {
    savedDocuments = [savedDocument, ...savedDocuments]
    persistDocuments(savedDocuments)
    return savedDocument
  }
  savedDocuments = [
    savedDocument,
    ...savedDocuments.slice(0, existingIndex),
    ...savedDocuments.slice(existingIndex + 1),
  ]
  persistDocuments(savedDocuments)
  return savedDocument
}

export const handlers = [
  /**
   * Mock API: 문서 저장
   *
   * - 인자: MSW가 전달하는 요청 컨텍스트({ request })를 사용합니다.
   * - 리턴값: JSON 응답(Response)으로 저장 결과를 반환합니다.
   * - 사용 예시: `fetch('/api/documents', { method: 'POST', body: JSON.stringify(payload) })`
   * - 동작 흐름: 요청 바디 JSON 파싱 -> 저장 시각 추가 -> 메모리 배열에 적재 -> 201 응답 반환.
   * - 주의사항: request.json()은 실패할 수 있어 예외 처리로 빈 객체를 대체합니다.
   * - 참고사항: MSW v2에서는 `request.json()`으로 바디를 읽어야 정상 동작합니다.
   */
  http.post('/api/documents', async ({ request }) => {
    let payload = {}
    try {
      payload = await request.json()
    } catch (error) {
      console.warn('Failed to parse document payload', error)
    }
    const savedDocument = upsertDocument(payload)
    return new Response(JSON.stringify(savedDocument), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  }),
  http.get('/api/documents', () => {
    return new Response(JSON.stringify(savedDocuments), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }),
  http.get('/api/documents/latest', (req) => {
    const latest = savedDocuments[0]
    if (!latest) {
      return new Response(JSON.stringify({ message: 'No document saved yet' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return new Response(JSON.stringify(latest), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }),
]
