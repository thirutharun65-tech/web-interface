import {
  Cloud, CloudRain, CloudDrizzle, CloudLightning, CloudSnow, CloudFog,
  Sun, Moon, Sunset, Sunrise, CloudSun, CloudMoon,
} from 'lucide-react';

const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const REVERSE_GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
const REVERSE_GEOCODE_FALLBACK = 'https://nominatim.openstreetmap.org/reverse';

// ─── City Search ──────────────────────────────────────────────
export async function searchCities(query) {
  if (!query || query.trim().length < 2) return [];
  try {
    const res = await fetch(
      `${GEOCODE_URL}?name=${encodeURIComponent(query)}&count=8&language=en&format=json`
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results) return [];
    return data.results.map((r) => ({
      id: r.id,
      name: r.name,
      region: r.admin1 || '',
      country: r.country || '',
      latitude: r.latitude,
      longitude: r.longitude,
      countryCode: r.country_code || '',
      timezone: r.timezone || '',
    }));
  } catch {
    return [];
  }
}

// ─── Reverse Geocode ─────────────────────────────────────────
export async function reverseGeocode(lat, lon) {
  // Open-Meteo doesn't have a true reverse endpoint, so we use Nominatim
  try {
    const res = await fetch(
      `${REVERSE_GEOCODE_FALLBACK}?lat=${lat}&lon=${lon}&format=json&zoom=10&accept-language=en`,
      { headers: { 'Accept': 'application/json' } }
    );
    if (!res.ok) throw new Error('reverse geocode failed');
    const data = await res.json();
    const addr = data.address || {};
    const name = addr.city || addr.town || addr.village || addr.county || addr.state || 'Unknown';
    const region = addr.state || '';
    const country = addr.country || '';
    return {
      name,
      region,
      country,
      latitude: lat,
      longitude: lon,
      countryCode: addr.country_code || '',
    };
  } catch {
    // Fallback: just return coordinates as the name
    return {
      name: 'Current Location',
      region: '',
      country: '',
      latitude: lat,
      longitude: lon,
      countryCode: '',
    };
  }
}

