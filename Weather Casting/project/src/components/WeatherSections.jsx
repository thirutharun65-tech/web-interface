import { motion } from 'framer-motion';
import {
  Droplet, Wind, Eye, Gauge, Sun, Sunrise, Sunset, Compass,
  Cloud, CloudRain, CloudSnow, CloudFog, CloudLightning, CloudDrizzle,
  CloudSun, CloudMoon, Moon, AlertTriangle, Clock,
} from 'lucide-react';
import {
  getWeatherCodeInfo, formatTemp, windDirectionLabel,
  getUVCategory, getAQICategory, getRecommendations,
} from '../services/weatherApi';
import { WeatherIcon } from './WeatherHero';
import { RECOMMENDATION_ICONS } from './UI';

// ─── Section Wrapper ──────────────────────────────────────────
function Section({ title, children, className = '' }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className={`px-4 mb-8 ${className}`}
    >
      {title && (
        <h2 className="text-sm uppercase tracking-widest font-semibold mb-3 ml-1" style={{ color: 'var(--weather-text-secondary)' }}>
          {title}
        </h2>
      )}
      {children}
    </motion.section>
  );
}

// ─── Hourly Forecast ───────────────────────────────────────────
export function HourlyForecast({ weather, unit }) {
  if (!weather?.hourly?.length) return null;
  const hours = weather.hourly.slice(0, 24);
  const now = new Date();
  const currentHour = now.getHours();

  return (
    <Section title="Hourly Forecast">
      <div className="scroll-x flex gap-2 pb-2 -mx-4 px-4">
        {hours.map((h, i) => {
          const time = new Date(h.time);
          const isNow = i === 0;
          const label = isNow ? 'Now' : time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              whileHover={{ y: -4 }}
              className={`glass rounded-2xl p-3 flex flex-col items-center gap-1.5 min-w-[72px] ${isNow ? 'ring-2' : ''}`}
              style={isNow ? { boxShadow: '0 0 0 2px var(--weather-accent)' } : {}}
            >
              <span className="text-xs font-medium" style={{ color: isNow ? 'var(--weather-accent)' : 'var(--weather-text-secondary)' }}>
                {label}
              </span>
              <WeatherIcon code={h.weatherCode} isDay={h.isDay} size={28} />
              <span className="text-base font-semibold" style={{ color: 'var(--weather-text)' }}>
                {formatTemp(h.temp, unit)}
              </span>
              <span className="text-xs flex items-center gap-0.5" style={{ color: 'var(--weather-text-secondary)' }}>
                <Droplet className="w-3 h-3" />
                {h.precipProb ?? 0}%
              </span>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

// ─── Bento Dashboard ───────────────────────────────────────────
export function BentoDashboard({ weather, state, unit }) {
  if (!weather?.current) return null;
  const { current, daily, aqi } = weather;
  const today = daily?.[0];
  const uvIndex = today?.uvIndexMax ?? 0;
  const uvCat = getUVCategory(uvIndex);
  const aqiCat = getAQICategory(aqi);
  const visibility = weather.hourly?.[0]?.visibility;

  const cards = [
    // UV Index — large
    {
      key: 'uv',
      span: 'md:col-span-2 md:row-span-2',
      content: <UVCard uvIndex={uvIndex} uvCat={uvCat} />,
    },
    // Wind — with compass
    {
      key: 'wind',
      span: 'md:col-span-2',
      content: <WindCard windSpeed={current.windSpeed} windDir={current.windDirection} />,
    },
    // Humidity
    {
      key: 'humidity',
      span: '',
      content: <SimpleCard icon={Droplet} label="Humidity" value={`${current.humidity ?? '—'}%`} subtitle={getHumidityLabel(current.humidity)} />,
    },
    // Visibility
    {
      key: 'visibility',
      span: '',
      content: <SimpleCard icon={Eye} label="Visibility" value={visibility ? `${(visibility / 1000).toFixed(1)} km` : '—'} subtitle={getVisibilityLabel(visibility)} />,
    },
    // Pressure
    {
      key: 'pressure',
      span: '',
      content: <SimpleCard icon={Gauge} label="Pressure" value={current.pressure ? `${Math.round(current.pressure)} hPa` : '—'} subtitle={getPressureLabel(current.pressure)} />,
    },
    // AQI
    {
      key: 'aqi',
      span: '',
      content: <AQICard aqi={aqi} aqiCat={aqiCat} />,
    },
    // Sunrise/Sunset — wide
    {
      key: 'sun',
      span: 'md:col-span-2',
      content: <SunPathCard sunrise={today?.sunrise} sunset={today?.sunset} />,
    },
  ];

  return (
    <Section title="Conditions">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-min">
        {cards.map((card) => (
          <motion.div
            key={card.key}
            whileHover={{ y: -4 }}
            className={`glass glass-hover rounded-2xl p-4 ${card.span}`}
          >
            {card.content}
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function UVCard({ uvIndex, uvCat }) {
  const max = 11;
  const pct = Math.min(uvIndex / max, 1);
  const circumference = 2 * Math.PI * 40;
  const dashOffset = circumference * (1 - pct);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-1.5 mb-2">
        <Sun className="w-4 h-4" style={{ color: 'var(--weather-accent)' }} />
        <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--weather-text-secondary)' }}>UV Index</span>
      </div>
      <div className="flex items-center justify-center flex-1 relative">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="var(--weather-border)" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="40" fill="none"
            stroke={uvCat.color}
            strokeWidth="6"
            strokeLinecap="round"
            className="uv-ring"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transformOrigin: 'center' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color: 'var(--weather-text)' }}>
            {uvIndex != null ? Math.round(uvIndex) : '—'}
          </span>
        </div>
      </div>
      <p className="text-sm font-medium text-center" style={{ color: uvCat.color }}>{uvCat.label}</p>
    </div>
  );
}

function WindCard({ windSpeed, windDir }) {
  const dirLabel = windDirectionLabel(windDir);
  return (
    <div className="h-full flex items-center gap-4">
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 mb-1">
          <Wind className="w-4 h-4" style={{ color: 'var(--weather-accent)' }} />
          <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--weather-text-secondary)' }}>Wind</span>
        </div>
        <span className="text-2xl font-bold" style={{ color: 'var(--weather-text)' }}>
          {Math.round(windSpeed ?? 0)}
        </span>
        <span className="text-xs" style={{ color: 'var(--weather-text-secondary)' }}>km/h</span>
      </div>
      <div className="ml-auto flex flex-col items-center">
        <div className="compass">
          <div className="compass-needle" style={{ transform: `rotate(${windDir ?? 0}deg)` }} />
        </div>
        <span className="text-xs font-semibold mt-1" style={{ color: 'var(--weather-text)' }}>{dirLabel}</span>
      </div>
    </div>
  );
}

function SimpleCard({ icon: Icon, label, value, subtitle }) {
  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-4 h-4" style={{ color: 'var(--weather-accent)' }} />
        <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--weather-text-secondary)' }}>{label}</span>
      </div>
      <span className="text-2xl font-bold" style={{ color: 'var(--weather-text)' }}>{value}</span>
      {subtitle && <span className="text-xs" style={{ color: 'var(--weather-text-secondary)' }}>{subtitle}</span>}
    </div>
  );
}

function AQICard({ aqi, aqiCat }) {
  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-center gap-1.5 mb-1">
        <Cloud className="w-4 h-4" style={{ color: 'var(--weather-accent)' }} />
        <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--weather-text-secondary)' }}>AQI</span>
      </div>
      <span className="text-2xl font-bold" style={{ color: aqi != null ? aqiCat.color : 'var(--weather-text)' }}>
        {aqi ?? '—'}
      </span>
      <span className="text-xs" style={{ color: 'var(--weather-text-secondary)' }}>{aqiCat.label}</span>
    </div>
  );
}

function SunPathCard({ sunrise, sunset }) {
  const now = new Date();
  const sr = sunrise ? new Date(sunrise) : null;
  const ss = sunset ? new Date(sunset) : null;
  let progress = 0;
  if (sr && ss) {
    if (now < sr) progress = 0;
    else if (now > ss) progress = 1;
    else progress = (now - sr) / (ss - sr);
  }

  const srTime = sr ? sr.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '—';
  const ssTime = ss ? ss.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '—';

  // Position on arc
  const arcLeft = `${progress * 100}%`;
  const arcTop = `${40 - Math.sin(progress * Math.PI) * 30}%`;

  return (
    <div className="h-full">
      <div className="flex items-center gap-1.5 mb-2">
        <Sunrise className="w-4 h-4" style={{ color: 'var(--weather-accent)' }} />
        <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--weather-text-secondary)' }}>Sun Path</span>
      </div>
      <div className="sun-arc">
        <div className="sun-arc-track" />
        <div className="sun-arc-dot" style={{ left: arcLeft, top: arcTop }} />
      </div>
      <div className="flex justify-between mt-2">
        <div className="flex items-center gap-1">
          <Sunrise className="w-3.5 h-3.5" style={{ color: 'var(--weather-accent)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--weather-text)' }}>{srTime}</span>
        </div>
        <div className="flex items-center gap-1">
          <Sunset className="w-3.5 h-3.5" style={{ color: 'var(--weather-accent)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--weather-text)' }}>{ssTime}</span>
        </div>
      </div>
    </div>
  );
}

