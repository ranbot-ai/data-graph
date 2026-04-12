import { render, screen, fireEvent } from '@testing-library/react'
import GraphCard from '@/components/GraphCard'
import type { GraphConfig } from '@/lib/types'

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => null,
  Cell: () => null,
  AreaChart: ({ children }: { children: React.ReactNode }) => <div data-testid="area-chart">{children}</div>,
  Area: () => null,
  ScatterChart: ({ children }: { children: React.ReactNode }) => <div data-testid="scatter-chart">{children}</div>,
  Scatter: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}))

const rows = [
  { Model: 'claude', Cost: 1.5 },
  { Model: 'openai', Cost: 2.0 },
]

describe('GraphCard', () => {
  it('renders chart title', () => {
    const config: GraphConfig = {
      id: '1', type: 'bar', title: 'Cost by Model',
      xAxis: 'Model', yAxis: 'Cost', aggregation: 'sum',
    }
    render(<GraphCard config={config} rows={rows} onRemove={jest.fn()} />)
    expect(screen.getByText('Cost by Model')).toBeInTheDocument()
  })

  it('renders a BarChart for type bar', () => {
    const config: GraphConfig = {
      id: '1', type: 'bar', title: 'Test', xAxis: 'Model', yAxis: 'Cost', aggregation: 'sum',
    }
    render(<GraphCard config={config} rows={rows} onRemove={jest.fn()} />)
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })

  it('calls onRemove when close button clicked', () => {
    const onRemove = jest.fn()
    const config: GraphConfig = {
      id: '42', type: 'bar', title: 'Test', xAxis: 'Model', yAxis: 'Cost', aggregation: 'sum',
    }
    render(<GraphCard config={config} rows={rows} onRemove={onRemove} />)
    fireEvent.click(screen.getByRole('button', { name: /remove/i }))
    expect(onRemove).toHaveBeenCalledWith('42')
  })
})
