import { render, screen, fireEvent } from '@testing-library/react'
import ProviderSelector from '@/components/ProviderSelector'

describe('ProviderSelector', () => {
  it('renders all three providers', () => {
    render(<ProviderSelector selected="claude" onChange={jest.fn()} />)
    expect(screen.getByText('Claude')).toBeInTheDocument()
    expect(screen.getByText('ChatGPT')).toBeInTheDocument()
    expect(screen.getByText('Gemini')).toBeInTheDocument()
  })

  it('highlights the selected provider', () => {
    const { container } = render(<ProviderSelector selected="openai" onChange={jest.fn()} />)
    const cards = container.querySelectorAll('[data-provider]')
    const openaiCard = Array.from(cards).find(
      (c) => c.getAttribute('data-provider') === 'openai'
    )
    expect(openaiCard?.className).toMatch(/border-green-500|ring/)
  })

  it('calls onChange when a provider is clicked', () => {
    const onChange = jest.fn()
    render(<ProviderSelector selected="claude" onChange={onChange} />)
    fireEvent.click(screen.getByText('Gemini'))
    expect(onChange).toHaveBeenCalledWith('gemini')
  })
})
