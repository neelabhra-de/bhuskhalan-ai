export const navItems = [
  { path: '/', label: 'Command Center', icon: '▦', badge: '01' },
  { path: '/risk-map', label: 'Risk Map (GIS)', icon: '◉', badge: 'LIVE' },
  { path: '/slope-monitor', label: 'Slope Monitor', icon: '⌁', badge: '412' },
  { path: '/digital-twin', label: 'Slope Digital Twin', icon: '⬡', badge: 'SIM' },
  { path: '/alerts', label: 'Alerts Center', icon: '△', badge: '6 CRIT', tone: 'critical' },
  { path: '/field-reports', label: 'Field Reports', icon: '▣', badge: '19' },
  { path: '/simulation', label: 'What-If Simulation', icon: '◌', badge: 'AI' },
];

export const slopes = [
  { id: 'LM04', name: 'Lumding Cut Ridge', location: 'Assam - Dima Hasao, NH-27 Corridor', score: 91, risk: 'CRITICAL', trend: '+22%', rain: '198.0 mm', moisture: '94.0%', displacement: '11.4 mm', fos: '1.08' },
  { id: 'SK001', name: 'Gangtok Slope 01', location: 'East Sikkim, KM-14 NH-10 Corridor', score: 87, risk: 'HIGH RISK', trend: '+14%', rain: '184.0 mm', moisture: '91.0%', displacement: '7.2 mm', fos: '1.14' },
  { id: 'ML02', name: 'Mawlynnong Escarpment', location: 'Meghalaya, East Khasi Hills Plateau', score: 58, risk: 'MODERATE', trend: '0%', rain: '110.0 mm', moisture: '76.0%', displacement: '1.8 mm', fos: '1.38' },
  { id: 'AP05', name: 'Tawang Valley Section', location: 'Arunachal Pradesh, Sela Pass West', score: 54, risk: 'MODERATE', trend: '-1%', rain: '94.0 mm', moisture: '68.0%', displacement: '1.2 mm', fos: '1.42' },
  { id: 'NL01', name: 'Kohima Bypass Ridge', location: 'Nagaland, Kohima Bypass Transit', score: 24, risk: 'LOW RISK', trend: '0%', rain: '42.0 mm', moisture: '45.0%', displacement: '0.4 mm', fos: '1.85' },
];

export const alerts = [
  { id: '#ALT-2024-0982', title: 'Gangtok Slope 01 — SK001', level: 'CRITICAL', age: '8 minutes ago', text: 'Pore water pressure surge (+28 kPa/hr) following 184mm continuous monsoon rainfall. Downslope creep accelerating at 7.2mm/24h.' },
  { id: '#ALT-2024-0979', title: 'Lumding Cut Ridge — LM04', level: 'HIGH', age: '34 minutes ago', text: 'Synthetic Aperture Radar verifies 7.2mm surface displacement along Lumding railway embankment.' },
  { id: '#ALT-2024-0974', title: 'Mawlynnong drainage threshold', level: 'MODERATE', age: '1 hour ago', text: 'Drainage saturation threshold exceeded 85%. Hydrostatic buildup observed in bore-gauge sensor BG-4.' },
];
