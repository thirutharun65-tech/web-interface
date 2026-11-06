import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link as LinkIcon } from 'lucide-react';

const TOOLS = [
  { id: 'bold', icon: Bold, label: 'Bold', command: 'bold' },
  { id: 'italic', icon: Italic, label: 'Italic', command: 'italic' },
  { id: 'underline', icon: Underline, label: 'Underline', command: 'underline' },
  { id: 'ul', icon: List, label: 'Bullet List', command: 'insertUnorderedList' },
  { id: 'ol', icon: ListOrdered, label: 'Numbered List', command: 'insertOrderedList' },
  { id: 'left', icon: AlignLeft, label: 'Align Left', command: 'justifyLeft' },
  { id: 'center', icon: AlignCenter, label: 'Align Center', command: 'justifyCenter' },
  { id: 'right', icon: AlignRight, label: 'Align Right', command: 'justifyRight' },
];

export default function EmailToolbar({ editorRef }) {
  const exec = (command) => {
    document.execCommand(command, false, null);
    if (editorRef?.current) editorRef.current.focus();
  };

  const insertLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      document.execCommand('createLink', false, url);
      if (editorRef?.current) editorRef.current.focus();
    }
  };

  return (
    <div className="flex items-center gap-0.5 px-3 py-1.5 border-b border-ink-100 dark:border-ink-700 flex-wrap">
      {TOOLS.map((tool) => {
        const Icon = tool.icon;
        return (
          <button
            key={tool.id}
            type="button"
            onClick={() => exec(tool.command)}
            className="p-1.5 rounded-md text-ink-500 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700 transition-colors"
            aria-label={tool.label}
            title={tool.label}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
      <button
        type="button"
        onClick={insertLink}
        className="p-1.5 rounded-md text-ink-500 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700 transition-colors"
        aria-label="Insert link"
        title="Insert link"
      >
        <LinkIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
