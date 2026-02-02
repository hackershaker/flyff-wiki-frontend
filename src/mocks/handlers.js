import { http } from 'msw'

let savedDocument = null

export const handlers = [
  http.post('/api/documents', async (req) => {
    const payload = req.body ?? {}
    const now = new Date().toISOString()
    savedDocument = {
      ...payload,
      savedAt: now,
    }
    return new Response(JSON.stringify(savedDocument), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  }),
  http.get('/api/documents/latest', (req) => {
    if (!savedDocument) {
      return new Response(JSON.stringify({ message: 'No document saved yet' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return new Response(JSON.stringify(savedDocument), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }),
]
