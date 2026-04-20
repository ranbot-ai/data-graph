import { useState, useEffect } from 'react'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { idbStorage } from './idb'
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

interface SessionSlice {
  clearSession: () => void
}

type StoreState = DataSlice & GraphsSlice & ChatSlice & SettingsSlice & SessionSlice

const defaultSettings: Settings = {
  provider: 'claude',
  apiKeys: { claude: '', openai: '', gemini: '' },
  defaultGraphCount: 3,
  locale: 'en',
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      parsedData: null,
      setParsedData: (data) => set({ parsedData: data }),
      clearData: () => set({ parsedData: null }),

      graphs: [],
      addGraph: (config) => set((s) => ({ graphs: [...s.graphs, config] })),
      removeGraph: (id) => set((s) => ({ graphs: s.graphs.filter((g) => g.id !== id) })),
      clearGraphs: () => set({ graphs: [] }),

      messages: [],
      addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
      clearMessages: () => set({ messages: [] }),

      settings: defaultSettings,
      setProvider: (provider) =>
        set((s) => ({ settings: { ...s.settings, provider } })),
      setApiKey: (provider, key) =>
        set((s) => ({
          settings: { ...s.settings, apiKeys: { ...s.settings.apiKeys, [provider]: key } },
        })),
      setDefaultGraphCount: (count) =>
        set((s) => ({ settings: { ...s.settings, defaultGraphCount: count } })),
      setLocale: (locale) =>
        set((s) => ({ settings: { ...s.settings, locale } })),

      clearSession: () => set({ parsedData: null, graphs: [], messages: [] }),
    }),
    {
      name: 'datagraph',
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({
        settings: state.settings,
        parsedData: state.parsedData,
        graphs: state.graphs,
        messages: state.messages,
      }),
    }
  )
)

export function useHasHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() => useStore.persist.hasHydrated())
  useEffect(() => {
    const unsub = useStore.persist.onFinishHydration(() => setHydrated(true))
    return unsub
  }, [])
  return hydrated
}
