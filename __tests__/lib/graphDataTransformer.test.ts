import { transformGraphData } from '@/lib/graphDataTransformer'
import type { GraphConfig } from '@/lib/types'

const rows = [
  { Model: 'claude', Cost: 1.5, Tokens: 1000 },
  { Model: 'openai', Cost: 2.0, Tokens: 2000 },
  { Model: 'claude', Cost: 0.5, Tokens: 500 },
]

describe('transformGraphData', () => {
  it('aggregates by sum', () => {
    const config: GraphConfig = {
      id: '1', type: 'bar', title: 'Cost by Model',
      xAxis: 'Model', yAxis: 'Cost', aggregation: 'sum',
    }
    const result = transformGraphData(config, rows)
    const claude = result.find((r) => r.name === 'claude')
    expect(claude?.value).toBeCloseTo(2.0)
    const openai = result.find((r) => r.name === 'openai')
    expect(openai?.value).toBeCloseTo(2.0)
  })

  it('aggregates by count', () => {
    const config: GraphConfig = {
      id: '1', type: 'bar', title: 'Count by Model',
      xAxis: 'Model', yAxis: 'Cost', aggregation: 'count',
    }
    const result = transformGraphData(config, rows)
    expect(result.find((r) => r.name === 'claude')?.value).toBe(2)
  })

  it('aggregates by avg', () => {
    const config: GraphConfig = {
      id: '1', type: 'line', title: 'Avg Cost',
      xAxis: 'Model', yAxis: 'Cost', aggregation: 'avg',
    }
    const result = transformGraphData(config, rows)
    expect(result.find((r) => r.name === 'claude')?.value).toBeCloseTo(1.0)
  })

  it('applies equality filters', () => {
    const config: GraphConfig = {
      id: '1', type: 'bar', title: 'Claude only',
      xAxis: 'Model', yAxis: 'Cost', aggregation: 'sum',
      filters: [{ column: 'Model', operator: '==', value: 'claude' }],
    }
    const result = transformGraphData(config, rows)
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('claude')
  })

  it('returns raw rows for type none/aggregation none', () => {
    const config: GraphConfig = {
      id: '1', type: 'table', title: 'Raw',
      xAxis: 'Model', yAxis: 'Cost', aggregation: 'none',
    }
    const result = transformGraphData(config, rows)
    expect(result).toHaveLength(3)
  })

  it('returns empty array when xAxis is not set', () => {
    const config: GraphConfig = {
      id: '1', type: 'bar', title: 'No Axis', aggregation: 'sum',
    }
    const result = transformGraphData(config, rows)
    expect(result).toHaveLength(0)
  })
})
