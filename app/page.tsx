"use client";

import { useRouter } from "next/navigation";
import FileUploader from "@/components/FileUploader";
import { useStore } from "@/lib/store";
import type { ParsedData } from "@/lib/types";
import { useTranslations } from "@/lib/i18n";

export default function UploadPage() {
  const router = useRouter();
  const setParsedData = useStore((s) => s.setParsedData);
  const clearGraphs = useStore((s) => s.clearGraphs);
  const clearMessages = useStore((s) => s.clearMessages);
  const t = useTranslations();

  function handleData(data: ParsedData) {
    clearGraphs();
    clearMessages();
    setParsedData(data);
    router.push("/dashboard");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <div className="text-center mb-10">
        <span className="inline-block px-3 py-1 text-xs font-medium bg-violet-500/10 text-violet-400 rounded-full border border-violet-500/20 mb-4">
          {t("home.badge")}
        </span>
        <h1 className="font-heading text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">
          {t("home.title")}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base">
          {t("home.description")}
        </p>
      </div>
      <FileUploader onData={handleData} />
    </div>
  );
}
