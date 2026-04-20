'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { useTranslations } from '@/lib/i18n'

export default function SessionBanner() {
  const t = useTranslations()
  const router = useRouter()
  const parsedData = useStore((s) => s.parsedData)
  const graphs = useStore((s) => s.graphs)
  const messages = useStore((s) => s.messages)
  const clearSession = useStore((s) => s.clearSession)
  const [confirming, setConfirming] = useState(false)

  if (!parsedData) return null

  function handleClearClick() {
    if (!confirming) {
      setConfirming(true)
      setTimeout(() => setConfirming(false), 3000)
      return
    }
    clearSession()
    useStore.persist.clearStorage()
    router.push('/')
  }

  const parts = [
    `${parsedData.rows.length.toLocaleString()} ${t('session.rows')}`,
    ...(graphs.length > 0 ? [`${graphs.length} ${t('session.charts')}`] : []),
    ...(messages.length > 0 ? [`${messages.length} ${t('session.messages')}`] : []),
  ]

  return (
    <div className="flex items-center gap-2 px-3 py-2 mb-4 rounded-lg bg-violet-500/8 border border-violet-500/15 text-xs">
      <svg className="w-3.5 h-3.5 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
      <span className="text-violet-500 font-medium shrink-0">{t('session.stored')}</span>
      <span className="text-muted">{parts.join(' · ')}</span>
      <span className="text-muted/60 hidden sm:inline">· {t('session.tip')}</span>
      <button
        onClick={handleClearClick}
        className={`ml-auto shrink-0 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
          confirming
            ? 'border-red-400 text-red-500 hover:bg-red-500/10'
            : 'border-slate-200 dark:border-white/10 text-muted hover:text-red-500 hover:border-red-400'
        }`}
      >
        {confirming ? `${t('session.clearButton')}?` : t('session.clearButton')}
      </button>
    </div>
  )
}
