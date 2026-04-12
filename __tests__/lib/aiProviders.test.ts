import { buildSystemPrompt, parseAIResponse } from '@/lib/aiProviders'
import type { Column } from '@/lib/types'

const columns: Column[] = [
  { name: 'Model', type: 'string' },
  { name: 'Cost', type: 'number' },
]
const sampleRows = [{ Model: 'claude', Cost: 1.5 }]

describe('buildSystemPrompt', () => {
  it('includes column names', () => {
    const prompt = buildSystemPrompt(columns, sampleRows)
    expect(prompt).toContain('Model')
    expect(prompt).toContain('Cost')
  })

  it('includes supported chart types', () => {
    const prompt = buildSystemPrompt(columns, sampleRows)
    expect(prompt).toContain('bar')
    expect(prompt).toContain('line')
    expect(prompt).toContain('pie')
  })

  it('instructs to respond in JSON', () => {
    const prompt = buildSystemPrompt(columns, sampleRows)
    expect(prompt.toLowerCase()).toContain('json')
  })
})

describe('parseAIResponse', () => {
  it('parses a valid JSON response', () => {
    const raw = '{"type":"bar","title":"Cost","xAxis":"Model","yAxis":"Cost","aggregation":"sum","filters":[],"message":"Here it is"}'
    const result = parseAIResponse(raw)
    expect(result.type).toBe('bar')
    expect(result.title).toBe('Cost')
  })

  it('extracts JSON from markdown code blocks', () => {
    const raw = '```json\n{"type":"line","title":"Trend","message":"ok"}\n```'
    const result = parseAIResponse(raw)
    expect(result.type).toBe('line')
  })

  it('returns a none-type response on invalid JSON', () => {
    const result = parseAIResponse('Sorry I cannot help with that.')
    expect(result.type).toBe('none')
    expect(result.message).toBe('Sorry I cannot help with that.')
  })
})
