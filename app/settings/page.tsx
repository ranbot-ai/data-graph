"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import ProviderSelector from "@/components/ProviderSelector";
import type { AIProvider } from "@/lib/types";
import { useTranslations } from "@/lib/i18n";

export default function SettingsPage() {
  const settings = useStore((s) => s.settings);
  const setProvider = useStore((s) => s.setProvider);
  const setApiKey = useStore((s) => s.setApiKey);
  const setDefaultGraphCount = useStore((s) => s.setDefaultGraphCount);
  const t = useTranslations();

  const [saved, setSaved] = useState(false);
  const [keys, setKeys] = useState({ ...settings.apiKeys });

  function handleSave() {
    (["claude", "openai", "gemini"] as AIProvider[]).forEach((p) => {
      setApiKey(p, keys[p]);
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>

      {/* AI Provider */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
          {t("chat.providerLabel")}
        </h2>
        <ProviderSelector selected={settings.provider} onChange={setProvider} />
      </section>

      {/* API Keys */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
          {t("chat.apiKeyLabel")}
        </h2>
        <div className="flex flex-col gap-3">
          {(["claude", "openai", "gemini"] as AIProvider[]).map((provider) => (
            <div key={provider} className="flex items-center gap-3">
              <label className="w-20 text-sm text-gray-600 capitalize">
                {provider === "openai"
                  ? "ChatGPT"
                  : provider.charAt(0).toUpperCase() + provider.slice(1)}
              </label>
              <input
                type="password"
                value={keys[provider]}
                onChange={(e) =>
                  setKeys((k) => ({ ...k, [provider]: e.target.value }))
                }
                placeholder={`Enter ${provider} API key...`}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
              {keys[provider] && (
                <span className="text-xs text-green-600 whitespace-nowrap">
                  Saved
                </span>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Keys are stored in your browser only. Never sent to our servers.
        </p>
      </section>

      {/* Default Graph Count */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
          Default Graphs Per Row
        </h2>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={1}
            max={8}
            value={settings.defaultGraphCount}
            onChange={(e) => setDefaultGraphCount(Number(e.target.value))}
            className="flex-1 accent-violet-600"
          />
          <span className="text-2xl font-bold text-violet-600 w-8 text-center">
            {settings.defaultGraphCount}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>1 column</span>
          <span>8 columns</span>
        </div>
      </section>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700"
        >
          {t("chat.save")}
        </button>
        {saved && (
          <span className="text-sm text-green-600">{t("chat.saved")}</span>
        )}
      </div>
    </div>
  );
}
