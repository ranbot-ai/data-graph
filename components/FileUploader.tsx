'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { parseCSV, parseExcel } from '@/lib/parsers'
import { useTranslations } from '@/lib/i18n'
import type { ParsedData } from '@/lib/types'

interface Props {
  onData: (data: ParsedData) => void
}

export default function FileUploader({ onData }: Props) {
  const t = useTranslations()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return
      if (file.name.endsWith('.csv')) {
        const text = await file.text()
        const data = await parseCSV(text)
        onData(data)
      } else {
        const buffer = await file.arrayBuffer()
        const data = await parseExcel(buffer)
        onData(data)
      }
    },
    [onData]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all
        ${isDragActive
          ? 'border-violet-500 bg-violet-500/10'
          : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-violet-400 dark:hover:border-violet-500/50 hover:bg-slate-100 dark:hover:bg-white/[0.07]'
        }`}
    >
      <input {...getInputProps()} />
      <div className="flex justify-center mb-4">
        <svg className="w-12 h-12 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
        </svg>
      </div>
      <p className="text-base font-medium text-foreground">
        {t('uploader.dropHere')}
      </p>
      <p className="text-sm text-muted mt-2">{t('uploader.supports')}</p>
    </div>
  )
}
