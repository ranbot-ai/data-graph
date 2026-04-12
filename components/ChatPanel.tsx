'use client'

import { useRef, useEffect, useState } from 'react'
import ChatMessage from './ChatMessage'
import { useStore } from '@/lib/store'
import type { ChatMessage as ChatMessageType, AIProvider } from '@/lib/types'

const PROVIDERS: { id: AIProvider; label: string }[] = [
  { id: 'claude', label: 'Claude' },
  { id: 'openai', label: 'GPT' },
  { id: 'gemini', label: 'Gemini' },
]

interface Props {
  messages: ChatMessageType[]
  onSend: (message: string) => void
  isLoading: boolean
}

export default function ChatPanel({ messages, onSend, isLoading }: Props) {
  const [input, setInput] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const settings = useStore((s) => s.settings)
  const setProvider = useStore((s) => s.setProvider)
  const setApiKey = useStore((s) => s.setApiKey)
  const setDefaultGraphCount = useStore((s) => s.setDefaultGraphCount)

  const [localKey, setLocalKey] = useState(settings.apiKeys[settings.provider])
  const [localCount, setLocalCount] = useState(settings.defaultGraphCount)

  // Sync localKey when provider changes
  useEffect(() => {
    setLocalKey(settings.apiKeys[settings.provider])
  }, [settings.provider, settings.apiKeys])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setInput('')
  }

  function handleSaveSettings() {
    setApiKey(settings.provider, localKey)
    setDefaultGraphCount(localCount)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      setSettingsOpen(false)
    }, 1000)
  }

  const hasKey = !!settings.apiKeys[settings.provider]

  return (
    <div className="flex flex-col h-full bg-panel border-l border-white/5">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-sm text-slate-200">AI Assistant</h2>
          <p className="text-xs text-slate-500">Ask questions about your data</p>
        </div>
        <button
          onClick={() => setSettingsOpen((o) => !o)}
          aria-label="Settings"
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            settingsOpen
              ? 'bg-violet-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Settings Drawer */}
      {settingsOpen && (
        <div className="border-b border-white/5 bg-surface px-4 py-4 flex flex-col gap-4">
          {/* Provider tabs */}
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">AI Provider</p>
            <div className="flex gap-1">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProvider(p.id)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    settings.provider === p.id
                      ? 'bg-violet-600 text-white'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* API Key */}
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">API Key</p>
            <input
              type="password"
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              placeholder={`${settings.provider} API key...`}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
            />
          </div>

          {/* Graph count */}
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Graphs per row: <span className="text-violet-400">{localCount}</span>
            </p>
            <input
              type="range"
              min={1}
              max={8}
              value={localCount}
              onChange={(e) => setLocalCount(Number(e.target.value))}
              className="w-full accent-violet-600"
            />
          </div>

          {/* Save */}
          <button
            onClick={handleSaveSettings}
            className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {messages.length === 0 && (
          <div className="mt-8 text-center">
            {!hasKey ? (
              <div className="flex flex-col items-center gap-2">
                <svg className="w-8 h-8 text-yellow-500/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <p className="text-xs text-slate-500">Click the gear icon to add your API key</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
                <p className="text-xs text-slate-500">Try: &quot;Show cost by model as a bar chart&quot;</p>
              </div>
            )}
          </div>
        )}
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-white/5 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          placeholder={isLoading ? 'Thinking...' : 'Ask about your data...'}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-3 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 disabled:opacity-50 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </form>
    </div>
  )
}
