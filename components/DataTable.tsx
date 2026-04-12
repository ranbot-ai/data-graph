'use client'

import { useState } from 'react'
import { useTranslations } from '@/lib/i18n'
import type { ParsedData } from '@/lib/types'

const PAGE_SIZE = 20

interface Props {
  data: ParsedData
}

export default function DataTable({ data }: Props) {
  const t = useTranslations()
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(data.rows.length / PAGE_SIZE)
  const pageRows = data.rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted">
          {data.rows.length} rows · {data.columns.length} columns
        </span>
        {totalPages > 1 && (
          <div className="flex gap-2 text-xs">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-2 py-1 rounded border border-slate-200 dark:border-white/10 text-muted hover:text-foreground disabled:opacity-40 cursor-pointer transition-colors"
            >
              {t('table.prev')}
            </button>
            <span className="px-2 py-1 text-muted">{page + 1} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="px-2 py-1 rounded border border-slate-200 dark:border-white/10 text-muted hover:text-foreground disabled:opacity-40 cursor-pointer transition-colors"
            >
              {t('table.next')}
            </button>
          </div>
        )}
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-white/5">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 dark:bg-white/5">
            <tr>
              {data.columns.map((col) => (
                <th key={col.name} className="px-3 py-2 text-left font-medium text-muted whitespace-nowrap">
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, i) => (
              <tr
                key={page * PAGE_SIZE + i}
                className={i % 2 === 0 ? '' : 'bg-slate-50 dark:bg-white/[0.02]'}
              >
                {data.columns.map((col) => (
                  <td key={col.name} className="px-3 py-1.5 text-muted whitespace-nowrap">
                    {String(row[col.name] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
