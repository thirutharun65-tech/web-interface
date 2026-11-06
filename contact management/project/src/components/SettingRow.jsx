export default function SettingRow({ icon: Icon, title, description, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-ink-100 dark:border-ink-700 last:border-0">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {Icon && (
          <div className="w-9 h-9 rounded-lg bg-ink-50 dark:bg-ink-700 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-ink-500 dark:text-ink-300" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink-900 dark:text-ink-50">{title}</p>
          {description && <p className="text-sm text-ink-500 dark:text-ink-400 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
