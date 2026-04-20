import type { GraphConfig, GraphFilter } from './types'

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T[\d:.Z+-]+$/

function normalizeGroupKey(val: unknown): string | number {
  if (typeof val === 'string' && ISO_DATE_RE.test(val)) return val.slice(0, 10)
  return val as string | number
}

export interface ChartDataPoint {
  name: string | number
  value: number
  [key: string]: unknown
}

function applyFilters(
  rows: Record<string, unknown>[],
  filters?: GraphFilter[]
): Record<string, unknown>[] {
  if (!filters || filters.length === 0) return rows
  return rows.filter((row) =>
    filters.every((f) => {
      const val = row[f.column]
      switch (f.operator) {
        case '==': return val === f.value
        case '!=': return val !== f.value
        case '>':  return Number(val) > Number(f.value)
        case '<':  return Number(val) < Number(f.value)
        case '>=': return Number(val) >= Number(f.value)
        case '<=': return Number(val) <= Number(f.value)
        default:   return true
      }
    })
  )
}

export function transformGraphData(
  config: GraphConfig,
  rows: Record<string, unknown>[]
): ChartDataPoint[] {
  const filtered = applyFilters(rows, config.filters)

  if (!config.xAxis) return []
  if (!config.aggregation || config.aggregation === 'none') {
    return filtered.map((row) => ({
      name: row[config.xAxis!] as string | number,
      value: Number(row[config.yAxis ?? ''] ?? 0),
      ...row,
    }))
  }

  // Group by xAxis (normalize datetime keys to date-only for daily grouping)
  const groups = new Map<string | number, number[]>()
  for (const row of filtered) {
    const key = normalizeGroupKey(row[config.xAxis])
    const yVal = Number(row[config.yAxis ?? ''] ?? 0)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(yVal)
  }

  return Array.from(groups.entries()).map(([name, vals]) => {
    let value: number
    switch (config.aggregation) {
      case 'sum':   value = vals.reduce((a, b) => a + b, 0); break
      case 'avg':   value = vals.reduce((a, b) => a + b, 0) / vals.length; break
      case 'count': value = vals.length; break
      default:      value = vals[0]
    }
    return { name, value }
  })
}
