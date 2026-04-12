import type { AIProvider } from '@/lib/types'

const PROVIDERS: { id: AIProvider; label: string; icon: string; color: string }[] = [
  { id: 'claude', label: 'Claude', icon: '🤖', color: 'border-green-500 bg-green-50' },
  { id: 'openai', label: 'ChatGPT', icon: '💬', color: 'border-blue-500 bg-blue-50' },
  { id: 'gemini', label: 'Gemini', icon: '✨', color: 'border-yellow-500 bg-yellow-50' },
]

interface Props {
  selected: AIProvider
  onChange: (provider: AIProvider) => void
}

export default function ProviderSelector({ selected, onChange }: Props) {
  return (
    <div className="flex gap-3">
      {PROVIDERS.map((p) => (
        <button
          key={p.id}
          data-provider={p.id}
          onClick={() => onChange(p.id)}
          className={`flex-1 rounded-xl border-2 p-4 text-center transition-all cursor-pointer
            ${selected === p.id ? `${p.color} ring-2 ring-offset-1 ring-violet-500` : 'border-gray-200 bg-white hover:border-gray-300'}`}
        >
          <div className="text-2xl mb-1">{p.icon}</div>
          <div className="font-semibold text-sm">{p.label}</div>
          {selected === p.id && (
            <div className="text-xs text-gray-500 mt-0.5">Selected</div>
          )}
        </button>
      ))}
    </div>
  )
}
