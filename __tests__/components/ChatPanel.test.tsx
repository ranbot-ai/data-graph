import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChatPanel from '@/components/ChatPanel'
import type { ChatMessage } from '@/lib/types'

const messages: ChatMessage[] = [
  { id: '1', role: 'user', content: 'Hello' },
  { id: '2', role: 'assistant', content: 'Hi there' },
]

describe('ChatPanel', () => {
  it('renders messages', () => {
    render(<ChatPanel messages={messages} onSend={jest.fn()} isLoading={false} />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('Hi there')).toBeInTheDocument()
  })

  it('calls onSend when form submitted', async () => {
    const onSend = jest.fn()
    render(<ChatPanel messages={[]} onSend={onSend} isLoading={false} />)
    const input = screen.getByPlaceholderText(/ask/i)
    await userEvent.type(input, 'Show me a bar chart')
    await userEvent.keyboard('{Enter}')
    expect(onSend).toHaveBeenCalledWith('Show me a bar chart')
  })

  it('disables input while loading', () => {
    render(<ChatPanel messages={[]} onSend={jest.fn()} isLoading={true} />)
    expect(screen.getByPlaceholderText(/thinking/i)).toBeDisabled()
  })
})
