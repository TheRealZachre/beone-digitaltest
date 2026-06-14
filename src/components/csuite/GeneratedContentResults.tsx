"use client";

import { Copy, Download } from "lucide-react";
import { formatGeneratedContentForExport } from "@/lib/csuite/format-content";
import type { GeneratedExecutiveContent } from "@/lib/csuite/types";

interface GeneratedContentResultsProps {
  result: GeneratedExecutiveContent;
  onReset?: () => void;
}

export function GeneratedContentResults({
  result,
  onReset,
}: GeneratedContentResultsProps) {
  function copyText(text: string) {
    void navigator.clipboard.writeText(text);
  }

  function downloadPackage() {
    const blob = new Blob([formatGeneratedContentForExport(result)], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.executiveId}-content-package.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const outputs = [result.linkedinPost, result.linkedinArticle, result.xPost];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Generated for
          </p>
          <h2 className="text-xl font-semibold text-slate-900">
            {result.executiveName}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{result.theme.title}</p>
          <p className="mt-1 text-xs text-slate-400">{result.sourceSummary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={downloadPackage}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
          <button
            type="button"
            onClick={() => copyText(formatGeneratedContentForExport(result))}
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700"
          >
            <Copy className="h-4 w-4" />
            Copy all
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900">Platform variations</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          {result.platformVariations.map((item) => (
            <li key={item.platform}>
              <span className="font-medium text-slate-800">{item.platform}:</span>{" "}
              {item.note}
            </li>
          ))}
        </ul>
      </div>

      {outputs.map((output) => (
        <div
          key={output.platform}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-900">{output.label}</h3>
              <p className="text-xs text-slate-400">
                {output.charCount} characters · {output.structure.join(" → ")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => copyText(output.content)}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </button>
          </div>
          <pre className="mt-4 max-h-80 overflow-y-auto whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-700">
            {output.content}
          </pre>
        </div>
      ))}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">
          Suggested visuals & data points
        </h3>
        <ul className="mt-4 space-y-3">
          {result.visualSuggestions.map((visual) => (
            <li
              key={visual.description}
              className="rounded-lg border border-violet-100 bg-violet-50/40 px-4 py-3 text-sm text-slate-700"
            >
              <span className="font-medium capitalize text-violet-800">
                {visual.type.replace("-", " ")}:
              </span>{" "}
              {visual.description}
            </li>
          ))}
        </ul>
      </div>

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-medium text-violet-600 hover:text-violet-700"
        >
          Generate another package
        </button>
      )}
    </div>
  );
}
