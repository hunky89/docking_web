import { ConvertedFile } from "@/app/page";

type Props = {
  file: ConvertedFile;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
};

const EXT_COLORS: Record<string, string> = {
  pdf: "bg-red-900/60 text-red-300",
  docx: "bg-blue-900/60 text-blue-300",
  xlsx: "bg-green-900/60 text-green-300",
  xls: "bg-green-900/60 text-green-300",
  pptx: "bg-orange-900/60 text-orange-300",
  html: "bg-purple-900/60 text-purple-300",
  htm: "bg-purple-900/60 text-purple-300",
  png: "bg-pink-900/60 text-pink-300",
  jpg: "bg-pink-900/60 text-pink-300",
  jpeg: "bg-pink-900/60 text-pink-300",
  csv: "bg-teal-900/60 text-teal-300",
};

export default function FileCard({ file, isSelected, onSelect, onRemove }: Props) {
  const ext = file.filename.split(".").pop()?.toLowerCase() ?? "";
  const colorClass = EXT_COLORS[ext] ?? "bg-gray-800 text-gray-400";

  const downloadMd = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <div
      onClick={onSelect}
      className={`rounded-lg p-3 flex items-center gap-3 cursor-pointer transition-colors border
        ${isSelected
          ? "border-blue-500 bg-blue-950/30"
          : "border-transparent bg-gray-900 hover:bg-gray-800"}`}
    >
      <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${colorClass}`}>
        {ext}
      </span>

      <span className="flex-1 text-sm truncate text-gray-200">{file.filename}</span>

      <div className="flex items-center gap-1 shrink-0">
        {file.status === "converting" && (
          <svg className="w-4 h-4 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {file.status === "done" && (
          <button
            onClick={downloadMd}
            title="下载 Markdown"
            className="text-gray-500 hover:text-green-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        )}
        {file.status === "error" && (
          <span title={file.error}>
            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="text-gray-600 hover:text-red-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
