"use client";

import { useState } from "react";
import { ConvertedFile } from "@/app/page";

type Props = { file: ConvertedFile };

export default function MarkdownPreview({ file }: Props) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!file.markdown) return;
    await navigator.clipboard.writeText(file.markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMd = () => {
    if (!file.markdown) return;
    const blob = new Blob([file.markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.filename.replace(/\.[^.]+$/, ".md");
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-800 px-6 py-3 flex items-center gap-3">
        <span className="text-sm text-gray-300 truncate flex-1">
          {file.filename.replace(/\.[^.]+$/, ".md")}
        </span>
        <button
          onClick={copyToClipboard}
          className="text-xs px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {copied ? "已复制" : "复制"}
        </button>
        <button
          onClick={downloadMd}
          className="text-xs px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          下载 .md
        </button>
      </div>

      <pre className="flex-1 overflow-auto p-6 text-sm text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">
        {file.markdown}
      </pre>
    </div>
  );
}
