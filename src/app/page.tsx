"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import FileCard from "@/components/FileCard";
import MarkdownPreview from "@/components/MarkdownPreview";

export type ConvertedFile = {
  id: string;
  filename: string;
  status: "converting" | "done" | "error";
  markdown?: string;
  error?: string;
};


export default function Home() {
  const [files, setFiles] = useState<ConvertedFile[]>([]);
  const [selected, setSelected] = useState<ConvertedFile | null>(null);

  const convertFile = useCallback(async (file: File, id: string) => {
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/convert", { method: "POST", body: form });
      const data = await res.json();

      if (!res.ok) throw new Error(data.detail ?? "Conversion failed");

      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: "done", markdown: data.markdown } : f))
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: "error", error: message } : f))
      );
    }
  }, []);

  const onDrop = useCallback(
    (accepted: File[]) => {
      const newEntries: ConvertedFile[] = accepted.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        filename: file.name,
        status: "converting",
      }));

      setFiles((prev) => [...prev, ...newEntries]);
      newEntries.forEach((entry, i) => convertFile(accepted[i], entry.id));
    },
    [convertFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleSelect = (file: ConvertedFile) => {
    setSelected(file.status === "done" ? file : null);
  };

  const handleRemove = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <header className="border-b border-gray-800 px-8 py-4 flex items-center gap-3">
        <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span className="text-lg font-semibold tracking-tight">Docling Converter</span>
        <span className="ml-auto text-xs text-gray-500">本地运行 · 离线可用</span>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-96 flex flex-col border-r border-gray-800 p-5 gap-4">
          <div
            {...getRootProps()}
            className={`rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors
              ${isDragActive
                ? "border-blue-400 bg-blue-950/30"
                : "border-gray-700 hover:border-gray-500 bg-gray-900/50"}`}
          >
            <input {...getInputProps()} />
            <svg className="w-10 h-10 mx-auto mb-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-400">
              {isDragActive ? "松开以上传文件" : "拖拽文件到此处，或点击选择"}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              PDF · DOCX · XLSX · PPTX · HTML · PNG · JPG
            </p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {files.length === 0 && (
              <p className="text-center text-xs text-gray-600 mt-8">暂无文件</p>
            )}
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                isSelected={selected?.id === file.id}
                onSelect={() => handleSelect(file)}
                onRemove={() => handleRemove(file.id)}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {selected ? (
            <MarkdownPreview file={selected} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-600 text-sm">
              选择左侧已转换的文件以预览 Markdown
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