function getHumidityLabel(h) {
  if (h == null) return '';
  if (h >= 80) return 'Humid';
  if (h >= 60) return 'Moderate';
  if (h >= 30) return 'Comfortable';
  return 'Dry';
}

function getVisibilityLabel(v) {
  if (v == null) return '';
  const km = v / 1000;
  if (km >= 10) return 'Clear';
  if (km >= 4) return 'Moderate';
  return 'Low';
}

function getPressureLabel(p) {
  if (p == null) return '';
  if (p > 1020) return 'High';
  if (p < 1000) return 'Low';
  return 'Normal';
}

// ─── 7-Day Forecast ────────────────────────────────────────────
export function SevenDayForecast({ weather, unit }) {
  if (!weather?.daily?.length) return null;
  const days = weather.daily.slice(0, 7);

  return (
    <Section title="7-Day Forecast">
      <div className="glass rounded-2xl overflow-hidden">
        {days.map((day, i) => {
          const date = new Date(day.date);
          const dayName = i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
          const codeInfo = getWeatherCodeInfo(day.weatherCode);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ x: 4 }}
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: i < days.length - 1 ? '1px solid var(--weather-border)' : 'none' }}
            >
              <span className="text-xs font-bold w-10" style={{ color: 'var(--weather-text)' }}>{dayName}</span>
              <WeatherIcon code={day.weatherCode} isDay={true} size={24} />
              <span className="text-xs flex-1 truncate" style={{ color: 'var(--weather-text-secondary)' }}>{codeInfo.label}</span>
              <span className="text-xs flex items-center gap-0.5" style={{ color: 'var(--weather-text-secondary)' }}>
                <Droplet className="w-3 h-3" />
                {day.precipProb ?? 0}%
              </span>
              <div className="flex items-center gap-2 w-20 justify-end">
                <span className="text-sm font-medium" style={{ color: 'var(--weather-text-secondary)' }}>
                  {formatTemp(day.tempMin, unit)}
                </span>
                <span className="text-sm font-bold" style={{ color: 'var(--weather-text)' }}>
                  {formatTemp(day.tempMax, unit)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

// ─── Weather Timeline ─────────────────────────────────────────
export function WeatherTimeline({ weather }) {
  if (!weather?.hourly?.length) return null;
  const h = weather.hourly;

  // Determine morning, afternoon, evening, night
  const periods = [
    { name: 'Morning', hours: [6, 7, 8, 9, 10, 11] },
    { name: 'Afternoon', hours: [12, 13, 14, 15, 16, 17] },
    { name: 'Evening', hours: [18, 19, 20, 21] },
    { name: 'Night', hours: [22, 23, 0, 1, 2, 3, 4, 5] },
  ];

  const timeline = periods.map((p) => {
    // Find the first hour in this period from our hourly data
    const matching = h.find((hour) => {
      const ht = new Date(hour.time);
      return p.hours.includes(ht.getHours());
    });
    return {
      name: p.name,
      weatherCode: matching?.weatherCode ?? h[0]?.weatherCode,
      isDay: matching?.isDay ?? 1,
      temp: matching?.temp,
    };
  });

  return (
    <Section title="Weather Timeline">
      <div className="flex items-center justify-between gap-1 sm:gap-2">
        {timeline.map((t, i) => (
          <div key={t.name} className="flex items-center flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass rounded-2xl p-3 flex flex-col items-center gap-1.5 flex-1"
            >
              <span className="text-xs font-medium" style={{ color: 'var(--weather-text-secondary)' }}>{t.name}</span>
              <WeatherIcon code={t.weatherCode} isDay={t.isDay} size={28} />
            </motion.div>
            {i < timeline.length - 1 && (
              <div className="hidden sm:block w-4 h-px" style={{ background: 'var(--weather-border)' }} />
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── Recommendations ───────────────────────────────────────────
export function Recommendations({ weather, state }) {
  if (!weather?.current) return null;
  const recs = getRecommendations(weather, state);
  if (recs.length === 0) return null;

  return (
    <Section title="What Should I Do Today?">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {recs.map((rec, i) => {
          const Icon = RECOMMENDATION_ICONS[rec.icon] || AlertTriangle;
          const priorityColor = rec.priority === 'high' ? '#ff9800' : rec.priority === 'medium' ? '#ffd54f' : '#81c784';
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -3 }}
              className="glass glass-hover rounded-2xl p-4 flex items-start gap-3"
            >
              <div className="shrink-0 p-2 rounded-xl" style={{ background: 'var(--weather-surface)' }}>
                <Icon className="w-5 h-5" style={{ color: priorityColor }} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold mb-0.5" style={{ color: 'var(--weather-text)' }}>{rec.title}</h3>
                <p className="text-xs" style={{ color: 'var(--weather-text-secondary)' }}>{rec.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
