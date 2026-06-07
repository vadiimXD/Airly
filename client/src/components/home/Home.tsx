import { Wind, Droplets, Eye, Gauge, Sun, Search } from 'lucide-react';
import { useState } from 'react';
import { changeHandler, searchSubmitHandler } from '../../utils/formUtils';

const data = {
  city: 'San Francisco',
  country: 'US',
  date: 'Wednesday, May 13, 2026',
  temp: 68,
  feelsLike: 65,
  condition: 'Partly Cloudy',
  high: 72,
  low: 55,
  humidity: 74,
  windSpeed: 12,
  windDir: 'NW',
  visibility: 10,
  pressure: 1013,
  aqi: 42,
  aqiLabel: 'Good',
  pm25: 8.2,
  pm10: 14.5,
  o3: 31,
  no2: 12,
  hourly: [
    { time: '12 PM', temp: 66, icon: '⛅' },
    { time: '1 PM', temp: 67, icon: '⛅' },
    { time: '2 PM', temp: 68, icon: '🌤' },
    { time: '3 PM', temp: 70, icon: '🌤' },
    { time: '4 PM', temp: 71, icon: '☀️' },
    { time: '5 PM', temp: 70, icon: '🌤' },
    { time: '6 PM', temp: 68, icon: '⛅' },
    { time: '7 PM', temp: 64, icon: '🌙' },
  ],
  weekly: [
    { day: 'Thu', high: 70, low: 54, icon: '☀️' },
    { day: 'Fri', high: 65, low: 52, icon: '🌧' },
    { day: 'Sat', high: 60, low: 50, icon: '🌧' },
    { day: 'Sun', high: 63, low: 51, icon: '⛅' },
    { day: 'Mon', high: 68, low: 53, icon: '🌤' },
    { day: 'Tue', high: 73, low: 56, icon: '☀️' },
    { day: 'Wed', high: 75, low: 58, icon: '☀️' },
  ],
};

function aqiColor(aqi: number) {
  if (aqi <= 50) return '#22c55e';
  if (aqi <= 100) return '#eab308';
  if (aqi <= 150) return '#f97316';
  return '#ef4444';
}

