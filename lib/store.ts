import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ParsedData, GraphConfig, Settings, ChatMessage, AIProvider, Locale } from './types'

interface DataSlice {
  parsedData: ParsedData | null
  setParsedData: (data: ParsedData) => void
  clearData: () => void
}

interface GraphsSlice {
  graphs: GraphConfig[]
  addGraph: (config: GraphConfig) => void
  removeGraph: (id: string) => void
  clearGraphs: () => void
}

interface ChatSlice {
  messages: ChatMessage[]
  addMessage: (msg: ChatMessage) => void
  clearMessages: () => void
}

interface SettingsSlice {
  settings: Settings
  setProvider: (provider: AIProvider) => void
  setApiKey: (provider: AIProvider, key: string) => void
  setDefaultGraphCount: (count: number) => void
  setLocale: (locale: Locale) => void
}

type StoreState = DataSlice & GraphsSlice & ChatSlice & SettingsSlice

const defaultSettings: Settings = {
  provider: 'claude',
  apiKeys: { claude: '', openai: '', gemini: '' },
  defaultGraphCount: 3,
  locale: 'en',
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // Data slice (not persisted — see partialize below)
      parsedData: null,
      setParsedData: (data) => set({ parsedData: data }),
      clearData: () => set({ parsedData: null }),

      // Graphs slice (not persisted)
      graphs: [],
      addGraph: (config) => set((s) => ({ graphs: [...s.graphs, config] })),
      removeGraph: (id) => set((s) => ({ graphs: s.graphs.filter((g) => g.id !== id) })),
      clearGraphs: () => set({ graphs: [] }),

      // Chat slice (not persisted)
      messages: [],
      addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
      clearMessages: () => set({ messages: [] }),

      // Settings slice (persisted)
      settings: defaultSettings,
      setProvider: (provider) =>
        set((s) => ({ settings: { ...s.settings, provider } })),
      setApiKey: (provider, key) =>
        set((s) => ({
          settings: {
            ...s.settings,
            apiKeys: { ...s.settings.apiKeys, [provider]: key },
          },
        })),
      setDefaultGraphCount: (count) =>
        set((s) => ({ settings: { ...s.settings, defaultGraphCount: count } })),
      setLocale: (locale) =>
        set((s) => ({ settings: { ...s.settings, locale } })),
    }),
    {
      name: 'datagraph-settings',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
)
