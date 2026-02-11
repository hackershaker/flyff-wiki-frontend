import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { http } from 'msw'

import { server } from '../mocks/node'

describe('MSW: 문서 저장 API 동작', () => {
  // 이 테스트는 네트워크 요청을 실제 서버로 보내지 않고,
  // MSW가 가짜 서버처럼 요청을 가로채도록 설정한다.
  // 따라서 백엔드가 없더라도 "저장 API가 기대대로 동작하는지"를 검증할 수 있다.
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })

  // 테스트 종료 후 서버를 정리한다.
  afterAll(() => {
    server.close()
  })

  it('문서를 저장하면 저장 결과(저장 시간 포함)가 반환된다', async () => {
    // 요구사항: 문서 저장 요청을 보내면 서버가 정상 응답(201)을 주고,
    // 저장된 데이터에 저장 시간이 포함되어야 한다.
    // Node 환경에서는 fetch에 절대 URL이 필요하므로,
    // VITE_API_BASE를 미리 지정해 절대 URL로 호출되도록 만든다.
    vi.stubEnv('VITE_API_BASE', 'http://localhost')

    // 절대 URL을 쓰도록 한 만큼, MSW 핸들러도 절대 URL을 받도록 오버라이드한다.
    server.use(
      http.post('http://localhost/api/documents', async ({ request }) => {
        const payload = await request.json()
        return new Response(
          JSON.stringify({
            ...payload,
            savedAt: new Date().toISOString(),
          }),
          {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }),
    )

    const { saveDocument } = await import('./documentService')
    const payload = { content: { type: 'doc', content: [] } }

    const result = await saveDocument(payload)

    // 저장 결과에 "savedAt"이 있어야 한다.
    // 이는 "문서 저장이 성공적으로 처리되었다"는 신호로 사용한다.
    expect(result.savedAt).toBeDefined()
    // 응답에는 요청에 담긴 content가 그대로 들어와야 한다.
    expect(result.content).toEqual(payload.content)
  })
})
