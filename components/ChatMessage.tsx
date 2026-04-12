import type { ChatMessage as ChatMessageType } from '@/lib/types'

interface Props {
  message: ChatMessageType
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
          isUser
            ? 'bg-violet-600 text-white rounded-br-sm'
            : 'bg-slate-100 dark:bg-white/5 text-foreground rounded-bl-sm border border-slate-200 dark:border-white/5'
        }`}
      >
        {message.content}
      </div>
    </div>
  )
}
