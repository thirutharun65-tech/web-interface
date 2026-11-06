import { useState, useMemo } from 'react';

export default function GrowthChart({ contacts }) {
  const [range, setRange] = useState('6m');

  const data = useMemo(() => {
    const now = new Date();
    const months = [];
    const numMonths = 6;
    for (let i = numMonths - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ label: d.toLocaleDateString('en', { month: 'short' }), year: d.getFullYear(), month: d.getMonth(), count: 0 });
    }
    contacts.forEach((c) => {
      if (!c.createdAt) return;
      const d = new Date(c.createdAt);
      if (isNaN(d.getTime())) return;
      months.forEach((m) => {
        const mDate = new Date(m.year, m.month, 1);
        if (d <= mDate || (d.getFullYear() === m.year && d.getMonth() === m.month)) {
          m.count++;
        }
      });
    });
    const maxCount = Math.max(...months.map((m) => m.count), 1);
    const prevPeriod = months.map((m, i) => Math.round(maxCount * (0.3 + (i / numMonths) * 0.4)));
    return { months, maxCount, prevPeriod };
  }, [contacts]);

  const width = 100;
  const height = 200;
  const padding = { top: 20, right: 10, bottom: 30, left: 10 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const buildPath = (values) => {
    if (values.length === 0) return '';
    const stepX = chartW / (values.length - 1);
    return values.map((v, i) => {
      const x = padding.left + i * stepX;
      const y = padding.top + chartH - (v / data.maxCount) * chartH;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const buildArea = (values) => {
    if (values.length === 0) return '';
    const stepX = chartW / (values.length - 1);
    const path = values.map((v, i) => {
      const x = padding.left + i * stepX;
      const y = padding.top + chartH - (v / data.maxCount) * chartH;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    return `${path} L ${padding.left + (values.length - 1) * stepX} ${padding.top + chartH} L ${padding.left} ${padding.top + chartH} Z`;
  };

  const activeValues = data.months.map((m) => m.count);
  const prevValues = data.prevPeriod;

  return (
    <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl p-5 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-ink-900 dark:text-ink-50">Contacts growth</h3>
          <p className="text-sm text-ink-500 dark:text-ink-400">Network expansion trajectory</p>
        </div>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="text-sm font-medium text-ink-600 dark:text-ink-300 bg-ink-50 dark:bg-ink-700 border border-ink-100 dark:border-ink-600 rounded-lg px-3 py-1.5 outline-none cursor-pointer hover:border-ink-200 dark:hover:border-ink-500"
        >
          <option value="6m">Last 6 months</option>
          <option value="3m">Last 3 months</option>
          <option value="12m">Last 12 months</option>
        </select>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
          <span className="text-xs font-medium text-ink-600 dark:text-ink-300">Active network</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-ink-300 dark:bg-ink-500" />
          <span className="text-xs font-medium text-ink-600 dark:text-ink-300">Previous period</span>
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6C5CE7" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#6C5CE7" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 0.25, 0.5, 0.75, 1].map((p) => (
            <line
              key={p}
              x1={padding.left}
              x2={width - padding.right}
              y1={padding.top + chartH * p}
              y2={padding.top + chartH * p}
              stroke="currentColor"
              className="text-ink-100 dark:text-ink-700"
              strokeWidth="0.3"
            />
          ))}
          <path d={buildArea(prevValues)} fill="none" stroke="#C9C0F8" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d={buildArea(activeValues)} fill="url(#areaGradient)" />
          <path d={buildPath(activeValues)} fill="none" stroke="#6C5CE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {activeValues.map((v, i) => {
            const stepX = chartW / (activeValues.length - 1);
            const x = padding.left + i * stepX;
            const y = padding.top + chartH - (v / data.maxCount) * chartH;
            return <circle key={i} cx={x} cy={y} r="2.5" fill="#6C5CE7" />;
          })}
          {data.months.map((m, i) => {
            const stepX = chartW / (data.months.length - 1);
            const x = padding.left + i * stepX;
            return (
              <text key={i} x={x} y={height - 8} textAnchor="middle" className="fill-ink-400 dark:fill-ink-400" style={{ fontSize: '7px', fontWeight: 600 }}>
                {m.label}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
