'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore, useHasHydrated } from '@/lib/store'
import DataTable from '@/components/DataTable'
import GraphGrid from '@/components/GraphGrid'
import ChatPanel from '@/components/ChatPanel'
import SessionBanner from '@/components/SessionBanner'
import { useTranslations } from '@/lib/i18n'
import type { GraphConfig } from '@/lib/types'

type Tab = 'table' | 'charts'

export default function DashboardPage() {
  const t = useTranslations()
  const router = useRouter()
  const parsedData = useStore((s) => s.parsedData)
  const graphs = useStore((s) => s.graphs)
  const addGraph = useStore((s) => s.addGraph)
  const removeGraph = useStore((s) => s.removeGraph)
  const messages = useStore((s) => s.messages)
  const addMessage = useStore((s) => s.addMessage)
  const settings = useStore((s) => s.settings)
  const [isLoading, setIsLoading] = useState(false)
  const [tab, setTab] = useState<Tab>('table')
  const hydrated = useHasHydrated()

  useEffect(() => {
    if (hydrated && !parsedData) router.push('/')
  }, [hydrated, parsedData, router])

  if (!hydrated) return null
  if (!parsedData) return null

  async function handleSend(message: string) {
    setIsLoading(true)
    const userMsgId = crypto.randomUUID()
    addMessage({ id: userMsgId, role: 'user', content: message })

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': settings.apiKeys[settings.provider],
        },
        body: JSON.stringify({
          provider: settings.provider,
          message,
          columns: parsedData!.columns,
          sampleRows: parsedData!.rows.slice(0, 10),
        }),
      })

      const data = await res.json()

      if (data.type && data.type !== 'none') {
        const graphId = crypto.randomUUID()
        const config: GraphConfig = { id: graphId, ...data }
        addGraph(config)
        setTab('charts')
        addMessage({
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.message || `Added: ${data.title}`,
          graphId,
        })
      } else {
        addMessage({
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.message || data.error || 'Something went wrong.',
        })
      }
    } catch {
      addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: t('chat.failedMessage'),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left: data + graphs */}
      <div className="flex-[2] overflow-y-auto p-6">
        <SessionBanner />

        {/* Tab bar */}
        <div className="flex gap-1 mb-4 border-b border-slate-200 dark:border-white/10">
          {(['table', 'charts'] as Tab[]).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px cursor-pointer ${
                tab === tabKey
                  ? 'border-violet-500 text-violet-600 dark:text-violet-400'
                  : 'border-transparent text-muted hover:text-foreground'
              }`}
            >
              {tabKey === 'table' ? t('dashboard.tabTable') : t('dashboard.tabCharts')}
            </button>
          ))}
        </div>

        {tab === 'table' && <DataTable data={parsedData} />}
        {tab === 'charts' && (
          <GraphGrid
            graphs={graphs}
            rows={parsedData.rows}
            defaultGraphCount={settings.defaultGraphCount}
            onRemove={removeGraph}
          />
        )}
      </div>
      {/* Right: chat */}
      <div className="w-80 flex flex-col">
        <ChatPanel
          messages={messages}
          onSend={handleSend}
          isLoading={!!isLoading}
        />
      </div>
    </div>
  )
}
