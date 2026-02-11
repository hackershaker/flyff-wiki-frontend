import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import Home from './home'

vi.mock('../services/documentService', () => ({
  getDocuments: vi.fn(),
}))

const { getDocuments } = await import('../services/documentService')

describe.skip('Home page', () => {
  it('shows empty state when no document is stored', () => {
    getDocuments.mockResolvedValueOnce([])

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )

    // There are multiple list sections, so we expect more than one empty-state message.
    expect(screen.getAllByText('저장된 문서가 없습니다.').length).toBeGreaterThan(0)
  })

  it('shows stored document title and metadata', async () => {
    getDocuments.mockResolvedValueOnce([
      {
        id: 'doc-1',
        title: '테스트 문서',
        category: 'jobs',
        savedAt: '2025-01-01T00:00:00.000Z',
        content: {
          type: 'doc',
          content: [
            {
              type: 'heading',
              attrs: { level: 1 },
              content: [{ type: 'text', text: '테스트 문서' }],
            },
          ],
        },
      },
    ])

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )

    // 최근 업데이트 목록에는 제목만 노출되어야 합니다.
    expect(await screen.findByText('테스트 문서')).toBeInTheDocument()
  })
})
