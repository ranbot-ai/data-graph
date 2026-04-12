'use client'

import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { transformGraphData } from '@/lib/graphDataTransformer'
import { useTranslations } from '@/lib/i18n'
import type { GraphConfig } from '@/lib/types'

const COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#f97316']

const AXIS_STYLE = { fontSize: 11, fill: '#64748b' }

// Uses CSS variables so tooltip auto-adapts to dark/light theme
const TOOLTIP_STYLE: React.CSSProperties = {
  backgroundColor: 'var(--surface-hex)',
  border: '1px solid var(--border-hex)',
  borderRadius: 8,
  color: 'var(--fg-hex)',
  fontSize: 12,
}
const GRID_STYLE = { stroke: 'var(--border-hex)' }

interface Props {
  config: GraphConfig
  rows: Record<string, unknown>[]
  onRemove: (id: string) => void
}

export default function GraphCard({ config, rows, onRemove }: Props) {
  const t = useTranslations()
  const data = transformGraphData(config, rows)

  function renderChart() {
    switch (config.type) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" {...GRID_STYLE} />
            <XAxis dataKey="name" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(139,92,246,0.06)' }} />
            <Bar dataKey="value" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        )
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" {...GRID_STYLE} />
            <XAxis dataKey="name" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Line type="monotone" dataKey="value" stroke={COLORS[0]} dot={false} strokeWidth={2} />
          </LineChart>
        )
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" {...GRID_STYLE} />
            <XAxis dataKey="name" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={COLORS[0]} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke={COLORS[0]} strokeWidth={2} fill="url(#areaGrad)" />
          </AreaChart>
        )
      case 'pie':
        return (
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} strokeWidth={0}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
          </PieChart>
        )
      case 'scatter':
        return (
          <ScatterChart>
            <CartesianGrid {...GRID_STYLE} />
            <XAxis dataKey="name" name={config.xAxis} tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <YAxis dataKey="value" name={config.yAxis} tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={data} fill={COLORS[0]} />
          </ScatterChart>
        )
      case 'table':
        return (
          <div className="overflow-auto max-h-44 text-xs">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-2 py-1 text-left bg-slate-100 dark:bg-white/5 text-muted font-medium">Name</th>
                  <th className="px-2 py-1 text-left bg-slate-100 dark:bg-white/5 text-muted font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? '' : 'bg-slate-50 dark:bg-white/[0.02]'}>
                    <td className="px-2 py-1 text-muted">{String(row.name)}</td>
                    <td className="px-2 py-1 text-muted">{String(row.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      default:
        return <div className="text-muted text-sm">{t('graph.noChart')}</div>
    }
  }

  const chart = renderChart()
  const isRechartsType = ['bar', 'line', 'area', 'pie', 'scatter'].includes(config.type)

  return (
    <div className="bg-surface rounded-xl border border-slate-200 dark:border-white/5 p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground truncate">{config.title}</h3>
        <button
          onClick={() => onRemove(config.id)}
          aria-label={t('graph.removeLabel')}
          className="text-muted hover:text-red-500 text-lg leading-none ml-2 transition-colors cursor-pointer"
        >
          ×
        </button>
      </div>
      <div className="h-48">
        {isRechartsType ? (
          <ResponsiveContainer width="100%" height="100%">
            {chart as React.ReactElement}
          </ResponsiveContainer>
        ) : (
          chart
        )}
      </div>
    </div>
  )
}
