import { useStore } from '@/lib/store'

export type Locale = 'en' | 'ja' | 'zh'

const messages = {
  en: {
    nav: {
      upload: 'Upload',
      dashboard: 'Dashboard',
    },
    home: {
      badge: 'AI-Powered Data Visualization',
      title: 'Turn your data into insights',
      description: 'Upload a CSV or Excel file and chat with AI to generate beautiful charts instantly.',
    },
    uploader: {
      dropHere: 'Drop a CSV or Excel file here',
      supports: 'Supports .csv, .xlsx, .xls',
    },
    chat: {
      title: 'AI Assistant',
      subtitle: 'Ask questions about your data',
      providerLabel: 'AI Provider',
      apiKeyLabel: 'API Key',
      graphsPerRowLabel: 'Graphs per row',
      save: 'Save Settings',
      saved: 'Saved!',
      noKeyHint: 'Click the gear icon to add your API key',
      examplePrompt: 'Try: "Show cost by model as a bar chart"',
      placeholder: 'Ask about your data...',
      thinking: 'Thinking...',
      failedMessage: 'Failed to reach AI. Check your API key in Settings.',
    },
    table: {
      prev: 'Prev',
      next: 'Next',
    },
    graph: {
      noChart: 'No chart',
      removeLabel: 'Remove graph',
    },
  },
  ja: {
    nav: {
      upload: 'アップロード',
      dashboard: 'ダッシュボード',
    },
    home: {
      badge: 'AI搭載データビジュアライゼーション',
      title: 'データを洞察に変える',
      description: 'CSVまたはExcelファイルをアップロードし、AIとチャットで美しいグラフを即座に生成できます。',
    },
    uploader: {
      dropHere: 'CSVまたはExcelファイルをここにドロップ',
      supports: '.csv・.xlsx・.xls に対応',
    },
    chat: {
      title: 'AIアシスタント',
      subtitle: 'データについて質問する',
      providerLabel: 'AIプロバイダー',
      apiKeyLabel: 'APIキー',
      graphsPerRowLabel: '1行のグラフ数',
      save: '設定を保存',
      saved: '保存しました！',
      noKeyHint: '歯車アイコンをクリックしてAPIキーを追加',
      examplePrompt: '例：「モデル別コストを棒グラフで表示して」',
      placeholder: 'データについて質問...',
      thinking: '考え中...',
      failedMessage: 'AI接続に失敗しました。APIキーを確認してください。',
    },
    table: {
      prev: '前へ',
      next: '次へ',
    },
    graph: {
      noChart: 'グラフなし',
      removeLabel: 'グラフを削除',
    },
  },
  zh: {
    nav: {
      upload: '上传',
      dashboard: '仪表板',
    },
    home: {
      badge: 'AI 驱动的数据可视化',
      title: '将数据转化为洞察',
      description: '上传 CSV 或 Excel 文件，与 AI 对话，即刻生成精美图表。',
    },
    uploader: {
      dropHere: '将 CSV 或 Excel 文件拖放至此',
      supports: '支持 .csv、.xlsx、.xls',
    },
    chat: {
      title: 'AI 助手',
      subtitle: '询问数据相关问题',
      providerLabel: 'AI 提供商',
      apiKeyLabel: 'API 密钥',
      graphsPerRowLabel: '每行图表数',
      save: '保存设置',
      saved: '已保存！',
      noKeyHint: '点击齿轮图标添加 API 密钥',
      examplePrompt: '试试：「按模型显示费用柱状图」',
      placeholder: '询问数据相关问题...',
      thinking: '思考中...',
      failedMessage: '无法连接 AI，请检查 API 密钥。',
    },
    table: {
      prev: '上一页',
      next: '下一页',
    },
    graph: {
      noChart: '无图表',
      removeLabel: '删除图表',
    },
  },
} as const

type Messages = typeof messages.en
type FlatKeys<T, P extends string = ''> = {
  [K in keyof T]: T[K] extends string
    ? P extends '' ? `${K & string}` : `${P}.${K & string}`
    : FlatKeys<T[K], P extends '' ? `${K & string}` : `${P}.${K & string}`>
}[keyof T]

export type TranslationKey = FlatKeys<Messages>

function resolve(obj: Record<string, unknown>, path: string): string {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (typeof acc === 'object' && acc !== null) return (acc as Record<string, unknown>)[key]
    return undefined
  }, obj) as string ?? path
}

export function useTranslations() {
  const locale = useStore((s) => s.settings.locale) ?? 'en'
  const dict = messages[locale as Locale] as unknown as Record<string, unknown>
  return function t(key: TranslationKey): string {
    return resolve(dict, key)
  }
}
