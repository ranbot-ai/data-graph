import { render, screen } from '@testing-library/react'
import DataTable from '@/components/DataTable'
import type { ParsedData } from '@/lib/types'

const data: ParsedData = {
  columns: [
    { name: 'Model', type: 'string' },
    { name: 'Cost', type: 'number' },
  ],
  rows: [
    { Model: 'claude', Cost: 1.5 },
    { Model: 'openai', Cost: 2.0 },
  ],
}

describe('DataTable', () => {
  it('renders column headers', () => {
    render(<DataTable data={data} />)
    expect(screen.getByText('Model')).toBeInTheDocument()
    expect(screen.getByText('Cost')).toBeInTheDocument()
  })

  it('renders data rows', () => {
    render(<DataTable data={data} />)
    expect(screen.getByText('claude')).toBeInTheDocument()
    expect(screen.getByText('1.5')).toBeInTheDocument()
  })

  it('shows row count', () => {
    render(<DataTable data={data} />)
    expect(screen.getByText(/2 rows/i)).toBeInTheDocument()
  })
})
