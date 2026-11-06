import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Cloud, CloudRain, Sun, Wind, Navigation } from 'lucide-react';

// Fix default marker icon for Leaflet in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to fly to new location when it changes
function FlyToLocation({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 10, { duration: 1.5 });
  }, [center[0], center[1], map]);
  return null;
}

// ─── Fetch latest RainViewer radar timestamp ───────────────────
function useRadarTimestamp() {
  const [timestamp, setTimestamp] = useState(null);
  useEffect(() => {
    let cancelled = false;
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const past = data?.radar?.past || [];
        const now = data?.radar?.nowcast || [];
        const latest = [...past, ...now].filter((f) => f.time <= Date.now() / 1000 + 600);
        if (latest.length > 0) {
          const ts = latest[latest.length - 1];
          setTimestamp(ts.time);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);
  return timestamp;
}

// ─── Fetch a grid of weather data points from Open-Meteo ───────
function useWeatherGrid(center, activeLayer) {
  const [grid, setGrid] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeLayer || activeLayer === 'standard' || activeLayer === 'satellite' || activeLayer === 'rain') {
      setGrid([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const [lat, lon] = center;
    const step = 0.5;
    const range = 2;
    const lats = [];
    const lons = [];
    for (let i = -range; i <= range; i++) lats.push(+(lat + i * step).toFixed(2));
    for (let j = -range; j <= range; j++) lons.push(+(lon + j * step).toFixed(2));

    const points = [];
    for (const la of lats) {
      for (const lo of lons) {
        points.push({ lat: la, lon: lo });
      }
    }

    const param = activeLayer === 'clouds' ? 'cloud_cover'
      : activeLayer === 'temp' ? 'temperature_2m'
      : activeLayer === 'wind' ? 'wind_speed_10m'
      : '';

    if (!param) { setGrid([]); return; }

    const latStr = points.map((p) => p.lat).join(',');
    const lonStr = points.map((p) => p.lon).join(',');

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latStr}&longitude=${lonStr}&current=${param}&timezone=auto`
    )
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const arr = Array.isArray(data) ? data : [data];
        const result = [];
        for (let i = 0; i < points.length; i++) {
          const d = arr[i];
          if (!d || !d.current) continue;
          const val = d.current[param];
          if (val == null) continue;
          result.push({ lat: points[i].lat, lon: points[i].lon, value: val });
        }
        setGrid(result);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [center[0], center[1], activeLayer]);

  return { grid, loading };
}

// ─── Color scales for overlay data ─────────────────────────────
function tempColor(t) {
  if (t == null) return 'transparent';
  if (t < -10) return '#1e3a8a';
  if (t < 0) return '#3b82f6';
  if (t < 10) return '#06b6d4';
  if (t < 20) return '#22c55e';
  if (t < 30) return '#eab308';
  if (t < 35) return '#f97316';
  return '#ef4444';
}

function cloudColor(c) {
  if (c == null) return 'transparent';
  const opacity = Math.max(0.15, c / 100 * 0.7);
  return `rgba(200, 210, 220, ${opacity})`;
}

function windColor(w) {
  if (w == null) return 'transparent';
  if (w < 10) return '#22c55e';
  if (w < 20) return '#eab308';
  if (w < 30) return '#f97316';
  if (w < 50) return '#ef4444';
  return '#991b1b';
}

function getOverlayColor(layer, value) {
  if (layer === 'temp') return tempColor(value);
  if (layer === 'clouds') return cloudColor(value);
  if (layer === 'wind') return windColor(value);
  return 'transparent';
}

function getOverlayLabel(layer, value) {
  if (value == null) return '—';
  if (layer === 'temp') return `${Math.round(value)}°C`;
  if (layer === 'clouds') return `${Math.round(value)}%`;
  if (layer === 'wind') return `${Math.round(value)} km/h`;
  return '';
}

const LAYERS = [
  { id: 'standard', label: 'Standard', icon: MapPin },
  { id: 'satellite', label: 'Satellite', icon: Sun },
  { id: 'rain', label: 'Rain', icon: CloudRain },
  { id: 'clouds', label: 'Clouds', icon: Cloud },
  { id: 'temp', label: 'Temperature', icon: Sun },
  { id: 'wind', label: 'Wind', icon: Wind },
];

const BASE_TILES = {
  standard: { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '&copy; OpenStreetMap' },
  satellite: { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attribution: 'Esri' },
  rain: { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '&copy; OpenStreetMap + RainViewer' },
  clouds: { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '&copy; OpenStreetMap + Open-Meteo' },
  temp: { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '&copy; OpenStreetMap + Open-Meteo' },
  wind: { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '&copy; OpenStreetMap + Open-Meteo' },
};

export function WeatherMap({ location, weather }) {
  const [activeLayer, setActiveLayer] = useState('standard');
  const [mapError, setMapError] = useState(false);
  const radarTime = useRadarTimestamp();
  const { grid, loading: gridLoading } = useWeatherGrid(
    [location?.latitude || 0, location?.longitude || 0],
    activeLayer
  );

  if (!location) return null;
  const center = [location.latitude, location.longitude];

  const mapKey = `${location.latitude.toFixed(4)}-${location.longitude.toFixed(4)}-${activeLayer}`;

  const baseTile = BASE_TILES[activeLayer] || BASE_TILES.standard;
  const radarUrl = radarTime
    ? `https://tilecache.rainviewer.com/v2/radar/${radarTime}/{z}/{x}/{y}/2/1_1_0.png`
    : null;

  const showOverlay = activeLayer === 'clouds' || activeLayer === 'temp' || activeLayer === 'wind';

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className="px-4 mb-8"
    >
      <h2 className="text-sm uppercase tracking-widest font-semibold mb-3 ml-1" style={{ color: 'var(--weather-text-secondary)' }}>
        Weather Map
      </h2>
      <div className="glass rounded-2xl p-3 sm:p-4">
        {/* Layer buttons */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {LAYERS.map((layer) => {
            const Icon = layer.icon;
            const isRainLoading = layer.id === 'rain' && !radarTime;
            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  activeLayer === layer.id ? 'glass-strong' : 'glass glass-hover'
                } ${isRainLoading ? 'opacity-60' : ''}`}
                style={{
                  color: 'var(--weather-text)',
                  ...(activeLayer === layer.id ? { boxShadow: '0 0 0 2px var(--weather-accent)' } : {}),
                }}
                title={layer.label}
              >
                <Icon className="w-3.5 h-3.5" />
                {layer.label}
                {isRainLoading && (
                  <span className="inline-block w-2 h-2 rounded-full bg-current animate-pulse ml-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Map */}
        <div className="rounded-xl overflow-hidden relative" style={{ height: 'clamp(300px, 55vh, 450px)' }}>
          {!mapError ? (
            <MapContainer
              key={mapKey}
              center={center}
              zoom={10}
              minZoom={2}
              maxZoom={18}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
              worldCopyJump={true}
            >
              <FlyToLocation center={center} />

              {/* Base tiles */}
              {baseTile.url && (
                <TileLayer
                  url={baseTile.url}
                  attribution={baseTile.attribution}
                  eventHandlers={{ error: () => setMapError(true) }}
                />
              )}

              {/* Rain radar overlay */}
              {activeLayer === 'rain' && radarUrl && (
                <TileLayer
                  url={radarUrl}
                  attribution="RainViewer"
                  opacity={0.7}
                  eventHandlers={{ error: () => {} }}
                />
              )}



              {/* Data overlay circles for clouds/temp/wind */}
              {showOverlay && grid.map((pt, idx) => (
                <CircleMarker
                  key={`${pt.lat}-${pt.lon}-${idx}`}
                  center={[pt.lat, pt.lon]}
                  radius={18}
                  pathOptions={{
                    color: getOverlayColor(activeLayer, pt.value),
                    fillColor: getOverlayColor(activeLayer, pt.value),
                    fillOpacity: 0.6,
                    weight: 1,
                  }}
                >
                  <Popup>
                    <div style={{ textAlign: 'center' }}>
                      <strong>{getOverlayLabel(activeLayer, pt.value)}</strong>
                      <div style={{ fontSize: '11px', marginTop: '2px', opacity: 0.7 }}>
                        {pt.lat.toFixed(2)}, {pt.lon.toFixed(2)}
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

              <Marker position={center}>
                <Popup>
                  <div>
                    <strong>{location.name}</strong>
                    {location.region && <div>{location.region}</div>}
                    {location.country && <div>{location.country}</div>}
                    <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.7 }}>
                      {location.latitude.toFixed(2)}, {location.longitude.toFixed(2)}
                    </div>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full" style={{ color: 'var(--weather-text-secondary)' }}>
              <MapPin className="w-8 h-8 mb-2" />
              <p className="text-sm">Map could not be loaded.</p>
            </div>
          )}

          {/* Loading indicator for data overlay */}
          {showOverlay && gridLoading && (
            <div className="absolute top-2 right-2 glass-strong rounded-full px-3 py-1.5 flex items-center gap-2 z-[1000]">
              <div className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" style={{ color: 'var(--weather-text)' }} />
              <span className="text-xs" style={{ color: 'var(--weather-text)' }}>Loading data...</span>
            </div>
          )}
        </div>

        {/* Legend for overlay layers */}
        {showOverlay && grid.length > 0 && (
          <div className="mt-2 flex items-center gap-3 flex-wrap text-xs" style={{ color: 'var(--weather-text-secondary)' }}>
            <span className="font-medium" style={{ color: 'var(--weather-text)' }}>
              {activeLayer === 'clouds' ? 'Cloud Cover' : activeLayer === 'temp' ? 'Temperature' : 'Wind Speed'}:
            </span>
            {activeLayer === 'temp' && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ background: '#3b82f6' }} />
                <span>&lt;0°</span>
                <span className="w-3 h-3 rounded-full" style={{ background: '#06b6d4' }} />
                <span>0-10°</span>
                <span className="w-3 h-3 rounded-full" style={{ background: '#22c55e' }} />
                <span>10-20°</span>
                <span className="w-3 h-3 rounded-full" style={{ background: '#eab308' }} />
                <span>20-30°</span>
                <span className="w-3 h-3 rounded-full" style={{ background: '#f97316' }} />
                <span>30-35°</span>
                <span className="w-3 h-3 rounded-full" style={{ background: '#ef4444' }} />
                <span>35°+</span>
              </div>
            )}
            {activeLayer === 'clouds' && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ background: 'rgba(200,210,220,0.15)' }} />
                <span>0%</span>
                <span className="w-3 h-3 rounded-full" style={{ background: 'rgba(200,210,220,0.4)' }} />
                <span>50%</span>
                <span className="w-3 h-3 rounded-full" style={{ background: 'rgba(200,210,220,0.7)' }} />
                <span>100%</span>
              </div>
            )}
            {activeLayer === 'wind' && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ background: '#22c55e' }} />
                <span>&lt;10</span>
                <span className="w-3 h-3 rounded-full" style={{ background: '#eab308' }} />
                <span>10-20</span>
                <span className="w-3 h-3 rounded-full" style={{ background: '#f97316' }} />
                <span>20-30</span>
                <span className="w-3 h-3 rounded-full" style={{ background: '#ef4444' }} />
                <span>30-50</span>
                <span className="w-3 h-3 rounded-full" style={{ background: '#991b1b' }} />
                <span>50+</span>
              </div>
            )}
          </div>
        )}

        {/* Rain layer info */}
        {activeLayer === 'rain' && (
          <div className="mt-2 text-xs" style={{ color: 'var(--weather-text-secondary)' }}>
            {radarTime
              ? 'Live precipitation radar (RainViewer). Tap circles for details.'
              : 'Loading live precipitation radar...'}
          </div>
        )}

        {/* Location info bar */}
        <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--weather-text-secondary)' }}>
            <Navigation className="w-3.5 h-3.5" style={{ color: 'var(--weather-accent)' }} />
            <span style={{ color: 'var(--weather-text)' }} className="font-medium">{location.name}</span>
            {[location.region, location.country].filter(Boolean).length > 0 && (
              <span>
                {[location.region, location.country].filter(Boolean).join(', ')}
              </span>
            )}
          </div>
          <span className="text-xs" style={{ color: 'var(--weather-text-secondary)' }}>
            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </span>
        </div>
      </div>
    </motion.section>
  );
}