export default function App() {
  const [search, setSearch] = useState({ search: "" })
  const [error, setError] = useState('');
  const [weather, setWeather] = useState("")
  // console.log(weather)
  console.log(weather.hourlyForecast)
  const color = aqiColor(weather?.current?.aqi);


  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'system-ui, sans-serif', color: '#1e293b' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px' }}>

        {/* Header */}
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: '#64748b' }}>{weather.date ?? '--'}</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: '4px 0 0' }}>{weather?.city}, {weather?.country ?? '--'}</h1>
          </div>
          <form onSubmit={(e) => searchSubmitHandler(e, search.search, setWeather, setError)} style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 8, paddingLeft: 12, height: 44, border: '1px solid #e2e8f0', flex: '0 0 280px' }}>
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search city..."
              name='search'
              value={search.search}
              onChange={(e) => changeHandler(e,setSearch)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                padding: '0 12px',
                fontSize: 14,
                fontFamily: 'inherit',
                color: '#1e293b',
                background: 'transparent'
              }}
            />
          </form>
        </div>

        {/* Main card */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 28, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ fontSize: 72, fontWeight: 200, lineHeight: 1 }}>{weather?.current?.temperature ?? '--'}°</div>
            <div style={{ fontSize: 16, color: '#64748b', marginTop: 4 }}>{weather?.current?.weather ?? '--'}</div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Feels like {weather?.current?.feelsLike ?? '--'}° &nbsp;·&nbsp; В:{weather?.current?.highTemp ?? '--'}° Н:{weather?.current?.lowTemp ?? '--'}°</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 32px' }}>
            <StatItem icon={<Droplets size={14} />} label="Влажност" value={weather?.current?.humidity ?? '--'} />
            <StatItem icon={<Wind size={14} />} label="Вятър" value={`${weather?.current?.windSpeed ?? '--'} км/ч  `} />
            <StatItem icon={<Eye size={14} />} label="Видимост" value={`${weather?.current?.visibility ?? '--'} км`} />
            <StatItem icon={<Gauge size={14} />} label="Налягане" value={`${weather?.current?.pressure ?? '--'} hPa`} />
          </div>
        </div>

        {/* Hourly */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, marginBottom: 16 }}>
          <SectionLabel>Часова прогноза</SectionLabel>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {weather?.hourlyForecast?.map(h => (
              <div key={h.time} style={{ flex: '0 0 auto', textAlign: 'center', padding: '10px 14px', borderRadius: 8, background: '#f8fafc', minWidth: 64 }}>
                <div style={{ fontSize: 12, color: '#64748b' }}>{h?.time ?? '--'}</div>
                <div style={{ fontSize: 20, margin: '6px 0' }}>{h?.weatherIcon ?? '--'}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{h?.temperature ?? '--'}°</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

          {/* Air Quality */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 24 }}>
            <SectionLabel>Качество на въздуха</SectionLabel>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 44, fontWeight: 700, color }}>{weather?.current?.aqi ?? '--'}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color }}>{weather?.current?.aiqiLabel ?? '--'}</span>
            </div>
            <div style={{ height: 6, background: '#e2e8f0', borderRadius: 4, marginBottom: 16 }}>
              <div style={{ height: '100%', width: `${Math.min(weather?.current?.aqi, 200) / 2}%`, background: color, borderRadius: 4 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <PollutantBox label="PM2.5" value={`${weather?.current?.pm25 ?? '--'} µg`} />
              <PollutantBox label="PM10" value={`${weather?.current?.pm10 ?? '--'} µg`} />
            </div>
          </div>

          {/* Humidity detail */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 24 }}>
            <SectionLabel>Влажност и комфорт</SectionLabel>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 44, fontWeight: 700, color: '#3b82f6' }}>{weather?.current?.humidity ?? '--'}%</span>
              <span style={{ fontSize: 13, color: '#64748b' }}>относителна влажност</span>
            </div>
            <div style={{ height: 6, background: '#e2e8f0', borderRadius: 4, marginBottom: 16 }}>
              <div style={{ height: '100%', width: `${weather?.current?.humidity ?? "--"}%`, background: '#3b82f6', borderRadius: 4 }} />
            </div>
            <div style={{ fontSize: 13, color: '#64748b' }}>
              <Row label="Dew Point" value={`${weather?.current?.dewPoint ?? '--'}°`} />
              <Row label="Comfort Level" value={weather?.current?.comfortLevel ?? '--'} />
              <Row label="UV Index" value={`${weather?.current?.uvIndex ?? '--'}`} />
            </div>
          </div>
        </div>

        {/* Weekly */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 24 }}>
          <SectionLabel>7-дневна прогноза</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {data.weekly.map((w, i) => (
              <div key={w.day} style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: i < data.weekly.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <span style={{ width: 40, fontSize: 14, fontWeight: 600 }}>{w.day}</span>
                <span style={{ fontSize: 18, marginRight: 12, width: 28 }}>{w.icon}</span>
                <div style={{ flex: 1, height: 4, background: '#e2e8f0', borderRadius: 4 }}>
                  <div style={{
                    marginLeft: `${(w.low - 45) * 3}%`,
                    width: `${(w.high - w.low) * 3}%`,
                    height: '100%',
                    background: 'linear-gradient(to right, #93c5fd, #f97316)',
                    borderRadius: 4
                  }} />
                </div>
                <span style={{ fontSize: 13, color: '#94a3b8', marginLeft: 12, width: 30, textAlign: 'right' }}>{w.low}°</span>
                <span style={{ fontSize: 13, fontWeight: 600, marginLeft: 8, width: 30, textAlign: 'right' }}>{w.high}°</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: 12, color: '#cbd5e1', marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <Sun size={30} />
          CREATED BY VADIIM &copy; 2026
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>
      {children}
    </div>
  );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#94a3b8', fontSize: 12, marginBottom: 2 }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function PollutantBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: '#f8fafc', borderRadius: 6, padding: '8px 10px' }}>
      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: last ? 'none' : '1px solid #f1f5f9' }}>
      <span>{label}</span>
      <span style={{ fontWeight: 600, color: '#1e293b' }}>{value}</span>
    </div>
  );
}
