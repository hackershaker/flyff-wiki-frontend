import { http } from 'msw'

let savedDocuments = []

export const handlers = [
  http.post('/api/documents', async (req) => {
    const payload = req.body ?? {}
    const now = new Date().toISOString()
    const savedDocument = {
      ...payload,
      savedAt: now,
    }
    savedDocuments = [...savedDocuments, savedDocument]
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
    const latest = savedDocuments[savedDocuments.length - 1]
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
