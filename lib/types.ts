export type ColumnType = 'string' | 'number' | 'date'

export interface Column {
  name: string
  type: ColumnType
}

export interface ParsedData {
  columns: Column[]
  rows: Record<string, unknown>[]
}

export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'table' | 'none'

export type AggregationType = 'sum' | 'avg' | 'count' | 'none'
export type ValueFormat = 'auto' | 'currency' | 'percent' | 'compact' | 'number'

export interface GraphFilter {
  column: string
  operator: '==' | '!=' | '>' | '<' | '>=' | '<='
  value: string | number
}

export interface GraphConfig {
  id: string
  type: ChartType
  title: string
  xAxis?: string
  yAxis?: string
  aggregation?: AggregationType
  filters?: GraphFilter[]
  message?: string
  valueFormat?: ValueFormat
}

export type AIProvider = 'claude' | 'openai' | 'gemini'
export type Locale = 'en' | 'ja' | 'zh'

export interface Settings {
  provider: AIProvider
  apiKeys: Record<AIProvider, string>
  defaultGraphCount: number
  locale: Locale
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  graphId?: string
}

export interface AIRequest {
  message: string
  provider: AIProvider
  apiKey: string
  columns: Column[]
  sampleRows: Record<string, unknown>[]
}

export type AIResponse = Omit<GraphConfig, 'id'>
