import { render, screen } from '@testing-library/react'
import ChatMessage from '@/components/ChatMessage'
import type { ChatMessage as ChatMessageType } from '@/lib/types'

describe('ChatMessage', () => {
  it('renders user message on the right', () => {
    const msg: ChatMessageType = { id: '1', role: 'user', content: 'Show me a chart' }
    const { container } = render(<ChatMessage message={msg} />)
    expect(screen.getByText('Show me a chart')).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('justify-end')
  })

  it('renders assistant message on the left', () => {
    const msg: ChatMessageType = { id: '2', role: 'assistant', content: 'Here is your chart' }
    const { container } = render(<ChatMessage message={msg} />)
    expect(container.firstChild).toHaveClass('justify-start')
  })
})
