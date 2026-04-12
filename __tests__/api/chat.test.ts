/**
 * @jest-environment node
 */
import { POST } from '@/app/api/chat/route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/aiProviders', () => ({
  callAI: jest.fn().mockResolvedValue({
    type: 'bar',
    title: 'Cost by Model',
    xAxis: 'Model',
    yAxis: 'Cost',
    aggregation: 'sum',
    filters: [],
    message: 'Here is your chart.',
  }),
}))

describe('POST /api/chat', () => {
  it('returns graph config from AI', async () => {
    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': 'test-key' },
      body: JSON.stringify({
        provider: 'claude',
        message: 'show cost by model',
        columns: [{ name: 'Model', type: 'string' }],
        sampleRows: [{ Model: 'claude' }],
      }),
    })
    const res = await POST(req)
    const body = await res.json()
    expect(body.type).toBe('bar')
    expect(body.message).toBe('Here is your chart.')
  })

  it('returns 400 when provider is missing', async () => {
    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'hello' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
