import { Users, Clock, Star, Cake, TrendingUp, TrendingDown } from 'lucide-react';

const ICONS = {
  contacts: Users,
  followups: Clock,
  favorites: Star,
  birthdays: Cake,
};

const COLORS = {
  contacts: { bg: 'bg-brand-50 dark:bg-brand-500/15', text: 'text-brand-500', bars: 'bg-brand-400 dark:bg-brand-500' },
  followups: { bg: 'bg-amber-50 dark:bg-amber-500/15', text: 'text-amber-500', bars: 'bg-amber-400 dark:bg-amber-500' },
  favorites: { bg: 'bg-yellow-50 dark:bg-yellow-500/15', text: 'text-yellow-500', bars: 'bg-yellow-400 dark:bg-yellow-500' },
  birthdays: { bg: 'bg-pink-50 dark:bg-pink-500/15', text: 'text-pink-500', bars: 'bg-pink-400 dark:bg-pink-500' },
};

export default function StatCard({ type, title, value, status, trend, trendUp }) {
  const Icon = ICONS[type];
  const color = COLORS[type];

  const bars = [40, 65, 50, 80, 60, 90, 70];

  return (
    <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl p-5 shadow-soft hover:shadow-card transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${color.bg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color.text}`} />
        </div>
        <div className="flex items-end gap-1 h-10">
          {bars.map((h, i) => (
            <div
              key={i}
              className={`w-1.5 rounded-full ${color.bars} opacity-60`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
      <p className="text-3xl font-bold text-ink-900 dark:text-ink-50 tabular-nums">{value}</p>
      <p className="text-sm text-ink-500 dark:text-ink-400 mt-0.5">{title}</p>
      <div className="flex items-center gap-1.5 mt-3">
        {trendUp !== null && trendUp !== undefined && (
          trendUp ? (
            <TrendingUp className="w-3.5 h-3.5 text-green-500" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-red-500" />
          )
        )}
        <span className={`text-xs font-medium ${trendUp === false ? 'text-red-500' : 'text-ink-500 dark:text-ink-400'}`}>
          {trend && trendUp !== null && trendUp !== undefined ? `${trendUp ? '↑' : '↓'} ${trend}` : status}
        </span>
      </div>
    </div>
  );
}
