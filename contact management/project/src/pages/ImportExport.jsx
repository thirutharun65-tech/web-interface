import { useRef, useState } from 'react';
import { Download, Upload, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { toCSV, downloadCSV, csvToContacts } from '@/utils/helpers';

export default function ImportExport() {
  const { contacts, importContacts, showToast } = useApp();
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleExport = () => {
    const csv = toCSV(contacts);
    downloadCSV(csv, 'contactly-export.csv');
    showToast('CSV exported successfully');
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const parsed = csvToContacts(text);
      setPreview(parsed);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!preview || preview.length === 0) return;
    importContacts(preview);
    showToast(`${preview.length} contacts imported successfully`);
    setPreview(null);
    setFileName('');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-50">Import & Export</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">Backup or restore your contacts via CSV</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl shadow-soft p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-500/15 flex items-center justify-center">
              <Download className="w-5 h-5 text-brand-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink-900 dark:text-ink-50">Export contacts</h3>
              <p className="text-sm text-ink-500 dark:text-ink-400">Download all {contacts.length} contacts as CSV</p>
            </div>
          </div>
          <div className="bg-ink-50 dark:bg-ink-700/50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-ink-500 dark:text-ink-400">
              <FileText className="w-4 h-4" />
              <span>contactly-export.csv</span>
              <span className="ml-auto text-xs">{contacts.length} rows</span>
            </div>
          </div>
          <button onClick={handleExport} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-soft transition-colors">
            <Download className="w-4 h-4" /> Export to CSV
          </button>
        </div>

        <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl shadow-soft p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-green-50 dark:bg-green-500/15 flex items-center justify-center">
              <Upload className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink-900 dark:text-ink-50">Import contacts</h3>
              <p className="text-sm text-ink-500 dark:text-ink-400">Upload a CSV file to import contacts</p>
            </div>
          </div>
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-ink-200 dark:border-ink-600 rounded-xl p-6 text-center cursor-pointer hover:border-brand-400 dark:hover:border-brand-500 transition-colors mb-4"
          >
            <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} className="hidden" />
            <Upload className="w-8 h-8 text-ink-300 dark:text-ink-600 mx-auto mb-2" />
            <p className="text-sm text-ink-500 dark:text-ink-400">
              {fileName ? fileName : 'Click to select a CSV file'}
            </p>
          </div>
          {preview !== null && (
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm font-medium text-green-500 mb-2">
                <CheckCircle2 className="w-4 h-4" />
                {preview.length} contacts ready to import
              </div>
              <div className="max-h-32 overflow-y-auto bg-ink-50 dark:bg-ink-700/50 rounded-xl p-3 space-y-1">
                {preview.slice(0, 5).map((c, i) => (
                  <p key={i} className="text-xs text-ink-500 dark:text-ink-400">
                    {c.firstName} {c.lastName} {c.email && `· ${c.email}`}
                  </p>
                ))}
                {preview.length > 5 && <p className="text-xs text-ink-400">...and {preview.length - 5} more</p>}
              </div>
            </div>
          )}
          <button
            onClick={handleImport}
            disabled={!preview || preview.length === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-soft transition-colors"
          >
            <Upload className="w-4 h-4" /> Import {preview ? `${preview.length} contacts` : 'contacts'}
          </button>
        </div>
      </div>
    </div>
  );
}