// ─── Get Weather by Coordinates ───────────────────────────────
export async function getWeatherByCoordinates(lat, lon, timezone = 'auto') {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    timezone: timezone,
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'rain',
      'snowfall',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
    ].join(','),
    hourly: [
      'temperature_2m',
      'weather_code',
      'precipitation_probability',
      'precipitation',
      'wind_speed_10m',
      'relative_humidity_2m',
      'uv_index',
      'visibility',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'precipitation_probability_max',
      'uv_index_max',
      'wind_speed_10m_max',
      'precipitation_sum',
    ].join(','),
    forecast_days: '7',
    wind_speed_unit: 'kmh',
    temperature_unit: 'celsius',
    precipitation_unit: 'mm',
  });

  const res = await fetch(`${WEATHER_URL}?${params.toString()}`);
  if (!res.ok) throw new Error('Weather API request failed');
  const data = await res.json();

  // Open-Meteo doesn't provide AQI in the forecast endpoint; try air-quality
  let aqi = null;
  try {
    const aqiRes = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,us_aqi&timezone=${timezone}`
    );
    if (aqiRes.ok) {
      const aqiData = await aqiRes.json();
      if (aqiData.current) {
        aqi = aqiData.current.us_aqi ?? aqiData.current.european_aqi ?? null;
      }
    }
  } catch {
    // AQI is optional
  }

  return transformWeatherData(data, aqi);
}

// ─── Get Weather by City Name ──────────────────────────────────
export async function getWeather(city) {
  return getWeatherByCoordinates(city.latitude, city.longitude, city.timezone || 'auto');
}

// ─── Transform API Response ───────────────────────────────────
function transformWeatherData(data, aqi) {
  const c = data.current || {};
  const h = data.hourly || {};
  const d = data.daily || {};

  // Current hour index for hourly data
  const now = new Date();
  const currentHourIdx = h.time ? h.time.findIndex((t) => {
    const ht = new Date(t);
    return ht.getFullYear() === now.getFullYear() &&
      ht.getMonth() === now.getMonth() &&
      ht.getDate() === now.getDate() &&
      ht.getHours() === now.getHours();
  }) : -1;

  const startIdx = currentHourIdx >= 0 ? currentHourIdx : 0;

  // Build hourly forecast (next 24 hours)
  const hourly = [];
  if (h.time) {
    for (let i = startIdx; i < Math.min(startIdx + 24, h.time.length); i++) {
      hourly.push({
        time: h.time[i],
        temp: h.temperature_2m?.[i],
        weatherCode: h.weather_code?.[i],
        precipProb: h.precipitation_probability?.[i] ?? 0,
        windSpeed: h.wind_speed_10m?.[i],
        humidity: h.relative_humidity_2m?.[i],
        uvIndex: h.uv_index?.[i],
        visibility: h.visibility?.[i],
        isDay: h.is_day?.[i] ?? 1,
      });
    }
  }

  // Build daily forecast (7 days)
  const daily = [];
  if (d.time) {
    for (let i = 0; i < d.time.length; i++) {
      daily.push({
        date: d.time[i],
        weatherCode: d.weather_code?.[i],
        tempMax: d.temperature_2m_max?.[i],
        tempMin: d.temperature_2m_min?.[i],
        precipProb: d.precipitation_probability_max?.[i] ?? 0,
        sunrise: d.sunrise?.[i],
        sunset: d.sunset?.[i],
        uvIndexMax: d.uv_index_max?.[i],
        windSpeedMax: d.wind_speed_10m_max?.[i],
        precipSum: d.precipitation_sum?.[i] ?? 0,
      });
    }
  }

  return {
    current: {
      temperature: c.temperature_2m,
      apparentTemperature: c.apparent_temperature,
      humidity: c.relative_humidity_2m,
      isDay: c.is_day,
      precipitation: c.precipitation,
      rain: c.rain,
      snowfall: c.snowfall,
      weatherCode: c.weather_code,
      cloudCover: c.cloud_cover,
      pressure: c.pressure_msl ?? c.surface_pressure,
      windSpeed: c.wind_speed_10m,
      windDirection: c.wind_direction_10m,
      windGusts: c.wind_gusts_10m,
    },
    hourly,
    daily,
    aqi,
    timezone: data.timezone || 'auto',
    utcOffsetSeconds: data.utc_offset_seconds || 0,
  };
}

// ─── Weather Code Mapping (WMO codes) ──────────────────────────
export const WEATHER_CODES = {
  0: { label: 'Clear Sky', icon: Sun, type: 'clear' },
  1: { label: 'Mainly Clear', icon: Sun, type: 'clear' },
  2: { label: 'Partly Cloudy', icon: CloudSun, type: 'partly-cloudy' },
  3: { label: 'Overcast', icon: Cloud, type: 'cloudy' },
  45: { label: 'Fog', icon: CloudFog, type: 'fog' },
  48: { label: 'Rime Fog', icon: CloudFog, type: 'fog' },
  51: { label: 'Light Drizzle', icon: CloudDrizzle, type: 'rain' },
  53: { label: 'Moderate Drizzle', icon: CloudDrizzle, type: 'rain' },
  55: { label: 'Dense Drizzle', icon: CloudDrizzle, type: 'rain' },
  56: { label: 'Freezing Drizzle', icon: CloudDrizzle, type: 'rain' },
  57: { label: 'Freezing Drizzle', icon: CloudDrizzle, type: 'rain' },
  61: { label: 'Slight Rain', icon: CloudRain, type: 'rain' },
  63: { label: 'Moderate Rain', icon: CloudRain, type: 'rain' },
  65: { label: 'Heavy Rain', icon: CloudRain, type: 'heavy-rain' },
  66: { label: 'Freezing Rain', icon: CloudRain, type: 'rain' },
  67: { label: 'Freezing Rain', icon: CloudRain, type: 'rain' },
  71: { label: 'Slight Snow', icon: CloudSnow, type: 'snow' },
  73: { label: 'Moderate Snow', icon: CloudSnow, type: 'snow' },
  75: { label: 'Heavy Snow', icon: CloudSnow, type: 'snow' },
  77: { label: 'Snow Grains', icon: CloudSnow, type: 'snow' },
  80: { label: 'Slight Rain Showers', icon: CloudRain, type: 'rain' },
  81: { label: 'Rain Showers', icon: CloudRain, type: 'rain' },
  82: { label: 'Violent Rain Showers', icon: CloudRain, type: 'heavy-rain' },
  85: { label: 'Snow Showers', icon: CloudSnow, type: 'snow' },
  86: { label: 'Heavy Snow Showers', icon: CloudSnow, type: 'snow' },
  95: { label: 'Thunderstorm', icon: CloudLightning, type: 'thunderstorm' },
  96: { label: 'Thunderstorm w/ Hail', icon: CloudLightning, type: 'thunderstorm' },
  99: { label: 'Severe Thunderstorm', icon: CloudLightning, type: 'thunderstorm' },
};

export function getWeatherCodeInfo(code) {
  return WEATHER_CODES[code] || { label: 'Unknown', icon: Cloud, type: 'cloudy' };
}

// ─── Weather State Engine ─────────────────────────────────────
export function getWeatherState(weather) {
  if (!weather || !weather.current) {
    return { type: 'clear', intensity: 'light', time: 'day', climate: 'mild' };
  }

  const { current, daily } = weather;
  const codeInfo = getWeatherCodeInfo(current.weatherCode);
  const now = new Date();
  const today = daily?.[0];
  const sunrise = today?.sunrise ? new Date(today.sunrise) : null;
  const sunset = today?.sunset ? new Date(today.sunset) : null;

  // Determine time of day
  let timeOfDay = 'day';
  if (sunrise && sunset) {
    if (now < sunrise) timeOfDay = 'night';
    else if (now >= sunset) timeOfDay = 'night';
    else {
      const sunriseProgress = (now - sunrise) / (sunset - sunrise);
      if (sunriseProgress < 0.15) timeOfDay = 'sunrise';
      else if (sunriseProgress > 0.85) timeOfDay = 'sunset';
      else timeOfDay = 'day';
    }
  } else {
    timeOfDay = current.isDay ? 'day' : 'night';
  }

  // Determine intensity
  let intensity = 'light';
  const precip = current.precipitation || 0;
  if (codeInfo.type === 'heavy-rain' || precip > 5) intensity = 'heavy';
  else if (codeInfo.type === 'thunderstorm') intensity = 'heavy';
  else if (codeInfo.type === 'rain' && precip > 1) intensity = 'moderate';
  else if (codeInfo.type === 'snow' && precip > 1) intensity = 'moderate';

  // Determine climate from temperature
  let climate = 'mild';
  const temp = current.temperature;
  if (temp >= 35) climate = 'hot';
  else if (temp >= 25) climate = 'warm';
  else if (temp >= 10) climate = 'mild';
  else if (temp >= 0) climate = 'cool';
  else climate = 'cold';

  return {
    type: codeInfo.type,
    intensity,
    time: timeOfDay,
    climate,
    code: current.weatherCode,
  };
}

// ─── Theme System ─────────────────────────────────────────────
export function getTheme(state) {
  const { type, time, climate } = state;

  // Night themes override weather-specific day themes
  if (time === 'night') {
    if (type === 'clear' || type === 'partly-cloudy') {
      return {
        name: 'night',
        bg: 'linear-gradient(180deg, #0a0e27 0%, #131736 40%, #1a1a3e 100%)',
        primary: '#8b9dc3',
        secondary: '#4a5a8a',
        accent: '#a78bfa',
        surface: 'rgba(20, 24, 50, 0.45)',
        surfaceHover: 'rgba(30, 34, 65, 0.6)',
        border: 'rgba(139, 157, 195, 0.15)',
        text: '#e2e8f0',
        textSecondary: 'rgba(226, 232, 240, 0.7)',
        glow: 'rgba(167, 139, 250, 0.15)',
      };
    }
    if (type === 'rain' || type === 'heavy-rain') {
      return {
        name: 'night-rain',
        bg: 'linear-gradient(180deg, #0a0f1a 0%, #0d1a2e 40%, #102033 100%)',
        primary: '#5b9bd5',
        secondary: '#3a5a7a',
        accent: '#4fc3f7',
        surface: 'rgba(15, 25, 45, 0.5)',
        surfaceHover: 'rgba(20, 35, 60, 0.65)',
        border: 'rgba(91, 155, 213, 0.15)',
        text: '#e0eaf5',
        textSecondary: 'rgba(224, 234, 245, 0.7)',
        glow: 'rgba(79, 195, 247, 0.12)',
      };
    }
    if (type === 'thunderstorm') {
      return {
        name: 'night-storm',
        bg: 'linear-gradient(180deg, #0a0a14 0%, #131326 40%, #1a1a2e 100%)',
        primary: '#7c6fd6',
        secondary: '#4a3a7a',
        accent: '#a78bfa',
        surface: 'rgba(20, 18, 40, 0.55)',
        surfaceHover: 'rgba(30, 26, 55, 0.7)',
        border: 'rgba(124, 111, 214, 0.2)',
        text: '#e0d8f0',
        textSecondary: 'rgba(224, 216, 240, 0.7)',
        glow: 'rgba(167, 139, 250, 0.2)',
      };
    }
    if (type === 'snow') {
      return {
        name: 'night-snow',
        bg: 'linear-gradient(180deg, #1a1f3a 0%, #202848 40%, #28305a 100%)',
        primary: '#b0c8e8',
        secondary: '#6878a8',
        accent: '#cfe0ff',
        surface: 'rgba(30, 36, 60, 0.45)',
        surfaceHover: 'rgba(40, 50, 75, 0.6)',
        border: 'rgba(176, 200, 232, 0.15)',
        text: '#e8eef8',
        textSecondary: 'rgba(232, 238, 248, 0.7)',
        glow: 'rgba(207, 224, 255, 0.12)',
      };
    }
    // Cloudy/fog night
    return {
      name: 'night-cloudy',
      bg: 'linear-gradient(180deg, #131726 0%, #1a1f30 40%, #20253a 100%)',
      primary: '#8a9ab8',
      secondary: '#4a5a78',
      accent: '#9bb0d0',
      surface: 'rgba(25, 30, 45, 0.45)',
      surfaceHover: 'rgba(35, 42, 60, 0.6)',
      border: 'rgba(138, 154, 184, 0.15)',
      text: '#dde4f0',
      textSecondary: 'rgba(221, 228, 240, 0.7)',
      glow: 'rgba(155, 176, 208, 0.1)',
    };
  }

  // Sunrise / Sunset themes
  if (time === 'sunrise') {
    return {
      name: 'sunrise',
      bg: 'linear-gradient(180deg, #ff9a56 0%, #ff7e88 30%, #c490e4 70%, #5b6ec8 100%)',
      primary: '#fff5e0',
      secondary: '#ffb07a',
      accent: '#ff7e88',
      surface: 'rgba(255, 240, 220, 0.2)',
      surfaceHover: 'rgba(255, 240, 220, 0.3)',
      border: 'rgba(255, 220, 180, 0.25)',
      text: '#fffaf0',
      textSecondary: 'rgba(255, 250, 240, 0.85)',
      glow: 'rgba(255, 126, 136, 0.25)',
    };
  }
  if (time === 'sunset') {
    return {
      name: 'sunset',
      bg: 'linear-gradient(180deg, #ff6b6b 0%, #ee5a6f 25%, #c44569 50%, #6c5ce7 80%, #2d3561 100%)',
      primary: '#ffe8d0',
      secondary: '#ff8a7a',
      accent: '#ee5a6f',
      surface: 'rgba(255, 220, 200, 0.18)',
      surfaceHover: 'rgba(255, 220, 200, 0.28)',
      border: 'rgba(255, 200, 180, 0.22)',
      text: '#fff5ee',
      textSecondary: 'rgba(255, 245, 238, 0.85)',
      glow: 'rgba(238, 90, 111, 0.25)',
    };
  }

  // Day themes
  if (type === 'clear') {
    if (climate === 'hot') {
      return {
        name: 'hot',
        bg: 'linear-gradient(180deg, #ff8c42 0%, #ffb347 30%, #ffd060 60%, #ffe5a0 100%)',
        primary: '#fff8e0',
        secondary: '#ff9a3c',
        accent: '#ff6b1a',
        surface: 'rgba(255, 240, 210, 0.25)',
        surfaceHover: 'rgba(255, 240, 210, 0.38)',
        border: 'rgba(255, 200, 100, 0.3)',
        text: '#3d2000',
        textSecondary: 'rgba(61, 32, 0, 0.75)',
        glow: 'rgba(255, 107, 26, 0.2)',
      };
    }
    return {
      name: 'sunny',
      bg: 'linear-gradient(180deg, #2196f3 0%, #42a5f5 30%, #64b5f6 60%, #bbdefb 100%)',
      primary: '#fff',
      secondary: '#42a5f5',
      accent: '#ffd54f',
      surface: 'rgba(255, 255, 255, 0.22)',
      surfaceHover: 'rgba(255, 255, 255, 0.35)',
      border: 'rgba(255, 255, 255, 0.25)',
      text: '#0d1b2a',
      textSecondary: 'rgba(13, 27, 42, 0.75)',
      glow: 'rgba(255, 213, 79, 0.2)',
    };
  }

  if (type === 'partly-cloudy') {
    return {
      name: 'partly-cloudy',
      bg: 'linear-gradient(180deg, #4ba3e3 0%, #6fc1f0 30%, #a8d8f0 60%, #dceaf5 100%)',
      primary: '#fff',
      secondary: '#4ba3e3',
      accent: '#ffd54f',
      surface: 'rgba(255, 255, 255, 0.25)',
      surfaceHover: 'rgba(255, 255, 255, 0.38)',
      border: 'rgba(255, 255, 255, 0.28)',
      text: '#1a2a3a',
      textSecondary: 'rgba(26, 42, 58, 0.75)',
      glow: 'rgba(255, 213, 79, 0.15)',
    };
  }

  if (type === 'cloudy') {
    return {
      name: 'cloudy',
      bg: 'linear-gradient(180deg, #607d8b 0%, #78909c 30%, #90a4ae 60%, #cfd8dc 100%)',
      primary: '#fff',
      secondary: '#607d8b',
      accent: '#b0bec5',
      surface: 'rgba(255, 255, 255, 0.2)',
      surfaceHover: 'rgba(255, 255, 255, 0.32)',
      border: 'rgba(255, 255, 255, 0.22)',
      text: '#263238',
      textSecondary: 'rgba(38, 50, 56, 0.75)',
      glow: 'rgba(176, 190, 197, 0.15)',
    };
  }

  if (type === 'rain') {
    return {
      name: 'rain',
      bg: 'linear-gradient(180deg, #37474f 0%, #455a64 30%, #546e7a 60%, #78969c 100%)',
      primary: '#e0f7fa',
      secondary: '#4fc3f7',
      accent: '#29b6f6',
      surface: 'rgba(176, 225, 240, 0.18)',
      surfaceHover: 'rgba(176, 225, 240, 0.28)',
      border: 'rgba(176, 225, 240, 0.2)',
      text: '#e8f5f8',
      textSecondary: 'rgba(232, 245, 248, 0.78)',
      glow: 'rgba(41, 182, 246, 0.15)',
    };
  }

  if (type === 'heavy-rain') {
    return {
      name: 'heavy-rain',
      bg: 'linear-gradient(180deg, #1a237e 0%, #1a2a5e 30%, #283556 60%, #3a4a6e 100%)',
      primary: '#b3e5fc',
      secondary: '#4fc3f7',
      accent: '#29b6f6',
      surface: 'rgba(100, 150, 200, 0.2)',
      surfaceHover: 'rgba(100, 150, 200, 0.3)',
      border: 'rgba(100, 150, 200, 0.22)',
      text: '#e0eef8',
      textSecondary: 'rgba(224, 238, 248, 0.78)',
      glow: 'rgba(41, 182, 246, 0.18)',
    };
  }

  if (type === 'thunderstorm') {
    return {
      name: 'thunderstorm',
      bg: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 30%, #1a2a4e 60%, #2a3a5e 100%)',
      primary: '#e0d8f0',
      secondary: '#7c6fd6',
      accent: '#a78bfa',
      surface: 'rgba(60, 50, 100, 0.25)',
      surfaceHover: 'rgba(60, 50, 100, 0.38)',
      border: 'rgba(124, 111, 214, 0.25)',
      text: '#e8e0f8',
      textSecondary: 'rgba(232, 224, 248, 0.78)',
      glow: 'rgba(167, 139, 250, 0.2)',
    };
  }

  if (type === 'snow') {
    return {
      name: 'snow',
      bg: 'linear-gradient(180deg, #b3c8e0 0%, #c8d8e8 30%, #d8e8f0 60%, #eef4f8 100%)',
      primary: '#fff',
      secondary: '#90a4ae',
      accent: '#4fc3f7',
      surface: 'rgba(255, 255, 255, 0.35)',
      surfaceHover: 'rgba(255, 255, 255, 0.5)',
      border: 'rgba(255, 255, 255, 0.4)',
      text: '#2a3a4a',
      textSecondary: 'rgba(42, 58, 74, 0.75)',
      glow: 'rgba(79, 195, 247, 0.12)',
    };
  }

  if (type === 'fog') {
    return {
      name: 'fog',
      bg: 'linear-gradient(180deg, #78909c 0%, #90a4ae 30%, #b0bec5 60%, #cfd8dc 100%)',
      primary: '#fff',
      secondary: '#90a4ae',
      accent: '#b0bec5',
      surface: 'rgba(255, 255, 255, 0.2)',
      surfaceHover: 'rgba(255, 255, 255, 0.32)',
      border: 'rgba(255, 255, 255, 0.22)',
      text: '#37474f',
      textSecondary: 'rgba(55, 71, 79, 0.78)',
      glow: 'rgba(176, 190, 197, 0.12)',
    };
  }

  // Default
  return {
    name: 'default',
    bg: 'linear-gradient(180deg, #2196f3 0%, #42a5f5 30%, #64b5f6 60%, #bbdefb 100%)',
    primary: '#fff',
    secondary: '#42a5f5',
    accent: '#ffd54f',
    surface: 'rgba(255, 255, 255, 0.22)',
    surfaceHover: 'rgba(255, 255, 255, 0.35)',
    border: 'rgba(255, 255, 255, 0.25)',
    text: '#0d1b2a',
    textSecondary: 'rgba(13, 27, 42, 0.75)',
    glow: 'rgba(255, 213, 79, 0.2)',
  };
}

// ─── Recommendations Engine ───────────────────────────────────
export function getRecommendations(weather, state) {
  if (!weather || !weather.current) return [];

  const recs = [];
  const { current, hourly, daily } = weather;
  const temp = current.temperature;
  const precipProb = daily?.[0]?.precipProb ?? 0;
  const windSpeed = current.windSpeed;
  const uvIndex = daily?.[0]?.uvIndexMax ?? 0;
  const codeInfo = getWeatherCodeInfo(current.weatherCode);

  // Umbrella
  if (precipProb >= 50 || codeInfo.type === 'rain' || codeInfo.type === 'heavy-rain') {
    recs.push({
      icon: 'umbrella',
      title: precipProb >= 80 ? 'Take an umbrella' : 'Consider an umbrella',
      desc: precipProb >= 80
        ? `Rain is very likely today (${precipProb}% chance). Keep an umbrella handy.`
        : `There's a ${precipProb}% chance of rain today. An umbrella might be useful.`,
      priority: precipProb >= 80 ? 'high' : 'medium',
    });
  }

  // Running / Best outdoor time
  const bestWindow = findBestOutdoorWindow(hourly);
  if (bestWindow) {
    recs.push({
      icon: 'running',
      title: 'Best time for outdoor activities',
      desc: `${bestWindow.start} – ${bestWindow.end} offers the most comfortable conditions.`,
      priority: 'medium',
    });
  }

  // Clothing
  if (temp >= 35) {
    recs.push({
      icon: 'shirt',
      title: 'Dress for extreme heat',
      desc: 'Wear light, breathable cotton clothing. Avoid dark colors and heavy fabrics.',
      priority: 'high',
    });
  } else if (temp >= 25) {
    recs.push({
      icon: 'shirt',
      title: 'Light clothing recommended',
      desc: 'Comfortable cotton clothes are ideal. Carry sunglasses for sun protection.',
      priority: 'low',
    });
  } else if (temp >= 10) {
    recs.push({
      icon: 'shirt',
      title: 'Moderate clothing',
      desc: 'A light jacket or sweater would be comfortable for this temperature.',
      priority: 'low',
    });
  } else if (temp >= 0) {
    recs.push({
      icon: 'shirt',
      title: 'Dress warmly',
      desc: 'Wear warm layers and a proper jacket. A scarf and gloves would help.',
      priority: 'medium',
    });
  } else {
    recs.push({
      icon: 'shirt',
      title: 'Extreme cold gear',
      desc: 'Heavy winter clothing is essential. Layer up and protect exposed skin.',
      priority: 'high',
    });
  }

  // Hydration
  if (temp >= 30) {
    recs.push({
      icon: 'droplet',
      title: 'Stay hydrated',
      desc: "It's hot today. Drink plenty of water and avoid prolonged sun exposure.",
      priority: 'high',
    });
  }

  // UV Protection
  if (uvIndex >= 6) {
    recs.push({
      icon: 'sun',
      title: 'UV protection advised',
      desc: `UV levels are high (index ${Math.round(uvIndex)}). Use sunscreen and wear a hat during midday.`,
      priority: 'high',
    });
  } else if (uvIndex >= 3) {
    recs.push({
      icon: 'sun',
      title: 'Moderate UV',
      desc: `UV index is ${Math.round(uvIndex)}. Sunscreen is recommended for extended outdoor time.`,
      priority: 'low',
    });
  }

  // Strong wind
  if (windSpeed >= 30) {
    recs.push({
      icon: 'wind',
      title: 'Strong winds expected',
      desc: `Wind speeds of ${Math.round(windSpeed)} km/h may make outdoor activities uncomfortable.`,
      priority: 'medium',
    });
  }

  // Thunderstorm warning
  if (codeInfo.type === 'thunderstorm') {
    recs.push({
      icon: 'zap',
      title: 'Thunderstorm alert',
      desc: 'Avoid open areas and tall objects. Stay indoors during the storm.',
      priority: 'high',
    });
  }

  // Fog warning
  if (codeInfo.type === 'fog') {
    recs.push({
      icon: 'eye-off',
      title: 'Low visibility',
      desc: 'Foggy conditions may affect driving. Drive carefully and use low-beam headlights.',
      priority: 'medium',
    });
  }

  // Snow
  if (codeInfo.type === 'snow') {
    recs.push({
      icon: 'snowflake',
      title: 'Snow expected',
      desc: 'Wear waterproof boots and be cautious of slippery surfaces.',
      priority: 'medium',
    });
  }

  return recs;
}

