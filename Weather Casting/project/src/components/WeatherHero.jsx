import { motion } from 'framer-motion';
import {
  Droplet, Wind, MapPin, Eye, Gauge, CloudRain, Sun, Moon,
  CloudSun, Cloud, CloudSnow, CloudFog, CloudLightning, CloudDrizzle,
  Sunrise as SunriseIcon, Sunset as SunsetIcon,
} from 'lucide-react';
import {
  getWeatherCodeInfo, formatTemp, windDirectionLabel,
} from '../services/weatherApi';

// ─── Weather Icon with animation ──────────────────────────────
export function WeatherIcon({ code, isDay, size = 80, className = '' }) {
  const info = getWeatherCodeInfo(code);
  const Icon = info.icon;
  const animClass = getIconAnimation(info.type, isDay);
  return <Icon size={size} className={`${animClass} ${className}`} strokeWidth={1.5} />;
}

function getIconAnimation(type, isDay) {
  if (type === 'clear' && isDay) return 'icon-glow icon-float';
  if (type === 'clear' && !isDay) return 'icon-glow';
  if (type === 'partly-cloudy') return 'icon-float';
  if (type === 'rain' || type === 'heavy-rain') return 'icon-float';
  if (type === 'snow') return 'icon-float';
  if (type === 'fog') return 'icon-float';
  if (type === 'thunderstorm') return 'icon-float';
  return 'icon-float';
}

// ─── Immersive Hero ────────────────────────────────────────────
export function WeatherHero({ location, weather, state, unit }) {
  if (!weather || !weather.current) return null;
  const { current } = weather;
  const codeInfo = getWeatherCodeInfo(current.weatherCode);
  const temp = formatTemp(current.temperature, unit);
  const feelsLike = formatTemp(current.apparentTemperature, unit);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative z-10 px-4 pt-24 sm:pt-28 pb-8"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Location */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-1.5 mb-3"
        >
          <MapPin className="w-4 h-4" style={{ color: 'var(--weather-accent)' }} />
          <h1 className="text-lg sm:text-2xl font-semibold text-primary" style={{ color: 'var(--weather-text)' }}>
            {location.name}
            {(location.region || location.country) && (
              <span className="text-secondary font-normal" style={{ color: 'var(--weather-text-secondary)' }}>
                {', '}
                {[location.region, location.country].filter(Boolean).join(', ')}
              </span>
            )}
          </h1>
        </motion.div>

        {/* Weather Icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
          className="flex justify-center mb-2"
        >
          <WeatherIcon
            code={current.weatherCode}
            isDay={current.isDay}
            size={100}
          />
        </motion.div>

        {/* Temperature */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-1"
        >
          <span
            className="font-extralight leading-none tracking-tighter"
            style={{
              fontSize: 'clamp(5rem, 18vw, 10rem)',
              color: 'var(--weather-text)',
            }}
          >
            {temp}
          </span>
        </motion.div>

        {/* Condition */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm sm:text-base uppercase tracking-widest font-medium mb-4"
          style={{ color: 'var(--weather-text-secondary)' }}
        >
          {codeInfo.label}
        </motion.p>

        {/* Feels like */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm mb-6"
          style={{ color: 'var(--weather-text-secondary)' }}
        >
          Feels like {feelsLike}
        </motion.p>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center gap-4 sm:gap-8 flex-wrap"
        >
          <QuickStat icon={Droplet} label="Humidity" value={`${current.humidity ?? '—'}%`} />
          <QuickStat icon={Wind} label="Wind" value={`${Math.round(current.windSpeed ?? 0)} km/h`} />
          {current.cloudCover != null && (
            <QuickStat icon={Cloud} label="Cloud" value={`${current.cloudCover}%`} />
          )}
          {current.pressure != null && (
            <QuickStat icon={Gauge} label="Pressure" value={`${Math.round(current.pressure)} hPa`} />
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}

function QuickStat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4" style={{ color: 'var(--weather-accent)' }} />
      <div className="text-left">
        <p className="text-xs" style={{ color: 'var(--weather-text-secondary)' }}>{label}</p>
        <p className="text-sm font-semibold" style={{ color: 'var(--weather-text)' }}>{value}</p>
      </div>
    </div>
  );
}
