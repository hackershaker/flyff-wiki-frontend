import { http } from 'msw'
import { setupServer } from 'msw/node'

// 이 스크립트는 "문서 저장 POST를 두 번 보내면 저장된 문서가 2개가 된다"는
// 기대 동작을 MSW로 독립적으로 검증한다.
// 기존 소스나 핸들러 파일은 건드리지 않고, 스크립트 내부에서만 핸들러를 정의한다.

// 테스트용 메모리 저장소: 실제 서버의 DB처럼 동작해야 하므로
// POST 요청이 올 때마다 "추가"되어야 한다.
let savedDocuments = []

const server = setupServer(
  http.post('/api/documents', async ({ request }) => {
    // 요구사항: 저장 요청은 기존 문서를 덮어쓰지 말고
    // 새 문서를 목록에 추가해야 한다.
    const payload = await request.json()
    const savedAt = new Date().toISOString()
    const savedDocument = { ...payload, savedAt }
    savedDocuments = [...savedDocuments, savedDocument]

    return new Response(JSON.stringify(savedDocument), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  }),
  http.get('/api/documents', () => {
    // 요구사항: 저장된 문서 목록을 조회하면
    // 지금까지 저장된 모든 문서가 반환되어야 한다.
    return new Response(JSON.stringify(savedDocuments), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  })
)

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

async function run() {
  if (typeof fetch !== 'function') {
    throw new Error('이 스크립트는 Node 18+ 환경의 fetch를 필요로 합니다.')
  }

  // MSW 서버 활성화: 실제 네트워크 대신 MSW가 요청을 가로챈다.
  server.listen({ onUnhandledRequest: 'error' })

  try {
    // 테스트 시작 전에 상태 초기화
    savedDocuments = []

    // 1) 첫 번째 저장 요청
    await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: { type: 'doc', content: [] } }),
    })

    // 1번 저장 후 목록은 1개여야 한다.
    const firstList = await (await fetch('/api/documents')).json()
    assert(Array.isArray(firstList), '문서 목록 응답은 배열이어야 합니다.')
    assert(firstList.length === 1, '문서 1개 저장 후 목록 길이는 1이어야 합니다.')

    // 2) 두 번째 저장 요청
    await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: { type: 'doc', content: [] } }),
    })

    // 2번 저장 후 목록은 2개여야 한다.
    const secondList = await (await fetch('/api/documents')).json()
    assert(secondList.length === 2, '문서 2개 저장 후 목록 길이는 2이어야 합니다.')

    console.log('OK: 문서 저장 POST를 두 번 보내면 목록에 2개가 누적됩니다.')
  } finally {
    // 스크립트 종료 전 서버 정리
    server.close()
  }
}

run().catch((error) => {
  console.error('FAIL:', error.message)
  process.exitCode = 1
})
