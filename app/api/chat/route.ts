import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProviders'
import type { AIProvider, Column } from '@/lib/types'

const ENV_KEYS: Record<AIProvider, string> = {
  claude: process.env.ANTHROPIC_API_KEY ?? '',
  openai: process.env.OPENAI_API_KEY ?? '',
  gemini: process.env.GEMINI_API_KEY ?? '',
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  if (!body || !body.provider || !body.message) {
    return NextResponse.json({ error: 'provider and message are required' }, { status: 400 })
  }

  const { provider, message, columns = [], sampleRows = [] } = body as {
    provider: AIProvider
    message: string
    columns: Column[]
    sampleRows: Record<string, unknown>[]
  }

  // Env key takes precedence; fall back to key from header (local dev)
  const apiKey = ENV_KEYS[provider] || request.headers.get('x-api-key') || ''
  if (!apiKey) {
    return NextResponse.json(
      { error: `No API key found for provider "${provider}"` },
      { status: 400 }
    )
  }

  try {
    const result = await callAI({ provider, message, apiKey, columns, sampleRows })
    return NextResponse.json(result)
  } catch (err: unknown) {
    const errMessage = err instanceof Error ? err.message : 'AI call failed'
    return NextResponse.json({ error: errMessage }, { status: 500 })
  }
}
