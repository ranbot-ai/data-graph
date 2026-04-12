'use client'

import { useStore } from '@/lib/store'
import type { Locale } from '@/lib/i18n'

const LANGS: { id: Locale; label: string }[] = [
  { id: 'en', label: 'EN' },
  { id: 'ja', label: 'JP' },
  { id: 'zh', label: '中' },
]

export default function LangSwitcher() {
  const locale = useStore((s) => s.settings.locale) ?? 'en'
  const setLocale = useStore((s) => s.setLocale)

  return (
    <div className="flex items-center gap-0.5">
      {LANGS.map((lang) => (
        <button
          key={lang.id}
          onClick={() => setLocale(lang.id)}
          className={`px-2 py-1 text-xs rounded-md transition-colors cursor-pointer font-medium ${
            locale === lang.id
              ? 'bg-violet-600 text-white'
              : 'text-muted hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/10'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}
