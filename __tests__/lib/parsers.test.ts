import { parseCSV, inferColumnType } from '@/lib/parsers'

describe('inferColumnType', () => {
  it('identifies numbers', () => {
    expect(inferColumnType(['1', '2.5', '100'])).toBe('number')
  })

  it('identifies dates', () => {
    expect(inferColumnType(['2026-04-11', '2026-01-01'])).toBe('date')
  })

  it('falls back to string', () => {
    expect(inferColumnType(['claude', 'openai', 'gemini'])).toBe('string')
  })

  it('treats mixed types as string', () => {
    expect(inferColumnType(['123', 'abc'])).toBe('string')
  })
})

describe('parseCSV', () => {
  it('parses a simple CSV string', async () => {
    const csv = `Date,User,Cost\n2026-04-11,alice@example.com,1.50\n2026-04-11,bob@example.com,2.00`
    const result = await parseCSV(csv)
    expect(result.columns).toHaveLength(3)
    expect(result.columns[0]).toEqual({ name: 'Date', type: 'date' })
    expect(result.columns[2]).toEqual({ name: 'Cost', type: 'number' })
    expect(result.rows).toHaveLength(2)
    expect(result.rows[0]['User']).toBe('alice@example.com')
  })

  it('handles empty CSV gracefully', async () => {
    const result = await parseCSV('Name\n')
    expect(result.rows).toHaveLength(0)
    expect(result.columns).toHaveLength(1)
  })
})
