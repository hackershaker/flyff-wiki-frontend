import { beforeEach, describe, expect, it, vi } from 'vitest'

import { saveDocument } from './documentService.js'

describe('saveDocument', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: 'saved',
        savedAt: new Date().toISOString(),
      }),
    })
    vi.stubGlobal('fetch', mockFetch)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    globalThis.fetch = originalFetch
  })

  it('posts document content and returns the server response', async () => {
    const payload = { content: { type: 'doc', content: [] } }
    const response = await saveDocument(payload)

    expect(response.savedAt).toBeDefined()
    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/documents',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }),
    )
  })
})
