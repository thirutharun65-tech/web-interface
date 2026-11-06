import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import {
  Navbar, WeatherEffects, LoadingScreen, ErrorBanner,
  TamilNaduQuickSearch, Footer,
} from './components/UI';
import { WeatherHero } from './components/WeatherHero';

import {
  HourlyForecast, BentoDashboard, SevenDayForecast,
  WeatherTimeline, Recommendations,
} from './components/WeatherSections';
import { WeatherMap } from './components/WeatherMap';
import {
  getWeatherByCoordinates, reverseGeocode,
  getWeatherState, getTheme,
} from './services/weatherApi';

const DEFAULT_LOCATION = {
  name: 'Chennai',
  region: 'Tamil Nadu',
  country: 'India',
  latitude: 13.0827,
  longitude: 80.2707,
  countryCode: 'IN',
};

const REFRESH_INTERVAL = 12 * 60 * 1000; // 12 minutes

export default function App() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('c');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [switching, setSwitching] = useState(false);

  // Ref to avoid stale closure in fetchWeather error handling
  const weatherRef = useRef(null);
  weatherRef.current = weather;

  // ─── Fetch Weather ────────────────────────────────────────
  const fetchWeather = useCallback(async (loc, isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else if (weatherRef.current) {
      setSwitching(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await getWeatherByCoordinates(loc.latitude, loc.longitude, loc.timezone || 'auto');
      setWeather(data);
      setLastUpdated(Date.now());
    } catch {
      if (weatherRef.current) {
        setError('Unable to refresh. Showing last available weather.');
      } else {
        setError('Unable to load weather. Please try again.');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
      setSwitching(false);
    }
  }, []);

  // ─── Initial Load: Try geolocation ─────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) {
      fetchWeather(DEFAULT_LOCATION);
      return;
    }

    let resolved = false;
    setLocating(true);

    // Give geolocation up to 8 seconds to respond (browser permission prompt + GPS)
    const fallbackTimer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        setLocating(false);
        fetchWeather(DEFAULT_LOCATION);
      }
    }, 8000);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(fallbackTimer);
        setLocating(false);
        try {
          const loc = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          setLocation(loc);
          fetchWeather(loc);
        } catch {
          // Geocode failed but we have coordinates — use them directly
          const loc = {
            name: 'Current Location',
            region: '',
            country: '',
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            countryCode: '',
          };
          setLocation(loc);
          fetchWeather(loc);
        }
      },
      () => {
        if (resolved) return;
        resolved = true;
        clearTimeout(fallbackTimer);
        setLocating(false);
        fetchWeather(DEFAULT_LOCATION);
      },
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 60000 }
    );

    return () => clearTimeout(fallbackTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Auto Refresh ─────────────────────────────────────────
  const locationRef = useRef(location);
  locationRef.current = location;

  useEffect(() => {
    if (!weather) return;
    const interval = setInterval(() => {
      fetchWeather(locationRef.current, true);
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [weather, fetchWeather]);

  // ─── Handle Search Select ─────────────────────────────────
  const handleSearchSelect = useCallback((city) => {
    setLocation(city);
    fetchWeather(city);
  }, [fetchWeather]);

  // ─── Real-time "Updated X min ago" ticker ─────────────────
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!lastUpdated) return;
    const timer = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(timer);
  }, [lastUpdated]);

  // ─── Handle Tamil Nadu Quick Select ────────────────────────
  const handleTamilNaduSelect = useCallback((city) => {
    const loc = {
      name: city.name,
      region: 'Tamil Nadu',
      country: 'India',
      latitude: city.lat,
      longitude: city.lon,
      countryCode: 'IN',
    };
    setLocation(loc);
    fetchWeather(loc);
  }, [fetchWeather]);

  // ─── Handle Locate ────────────────────────────────────────
  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Location unavailable. Search for your city instead.');
      return;
    }
    setIsRefreshing(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const loc = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          setLocation(loc);
          fetchWeather(loc);
        } catch {
          const loc = {
            name: 'Current Location',
            region: '',
            country: '',
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            countryCode: '',
          };
          setLocation(loc);
          fetchWeather(loc);
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setError('Location permission denied. Search for your city instead.');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError('Location unavailable. Search for your city instead.');
        } else {
          setError('Could not detect your location. Search for your city instead.');
        }
        setIsRefreshing(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [fetchWeather]);

  // ─── Handle Refresh ──────────────────────────────────────
  const handleRefresh = useCallback(() => {
    fetchWeather(location, true);
  }, [fetchWeather, location]);

  // ─── Toggle Unit ──────────────────────────────────────────
  const handleToggleUnit = useCallback(() => {
    setUnit((p) => (p === 'c' ? 'f' : 'c'));
  }, []);

  // ─── Compute Weather State & Theme ────────────────────────
  const weatherState = useMemo(() => {
    return weather ? getWeatherState(weather) : null;
  }, [weather]);

  const theme = useMemo(() => {
    return weatherState ? getTheme(weatherState) : null;
  }, [weatherState]);

  // ─── Apply Theme to CSS Variables ────────────────────────
  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    root.style.setProperty('--weather-primary', theme.primary);
    root.style.setProperty('--weather-secondary', theme.secondary);
    root.style.setProperty('--weather-accent', theme.accent);
    root.style.setProperty('--weather-surface', theme.surface);
    root.style.setProperty('--weather-surface-hover', theme.surfaceHover);
    root.style.setProperty('--weather-border', theme.border);
    root.style.setProperty('--weather-text', theme.text);
    root.style.setProperty('--weather-text-secondary', theme.textSecondary);
    root.style.setProperty('--weather-glow', theme.glow);
    root.style.setProperty('--weather-bg', theme.bg);
    document.body.style.background = theme.bg;
    document.body.style.color = theme.text;
  }, [theme]);

  const locationName = location ? `${location.name}${location.region ? ', ' + location.region : ''}` : '';

  return (
    <>
      {/* Weather Effects Layer */}
      {weatherState && <WeatherEffects state={weatherState} />}

      {/* Loading Screen */}
      <AnimatePresence>
        {loading && !weather && <LoadingScreen locating={locating} />}
      </AnimatePresence>

      {/* Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSelect={handleSearchSelect}
        onLocate={handleLocate}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        unit={unit}
        onToggleUnit={handleToggleUnit}
        lastUpdated={lastUpdated}
        locationName={locationName}
      />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <ErrorBanner
              message={error}
              onRetry={handleRefresh}
              hasData={!!weather}
            />
          )}
        </AnimatePresence>

        {weather && weatherState && (
          <>
            {/* Switching overlay */}
            <AnimatePresence>
              {switching && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed top-20 left-1/2 -translate-x-1/2 z-40 glass-strong rounded-full px-4 py-2 flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4 loading-spin" style={{ color: 'var(--weather-text)' }} />
                  <span className="text-sm" style={{ color: 'var(--weather-text)' }}>Loading...</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hero */}
            <WeatherHero
              location={location}
              weather={weather}
              state={weatherState}
              unit={unit}
            />

            {/* Tamil Nadu Quick Search */}
            <TamilNaduQuickSearch
              onSelect={handleTamilNaduSelect}
              currentLocation={location.name}
            />

            {/* Hourly Forecast */}
            <HourlyForecast weather={weather} unit={unit} />

            {/* Bento Dashboard */}
            <BentoDashboard weather={weather} state={weatherState} unit={unit} />

            {/* 7-Day Forecast */}
            <SevenDayForecast weather={weather} unit={unit} />

            {/* Weather Timeline */}
            <WeatherTimeline weather={weather} />

            {/* Recommendations */}
            <Recommendations weather={weather} state={weatherState} />

            {/* Weather Map */}
            <WeatherMap location={location} weather={weather} />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