function findBestOutdoorWindow(hourly) {
  if (!hourly || hourly.length === 0) return null;
  let best = null;
  let bestScore = -1;
  for (let i = 0; i < hourly.length - 2; i++) {
    const h = hourly[i];
    if (!h.isDay) continue;
    const temp = h.temp;
    const precip = h.precipProb;
    const wind = h.windSpeed;
    if (temp < 5 || temp > 35) continue;
    if (precip > 40) continue;
    if (wind > 25) continue;
    const score = 100 - Math.abs(22 - temp) * 2 - precip * 0.5 - wind * 0.5;
    if (score > bestScore) {
      bestScore = score;
      const start = new Date(h.time);
      const end = new Date(start.getTime() + 2 * 3600 * 1000);
      best = {
        start: start.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        end: end.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
      };
    }
  }
  return best;
}

// ─── AQI Category ─────────────────────────────────────────────
export function getAQICategory(aqi) {
  if (aqi == null) return { label: 'Unavailable', color: '#9e9e9e' };
  if (aqi <= 50) return { label: 'Good', color: '#4caf50' };
  if (aqi <= 100) return { label: 'Moderate', color: '#ffeb3b' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: '#ff9800' };
  if (aqi <= 200) return { label: 'Unhealthy', color: '#f44336' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: '#9c27b0' };
  return { label: 'Hazardous', color: '#6d1b1b' };
}

// ─── UV Index Category ────────────────────────────────────────
export function getUVCategory(uv) {
  if (uv == null) return { label: 'N/A', color: '#9e9e9e' };
  if (uv < 3) return { label: 'Low', color: '#4caf50' };
  if (uv < 6) return { label: 'Moderate', color: '#ffeb3b' };
  if (uv < 8) return { label: 'High', color: '#ff9800' };
  if (uv < 11) return { label: 'Very High', color: '#f44336' };
  return { label: 'Extreme', color: '#9c27b0' };
}

// ─── Wind Direction Label ─────────────────────────────────────
export function windDirectionLabel(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

// ─── Temperature Conversion ───────────────────────────────────
export function convertTemp(celsius, unit) {
  if (celsius == null) return null;
  return unit === 'f' ? (celsius * 9) / 5 + 32 : celsius;
}

export function formatTemp(celsius, unit) {
  const val = convertTemp(celsius, unit);
  if (val == null) return '—';
  return `${Math.round(val)}°`;
}

export function tempUnitLabel(unit) {
  return unit === 'f' ? '°F' : '°C';
}
