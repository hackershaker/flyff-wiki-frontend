import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ToolbarButton from './ToolbarButton'

describe('ToolbarButton', () => {
  it('applies active class and tooltip', () => {
    render(<ToolbarButton icon="bold" active tooltip="굵게" />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('toolbar-button--active')
    expect(button).toHaveAttribute('data-tooltip', '굵게')
    expect(button.querySelector('svg')).not.toBeNull()
  })

  it('renders children when icon is not provided', () => {
    render(
      <ToolbarButton>
        <span>Custom</span>
      </ToolbarButton>
    )

    expect(screen.getByText('Custom')).toBeInTheDocument()
  })
})
