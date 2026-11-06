import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, RefreshCw, Cloud, Loader2, X, AlertTriangle,
  Navigation, CloudRain, Sun, CloudSnow, CloudFog, CloudLightning,
  Moon, Zap, Droplet, Shirt, Wind, Eye, Umbrella, Snowflake, Footprints,
  Sunrise as SunriseIcon, Sunset as SunsetIcon,
} from 'lucide-react';
import { searchCities } from '../services/weatherApi';

// ─── Icon map for recommendations ──────────────────────────────
export const RECOMMENDATION_ICONS = {
  umbrella: Umbrella,
  running: Footprints,
  shirt: Shirt,
  droplet: Droplet,
  sun: Sun,
  wind: Wind,
  zap: Zap,
  'eye-off': Eye,
  snowflake: Snowflake,
};

// ─── Floating Navbar ───────────────────────────────────────────
export function Navbar({
  searchQuery, setSearchQuery, onSearchSelect,
  onLocate, onRefresh, isRefreshing, unit, onToggleUnit,
  lastUpdated, locationName,
}) {
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const debounceRef = useRef(null);
  const searchRef = useRef(null);

  const debouncedSearch = useCallback((query) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setSearchLoading(false);
        return;
      }
      setSearchLoading(true);
      const res = await searchCities(query);
      setResults(res);
      setSearchLoading(false);
    }, 350);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setActiveIdx(-1);
    if (val.trim().length >= 2) {
      setSearchLoading(true);
      debouncedSearch(val);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
      setSearchLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!showResults || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((p) => Math.min(p + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((p) => Math.max(p - 1, 0));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      selectCity(results[activeIdx]);
    } else if (e.key === 'Escape') {
      setShowResults(false);
    }
  };

  const selectCity = (city) => {
    onSearchSelect(city);
    setShowResults(false);
    setMobileSearchOpen(false);
    setSearchQuery('');
    setResults([]);
    setActiveIdx(-1);
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const formatUpdated = () => {
    if (!lastUpdated) return '';
    const diff = Math.floor((Date.now() - lastUpdated) / 60000);
    if (diff < 1) return 'Updated just now';
    if (diff < 60) return `Updated ${diff} min ago`;
    return `Updated ${Math.floor(diff / 60)}h ago`;
  };

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-3 left-0 right-0 z-50 px-3 sm:px-4"
      >
        <div className="glass-strong rounded-2xl px-3 sm:px-5 py-2.5 flex items-center gap-2 sm:gap-4 max-w-6xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Cloud className="w-5 h-5 sm:w-6 sm:h-6 text-accent" style={{ color: 'var(--weather-accent)' }} />
            </motion.div>
            <span className="font-bold text-sm sm:text-lg text-primary" style={{ color: 'var(--weather-text)' }}>
              Weather Casting
            </span>
          </div>

          {/* Desktop Search */}
          <div ref={searchRef} className="relative flex-1 hidden md:block max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" style={{ color: 'var(--weather-text-secondary)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => results.length > 0 && setShowResults(true)}
                placeholder="Search city..."
                aria-label="Search for a city"
                className="w-full pl-9 pr-8 py-2 rounded-xl text-sm text-primary bg-white/10 border border-white/20 focus:bg-white/15 focus:outline-none focus:border-white/30 transition-all"
                style={{ color: 'var(--weather-text)', borderColor: 'var(--weather-border)' }}
              />
              {searchLoading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 loading-spin" style={{ color: 'var(--weather-text-secondary)' }} />
              )}
              {searchQuery && !searchLoading && (
                <button
                  onClick={() => { setSearchQuery(''); setResults([]); setShowResults(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" style={{ color: 'var(--weather-text-secondary)' }} />
                </button>
              )}
            </div>
            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-2 left-0 right-0 glass-strong rounded-xl overflow-hidden max-h-80 overflow-y-auto"
                >
                  {results.length === 0 && !searchLoading && searchQuery.trim().length >= 2 ? (
                    <div className="px-4 py-6 text-center text-sm text-secondary" style={{ color: 'var(--weather-text-secondary)' }}>
                      <AlertTriangle className="w-5 h-5 mx-auto mb-2" />
                      City not found. Try another location.
                    </div>
                  ) : (
                    results.map((city, idx) => (
                      <motion.button
                        key={city.id || idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        onClick={() => selectCity(city)}
                        onMouseEnter={() => setActiveIdx(idx)}
                        className={`w-full px-4 py-2.5 flex items-center gap-2 text-left transition-colors ${
                          idx === activeIdx ? 'bg-white/15' : 'hover:bg-white/10'
                        }`}
                        style={{ borderBottom: '1px solid var(--weather-border)' }}
                      >
                        <MapPin className="w-4 h-4 shrink-0" style={{ color: 'var(--weather-accent)' }} />
                        <div className="min-w-0">
                          <span className="text-sm font-medium text-primary block truncate" style={{ color: 'var(--weather-text)' }}>
                            {city.name}
                          </span>
                          <span className="text-xs text-secondary truncate block" style={{ color: 'var(--weather-text-secondary)' }}>
                            {[city.region, city.country].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      </motion.button>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto shrink-0">
            {/* Mobile search toggle */}
            <button
              onClick={() => setMobileSearchOpen(true)}
              className="md:hidden p-2 rounded-xl glass glass-hover"
              aria-label="Search"
            >
              <Search className="w-4 h-4" style={{ color: 'var(--weather-text)' }} />
            </button>

            <button
              onClick={onLocate}
              className="p-2 rounded-xl glass glass-hover flex items-center gap-1.5"
              aria-label="Use current location"
              title="Use my current location"
            >
              <Navigation className="w-4 h-4" style={{ color: 'var(--weather-text)' }} />
            </button>

            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl glass glass-hover flex items-center gap-1.5"
              aria-label="Refresh weather"
              title={formatUpdated()}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'loading-spin' : ''}`} style={{ color: 'var(--weather-text)' }} />
            </button>

            {/* Unit Toggle */}
            <button
              onClick={onToggleUnit}
              className="px-2.5 py-2 rounded-xl glass glass-hover text-sm font-semibold"
              aria-label="Toggle temperature unit"
              style={{ color: 'var(--weather-text)' }}
            >
              {unit === 'c' ? '°C' : '°F'}
            </button>
          </div>
        </div>

        {/* Updated time */}
        {lastUpdated && (
          <div className="text-center mt-1 text-xs text-secondary hidden sm:block" style={{ color: 'var(--weather-text-secondary)' }}>
            {formatUpdated()} {locationName ? `· ${locationName}` : ''}
          </div>
        )}
      </motion.nav>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 md:hidden flex flex-col p-4 pt-6"
            onClick={() => setMobileSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              className="glass-strong rounded-2xl p-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--weather-text-secondary)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  placeholder="Search city..."
                  aria-label="Search for a city"
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl text-sm bg-white/10 border focus:outline-none"
                  style={{ color: 'var(--weather-text)', borderColor: 'var(--weather-border)' }}
                />
                {searchLoading && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 loading-spin" style={{ color: 'var(--weather-text-secondary)' }} />
                )}
              </div>
              <div className="mt-2 max-h-80 overflow-y-auto">
                {results.length === 0 && !searchLoading && searchQuery && searchQuery.trim().length >= 2 ? (
                  <div className="px-4 py-6 text-center text-sm" style={{ color: 'var(--weather-text-secondary)' }}>
                    <AlertTriangle className="w-5 h-5 mx-auto mb-2" />
                    City not found. Try another location.
                  </div>
                ) : (
                  results.map((city, idx) => (
                    <button
                      key={city.id || idx}
                      onClick={() => selectCity(city)}
                      className="w-full px-4 py-2.5 flex items-center gap-2 text-left hover:bg-white/10 rounded-lg"
                    >
                      <MapPin className="w-4 h-4 shrink-0" style={{ color: 'var(--weather-accent)' }} />
                      <div className="min-w-0">
                        <span className="text-sm font-medium block truncate" style={{ color: 'var(--weather-text)' }}>
                          {city.name}
                        </span>
                        <span className="text-xs truncate block" style={{ color: 'var(--weather-text-secondary)' }}>
                          {[city.region, city.country].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Weather Effects ────────────────────────────────────────────
export function WeatherEffects({ state }) {
  if (!state) return null;
  const { type, time, intensity } = state;

  // Night stars
  const stars = [];
  if (time === 'night') {
    for (let i = 0; i < 40; i++) {
      stars.push({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 60}%`,
        duration: `${2 + Math.random() * 3}s`,
        delay: `${Math.random() * 3}s`,
      });
    }
  }

  // Rain drops
  const raindrops = [];
  if (type === 'rain' || type === 'heavy-rain' || type === 'thunderstorm') {
    const count = type === 'heavy-rain' || intensity === 'heavy' ? 60 : 30;
    for (let i = 0; i < count; i++) {
      raindrops.push({
        left: `${Math.random() * 100}%`,
        height: `${10 + Math.random() * 20}px`,
        duration: `${0.4 + Math.random() * 0.4}s`,
        delay: `${Math.random() * 2}s`,
        heavy: type === 'heavy-rain' || intensity === 'heavy',
      });
    }
  }

  // Snowflakes
  const snowflakes = [];
  if (type === 'snow') {
    for (let i = 0; i < 30; i++) {
      snowflakes.push({
        left: `${Math.random() * 100}%`,
        fontSize: `${8 + Math.random() * 8}px`,
        duration: `${4 + Math.random() * 4}s`,
        delay: `${Math.random() * 4}s`,
        char: Math.random() > 0.5 ? '❄' : '❅',
      });
    }
  }

  // Clouds
  const clouds = [];
  if (['partly-cloudy', 'cloudy', 'rain', 'heavy-rain', 'thunderstorm', 'fog', 'snow'].includes(type) || time === 'night') {
    const count = type === 'cloudy' || type === 'fog' ? 5 : 3;
    for (let i = 0; i < count; i++) {
      clouds.push({
        top: `${10 + Math.random() * 40}%`,
        width: `${150 + Math.random() * 200}px`,
        height: `${60 + Math.random() * 40}px`,
        duration: `${30 + Math.random() * 30}s`,
        delay: `${-Math.random() * 30}s`,
        opacity: type === 'thunderstorm' || time === 'night' ? 0.15 : 0.4,
      });
    }
  }

  // Fog layers
  const fogLayers = [];
  if (type === 'fog') {
    for (let i = 0; i < 4; i++) {
      fogLayers.push({
        top: `${20 + i * 20}%`,
        duration: `${20 + i * 10}s`,
        delay: `${-i * 5}s`,
      });
    }
  }

  // Light particles for clear/sunny
  const particles = [];
  if (type === 'clear' && time === 'day') {
    for (let i = 0; i < 15; i++) {
      particles.push({
        left: `${Math.random() * 100}%`,
        duration: `${6 + Math.random() * 6}s`,
        delay: `${Math.random() * 6}s`,
      });
    }
  }

  return (
    <div className="weather-effects" aria-hidden="true">
      {/* Sun glow */}
      {type === 'clear' && time === 'day' && <div className="sun-glow" />}

      {/* Moon glow */}
      {time === 'night' && (type === 'clear' || type === 'partly-cloudy') && <div className="moon-glow" />}

      {/* Stars */}
      {time === 'night' && stars.map((s, i) => (
        <div key={`star-${i}`} className="star" style={{ left: s.left, top: s.top, animationDuration: s.duration, animationDelay: s.delay }} />
      ))}

      {/* Clouds */}
      {clouds.map((c, i) => (
        <div key={`cloud-${i}`} className="cloud" style={{ top: c.top, width: c.width, height: c.height, animationDuration: c.duration, animationDelay: c.delay, opacity: c.opacity }} />
      ))}

      {/* Rain */}
      {raindrops.map((r, i) => (
        <div
          key={`rain-${i}`}
          className={r.heavy ? 'raindrop-heavy' : 'raindrop'}
          style={{ left: r.left, height: r.height, animationDuration: r.duration, animationDelay: r.delay }}
        />
      ))}

      {/* Snow */}
      {snowflakes.map((s, i) => (
        <div key={`snow-${i}`} className="snowflake" style={{ left: s.left, fontSize: s.fontSize, animationDuration: s.duration, animationDelay: s.delay }}>
          {s.char}
        </div>
      ))}

      {/* Fog */}
      {fogLayers.map((f, i) => (
        <div key={`fog-${i}`} className="fog-layer" style={{ top: f.top, animationDuration: f.duration, animationDelay: f.delay }} />
      ))}

      {/* Lightning */}
      {type === 'thunderstorm' && <div className="lightning" />}

      {/* Light particles */}
      {particles.map((p, i) => (
        <div key={`particle-${i}`} className="particle" style={{ left: p.left, animationDuration: p.duration, animationDelay: p.delay }} />
      ))}
    </div>
  );
}

// ─── Loading Screen ────────────────────────────────────────────
export function LoadingScreen({ locating = false }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(180deg, #2196f3 0%, #42a5f5 30%, #64b5f6 60%, #bbdefb 100%)' }}
    >
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Cloud className="w-20 h-20 text-white/80" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-white/90 text-lg font-medium"
      >
        {locating ? 'Detecting your location...' : 'Loading weather...'}
      </motion.p>
      {locating && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-2 text-white/70 text-sm"
        >
          Please allow location access for local weather
        </motion.p>
      )}
      <div className="mt-4 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            className="w-2 h-2 rounded-full bg-white/60"
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Error Banner ──────────────────────────────────────────────
export function ErrorBanner({ message, onRetry, hasData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-strong rounded-xl px-4 py-3 flex items-center gap-3 max-w-2xl mx-auto mt-20"
    >
      <AlertTriangle className="w-5 h-5 shrink-0" style={{ color: '#ff9800' }} />
      <div className="flex-1">
        <p className="text-sm font-medium" style={{ color: 'var(--weather-text)' }}>
          {message}
        </p>
        {hasData && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--weather-text-secondary)' }}>
            Showing last available weather.
          </p>
        )}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1.5 rounded-lg glass glass-hover text-sm font-medium"
          style={{ color: 'var(--weather-text)' }}
        >
          Retry
        </button>
      )}
    </motion.div>
  );
}

// ─── Tamil Nadu Quick Search ───────────────────────────────────
export function TamilNaduQuickSearch({ onSelect, currentLocation }) {
  const cities = [
    { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
    { name: 'Chengalpattu', lat: 12.6755, lon: 79.9953 },
    { name: 'Kanchipuram', lat: 12.8380, lon: 79.7036 },
    { name: 'Tiruvallur', lat: 13.1450, lon: 79.9260 },
    { name: 'Vellore', lat: 12.9166, lon: 79.1325 },
    { name: 'Ranipet', lat: 12.9264, lon: 79.3350 },
    { name: 'Tirupathur', lat: 12.4950, lon: 78.6250 },
    { name: 'Tiruvannamalai', lat: 12.2253, lon: 79.0747 },
    { name: 'Krishnagiri', lat: 12.5266, lon: 78.2150 },
    { name: 'Dharmapuri', lat: 12.1215, lon: 78.1580 },
    { name: 'Salem', lat: 11.6643, lon: 78.1460 },
    { name: 'Namakkal', lat: 11.2210, lon: 78.1667 },
    { name: 'Erode', lat: 11.3410, lon: 77.7170 },
    { name: 'Tiruppur', lat: 11.1085, lon: 77.3411 },
    { name: 'Coimbatore', lat: 11.0168, lon: 76.9558 },
    { name: 'Nilgiris', lat: 11.4064, lon: 76.7136 },
    { name: 'Dindigul', lat: 10.3623, lon: 77.9695 },
    { name: 'Karur', lat: 10.9577, lon: 78.0809 },
    { name: 'Trichy', lat: 10.7905, lon: 78.7047 },
    { name: 'Perambalur', lat: 11.2333, lon: 78.8833 },
    { name: 'Ariyalur', lat: 11.1394, lon: 79.0847 },
    { name: 'Cuddalore', lat: 11.7460, lon: 79.7624 },
    { name: 'Nagapattinam', lat: 10.7656, lon: 79.8428 },
    { name: 'Mayiladuthurai', lat: 11.1052, lon: 79.6556 },
    { name: 'Thanjavur', lat: 10.7870, lon: 79.1378 },
    { name: 'Tiruvarur', lat: 10.8833, lon: 79.0833 },
    { name: 'Pudukkottai', lat: 10.3813, lon: 78.8213 },
    { name: 'Sivagangai', lat: 9.8500, lon: 78.4833 },
    { name: 'Madurai', lat: 9.9252, lon: 78.1198 },
    { name: 'Theni', lat: 10.0150, lon: 77.4760 },
    { name: 'Virudhunagar', lat: 9.5600, lon: 77.9600 },
    { name: 'Ramanathapuram', lat: 9.3714, lon: 78.8310 },
    { name: 'Sivakasi', lat: 9.4500, lon: 77.7333 },
    { name: 'Tuticorin', lat: 8.7642, lon: 78.1348 },
    { name: 'Tirunelveli', lat: 8.7139, lon: 77.7567 },
    { name: 'Tenkasi', lat: 8.9600, lon: 77.3150 },
    { name: 'Kanyakumari', lat: 8.0883, lon: 77.5385 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-5xl mx-auto px-4 mb-6"
    >
      <p className="text-xs uppercase tracking-wider mb-2 text-center" style={{ color: 'var(--weather-text-secondary)' }}>
        Tamil Nadu Districts
      </p>
      <div className="flex flex-wrap justify-center gap-2 max-h-32 overflow-y-auto scroll-x pb-1">
        {cities.map((city) => (
          <motion.button
            key={city.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(city)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium glass glass-hover transition-all ${
              currentLocation === city.name ? 'ring-2' : ''
            }`}
            style={{
              color: 'var(--weather-text)',
              borderColor: 'var(--weather-border)',
              ...(currentLocation === city.name ? { boxShadow: '0 0 0 2px var(--weather-accent)' } : {}),
            }}
          >
            {city.name}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Footer ────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer className="relative z-10 py-8 px-4 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Cloud className="w-5 h-5" style={{ color: 'var(--weather-accent)' }} />
          <span className="font-bold text-primary" style={{ color: 'var(--weather-text)' }}>
            Weather Casting
          </span>
        </div>
        <p className="text-sm text-secondary mb-1" style={{ color: 'var(--weather-text-secondary)' }}>
          Live weather for cities around the world.
        </p>
        <p className="text-xs text-secondary" style={{ color: 'var(--weather-text-secondary)' }}>
          Real-time weather powered by Open-Meteo.
        </p>
        <p className="text-xs text-secondary mt-2" style={{ color: 'var(--weather-text-secondary)' }}>
          © 2026 Weather Casting
        </p>
      </div>
    </footer>
  );
}
