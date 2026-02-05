import { render, screen } from '@testing-library/react'
import Home from './home.jsx'

const STORAGE_KEY = 'docs_edit_content_json'
const META_KEY = 'docs_edit_meta'

describe('Home page', () => {
  it('shows empty state when no document is stored', () => {
    render(<Home />)

    // There are multiple list sections, so we expect more than one empty-state message.
    expect(screen.getAllByText('저장된 문서가 없습니다.').length).toBeGreaterThan(0)
  })

  it('shows stored document title and metadata', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: '테스트 문서' }],
        },
      ],
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(doc))
    localStorage.setItem(META_KEY, JSON.stringify({ updatedAt: '2025-01-01T00:00:00.000Z' }))

    render(<Home />)

    expect(screen.getByText('테스트 문서')).toBeInTheDocument()
    expect(screen.getByText(/마지막 저장:/)).toBeInTheDocument()
  })
})
