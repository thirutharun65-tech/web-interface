import { Paperclip, X } from 'lucide-react';

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AttachmentList({ attachments, onRemove }) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-4 py-2 border-t border-ink-100 dark:border-ink-700">
      {attachments.map((file, i) => (
        <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-ink-50 dark:bg-ink-700 rounded-lg text-xs">
          <Paperclip className="w-3.5 h-3.5 text-ink-400 shrink-0" />
          <div className="min-w-0">
            <p className="font-medium text-ink-700 dark:text-ink-200 truncate max-w-[150px]">{file.name}</p>
            <p className="text-ink-400">{formatSize(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="p-0.5 rounded text-ink-400 hover:text-red-500 transition-colors shrink-0"
            aria-label="Remove attachment"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
