import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AIRequest, AIResponse, Column } from './types'

export function buildSystemPrompt(
  columns: Column[],
  sampleRows: Record<string, unknown>[]
): string {
  const colList = columns.map((c) => `- ${c.name} (${c.type})`).join('\n')
  const sample = JSON.stringify(sampleRows.slice(0, 10), null, 2)
  return `You are a data analyst assistant. The user has uploaded a dataset with these columns:
${colList}

Sample data:
${sample}

When the user asks for a visualization, respond ONLY with a JSON object in this exact format:
{
  "type": "bar" | "line" | "pie" | "area" | "scatter" | "table" | "none",
  "title": "Chart title",
  "xAxis": "column_name_for_x",
  "yAxis": "column_name_for_y",
  "aggregation": "sum" | "avg" | "count" | "none",
  "filters": [],
  "message": "Brief explanation"
}

For non-visualization questions, use type "none" and answer in "message".
Respond with raw JSON only — no markdown, no code fences, no extra text.`
}

export function parseAIResponse(raw: string): AIResponse {
  // Strip markdown code fences if present
  const stripped = raw.replace(/```(?:json)?\n?([\s\S]*?)\n?```/g, '$1').trim()
  try {
    const parsed = JSON.parse(stripped)
    return {
      type: parsed.type ?? 'none',
      title: parsed.title ?? '',
      xAxis: parsed.xAxis,
      yAxis: parsed.yAxis,
      aggregation: parsed.aggregation,
      filters: parsed.filters ?? [],
      message: parsed.message ?? '',
    }
  } catch {
    return { type: 'none', title: '', message: raw }
  }
}

export async function callAI(req: AIRequest): Promise<AIResponse> {
  const systemPrompt = buildSystemPrompt(req.columns, req.sampleRows)

  try {
    switch (req.provider) {
      case 'claude': {
        const client = new Anthropic({ apiKey: req.apiKey })
        const msg = await client.messages.create({
          model: 'claude-opus-4-6',
          max_tokens: 1024,
          system: systemPrompt,
          messages: [{ role: 'user', content: req.message }],
        })
        const block = msg.content.length > 0 ? msg.content[0] : null
        const text = block?.type === 'text' ? block.text : ''
        return parseAIResponse(text)
      }

      case 'openai': {
        const client = new OpenAI({ apiKey: req.apiKey })
        const completion = await client.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: req.message },
          ],
        })
        const text = completion.choices[0].message.content ?? ''
        return parseAIResponse(text)
      }

      case 'gemini': {
        const genAI = new GoogleGenerativeAI(req.apiKey)
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          systemInstruction: systemPrompt,
        })
        const result = await model.generateContent(req.message)
        const text = result.response.text()
        return parseAIResponse(text)
      }
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'AI call failed'
    return { type: 'none', title: '', message }
  }
}
