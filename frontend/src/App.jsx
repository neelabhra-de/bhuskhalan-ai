import React, { useEffect, useMemo, useState } from 'react';
import {
  Routes,
  Route,
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  Download,
  Map,
  Radio,
  Search,
  Settings,
  UserRound,
  Waves,
  CloudRain,
  Activity,
  BrainCircuit,
  ShieldCheck,
  Send,
  Play,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { navItems, slopes, alerts } from './data/mockData';
import { getPrediction } from './services/api';
import { simulationBaseline } from './data/simulationBaseline';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Circle,
  Popup,
  Tooltip,
  Polyline,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const riskClass = (risk) => risk.toLowerCase().replace(' ', '-');
function Topbar() {
  const [sector, setSector] = useState('All NER Sectors (8 States)');
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark">⌁</div>
        <div>
          <strong>
            BHUSKHALAN <span>AI CORE</span>
          </strong>
          <small>DISASTER INTEL & EARLY WARNING (NER)</small>
        </div>
      </div>
      <div className="crumb">
        GOI /<br />
        MHA
      </div>
      <div className="crumb">
        NDMA-
        <br />
        NER
      </div>
      <div className="crumb active">
        COCKPIT-
        <br />
        01
      </div>
      <label className="sector">
        <Map size={16} />
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          aria-label="Select NER sector"
        >
          <option>All NER Sectors (8 States)</option>
          <option>East Sikkim — Gangtok</option>
          <option>Meghalaya — East Khasi Hills</option>
          <option>Assam — Dima Hasao</option>
          <option>Arunachal Pradesh — Tawang</option>
          <option>Nagaland — Kohima</option>
        </select>
        <ChevronDown size={14} />
      </label>
      <div className="live">
        <i /> LIVE FEED <em>• 140ms</em>
        <small>SYNC: JUST NOW</small>
      </div>
      <button
        className="broadcast"
        onClick={() =>
          window.alert('Broadcast console is ready for CAP / SMS dispatch.')
        }
      >
        <Bell size={16} /> BROADCAST ALERT
      </button>
      <div className="avatar">
        <UserRound size={18} />
      </div>
    </header>
  );
}
function Sidebar() {
  return (
    <aside className="sidebar">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) => `nav-item ${isActive ? 'selected' : ''}`}
        >
          <span className="nav-icon">{item.icon}</span>
          <span>{item.label}</span>
          <b className={item.tone || ''}>{item.badge}</b>
        </NavLink>
      ))}
    </aside>
  );
}
function Shell({ children }) {
  return (
    <>
      <Topbar />
      <Sidebar />
      <main className="main">{children}</main>
    </>
  );
}
function PageHead({ eyebrow, title, desc, actions }) {
  return (
    <div className="page-head">
      <div>
        <div className="eyebrow">● &nbsp;{eyebrow}</div>
        <h1>{title}</h1>
        {desc && <p>{desc}</p>}
      </div>
      {actions && <div className="actions">{actions}</div>}
    </div>
  );
}
function StatCard({ label, value, sub, tone = 'blue', icon }) {
  return (
    <div className={`stat-card ${tone}`}>
      <div className="stat-label">
        {label}
        <span>{icon}</span>
      </div>
      <strong>{value}</strong>
      <small>{sub}</small>
    </div>
  );
}
const mapPoints = [
  {
    id: 'SK001',
    name: 'Gangtok Slope 01',
    position: [27.3389, 88.6065],
    score: 87,
    risk: 'HIGH RISK',
  },
  {
    id: 'LM04',
    name: 'Lumding Cut Ridge',
    position: [25.1842, 93.0176],
    score: 91,
    risk: 'CRITICAL',
  },
  {
    id: 'ML02',
    name: 'Mawlynnong Escarpment',
    position: [25.275, 91.88],
    score: 58,
    risk: 'MODERATE',
  },
  {
    id: 'AP05',
    name: 'Tawang Valley Section',
    position: [27.586, 91.86],
    score: 54,
    risk: 'MODERATE',
  },
];
function MapPanel({ light = false }) {
  return (
    <div className={`map-panel ${light ? 'map-light' : ''}`}>
      <RealMap onSelect={() => {}} activeId="SK001" />
    </div>
  );
}
function RealMap({ onSelect, activeId }) {
  const center = [26.2, 91.8];
  const path = [
    [27.3389, 88.6065],
    [26.75, 88.5],
    [26.2, 89.6],
    [25.1842, 93.0176],
  ];
  return (
    <MapContainer center={center} zoom={7} scrollWheelZoom className="real-map">
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline
        positions={path}
        pathOptions={{ color: '#0ea5e9', weight: 4, dashArray: '8 8' }}
      />
      {mapPoints.map((p) => (
        <React.Fragment key={p.id}>
          <Circle
            center={p.position}
            radius={p.score > 80 ? 22000 : 13000}
            pathOptions={{
              color: p.score > 80 ? '#ff8e8e' : '#42d7a9',
              fillColor: p.score > 80 ? '#ef4444' : '#22c55e',
              fillOpacity: 0.16,
            }}
          />
          <CircleMarker
            center={p.position}
            radius={9}
            pathOptions={{
              color: '#eaf4ff',
              weight: 2,
              fillColor:
                p.score > 80 ? '#ef4444' : p.score > 55 ? '#f59e0b' : '#22c55e',
              fillOpacity: 1,
            }}
            eventHandlers={{ click: () => onSelect(p.id) }}
          >
            <Tooltip
              direction="top"
              offset={[0, -8]}
              permanent={activeId === p.id}
            >
              {p.id} · {p.score}
            </Tooltip>
            <Popup>
              <b>{p.name}</b>
              <br />
              Risk score: {p.score}/100
              <br />
              {p.risk}
              <br />
              <button className="popup-action" onClick={() => onSelect(p.id)}>
                Open sector detail
              </button>
            </Popup>
          </CircleMarker>
        </React.Fragment>
      ))}
    </MapContainer>
  );
}
function MiniChart({ pink = false }) {
  return (
    <svg className="mini-chart" viewBox="0 0 180 48" preserveAspectRatio="none">
      <path
        d={
          pink
            ? 'M0 40 C35 38 45 34 76 35 S120 22 180 6'
            : 'M0 30 C32 29 45 31 70 29 S135 28 180 12'
        }
        fill="none"
        stroke={pink ? '#ffaaa5' : '#55dcb3'}
        strokeWidth="3"
      />
      <circle
        cx="180"
        cy={pink ? '6' : '12'}
        r="3.5"
        fill={pink ? '#ffaaa5' : '#55dcb3'}
      />
    </svg>
  );
}

function Dashboard() {
  return (
    <Shell>
      <PageHead
        eyebrow="ACTIVE CRISIS MONITORING / NER GEOTECHNICAL GRID / 15 NODES ONLINE"
        title="Command Center"
        desc="Live situational awareness across the North Eastern Region's landslide risk network."
        actions={
          <>
            <button className="btn">
              <Download size={15} /> Export CSV
            </button>
            <button className="btn">
              <Radio size={15} /> GeoJSON
            </button>
            <button className="btn primary">Add Sensor Array</button>
          </>
        }
      />
      <div className="alert-strip">
        <span className="status-dot critical-dot" />
        <div>
          <b>NER GIS EARLY WARNING TELEMETRY MATRIX</b>
          <small>
            CRITICAL DEFORMATION ACCELERATION DETECTED • ZONE IV/V EASTERN
            HIMALAYAN TECTONIC BELT
          </small>
        </div>
        <strong>
          InSAR PASS
          <br />
          <em>SENTINEL-1B (T-14m)</em>
        </strong>
        <strong>
          LAST TELEMETRY SYNC
          <br />
          <em>18:08:04 IST</em>
        </strong>
      </div>
      <div className="stats four">
        <StatCard
          label="ACTIVE SENSOR ARRAYS"
          value="15"
          sub="Slopes Active  ·  +2 New in Q3"
          tone="blue"
          icon="99.4% UP"
        />
        <StatCard
          label="HIGH RISK SECTORS"
          value="04"
          sub="Sites: Gangtok, Mangan, Champhai"
          tone="amber"
          icon="PATROL REQ"
        />
        <StatCard
          label="IMMEDIATE ADVISORY"
          value="02"
          sub="Critical Slopes  ·  EVACUATE 300M"
          tone="pink"
          icon="●"
        />
        <StatCard
          label="ACTIVE ALERTS TOTAL"
          value="06"
          sub="3 CRIT  ·  2 HIGH  ·  1 MOD"
          tone="blue"
          icon="Quick View ↗"
        />
      </div>
      <div className="dash-grid">
        <section className="panel map-card">
          <div className="panel-heading">
            <h2>
              <Map size={17} /> NER Geospatial Telemetry
            </h2>
            <span className="chip green">EPSG:4326</span>
          </div>
          <MapPanel />
        </section>
        <section className="panel priority">
          <div className="panel-heading">
            <h2>☷ Priority Slope Hazards</h2>
            <small>RANKED BY RISK INDEX</small>
          </div>
          {slopes.slice(0, 3).map((s) => (
            <div className="priority-row" key={s.id}>
              <div>
                <b>{s.name}</b>
                <small>
                  Primary Driver:{' '}
                  {s.id === 'SK001'
                    ? '184mm monsoon rainfall + soil saturation 91%'
                    : 'Shear deformation 11.4mm / deep bedrock slip'}
                </small>
              </div>
              <strong className={riskClass(s.risk)}>
                {s.score}/100
                <br />
                <small>{s.risk}</small>
              </strong>
            </div>
          ))}
        </section>
      </div>
    </Shell>
  );
}

function Rainfall() {
  return (
    <div className="panel rainfall">
      <div className="panel-heading">
        <div>
          <h2>
            <CloudRain size={18} /> 24-Hour Rainfall Infiltration & Pore
            Saturation
          </h2>
          <p>
            Comparative precipitation radar: East Sikkim vs West Jaintia Hills
            with 150mm danger limit
          </p>
        </div>
        <div className="legend">
          <i className="blue-dot" />
          East Sikkim <i className="green-dot" />
          West Jaintia <i className="pink-line" />
          150mm Threshold
        </div>
      </div>
      <div className="bars">
        {[38, 52, 68, 84, 98, 108, 90, 92].map((h, i) => (
          <div className="bar-group" key={i}>
            <div className={`bar b${i}`} style={{ height: h }} />
            <div className="bar greenbar" style={{ height: h * 0.72 }} />
            <small>
              {
                [
                  '00:00',
                  '03:00',
                  '06:00',
                  '09:00',
                  '12:00',
                  '15:00',
                  '18:00',
                  'NOW',
                ][i]
              }
            </small>
          </div>
        ))}
        <div className="threshold">THRESHOLD BREACH: 150 mm</div>
      </div>
      <div className="rain-footer">
        <span>
          Soil Saturation Model: East Sikkim NH-10 at <b>91.4%</b> (Liquefaction
          Risk)
        </span>
        <span>Cumulative 24h: Gangtok 184.2 mm | Cherapunji 132.8 mm</span>
      </div>
    </div>
  );
}
function RiskMap() {
  const [activeId, setActiveId] = useState('SK001');
  const [layers, setLayers] = useState([
    'risk',
    'slopes',
    'highway',
    'infra',
    'reports',
  ]);
  const active = mapPoints.find((p) => p.id === activeId) || mapPoints[0];
  const toggleLayer = (id) =>
    setLayers((x) => (x.includes(id) ? x.filter((y) => y !== id) : [...x, id]));
  return (
    <Shell>
      <PageHead
        eyebrow="LIVE GIS / RISK SURFACE / 15 MONITORED NODES"
        title="Risk Map (GIS)"
        desc="Explore hazard zones, active sensor arrays, and critical infrastructure across the NER corridor."
        actions={
          <button
            className="btn primary"
            onClick={() =>
              setLayers(['risk', 'slopes', 'highway', 'infra', 'reports'])
            }
          >
            ＋ Reset Layers
          </button>
        }
      />
      <div className="filters">
        <button>▦ ALL NER (8 STATES)⌄</button>
        <button>⌖ EAST KHASI (CHERRAPUNJI)⌄</button>
        <button>⚙ CRITICAL & HIGH (SCORE ≥ 60)⌄</button>
      </div>
      <div className="layer-tabs">
        {[
          ['risk', 'Risk Zones Heatmap'],
          ['slopes', 'Monitored Slopes (15)'],
          ['highway', 'Highway Corridors (NH-10, 27, 29)'],
          ['infra', 'Critical Infrastructure'],
          ['reports', 'Field Citizen Reports'],
        ].map(([id, label]) => (
          <button
            className={layers.includes(id) ? 'active' : ''}
            onClick={() => toggleLayer(id)}
            key={id}
          >
            {layers.includes(id) ? '◉' : '○'} {label}
          </button>
        ))}
      </div>
      <div className="big-map">
        <RealMap onSelect={setActiveId} activeId={activeId} />
        <div className="map-callout">
          <b>SECTOR {active.id} (ACTIVE)</b>
          <h2>{active.name}</h2>
          <span
            className={`risk ${active.risk === 'CRITICAL' ? 'critical' : 'high-risk'}`}
          >
            RISK {active.score}/100
          </span>
          <hr />
          <p>
            Geotechnical creep runtime{' '}
            <b>{active.id === 'SK001' ? '7.2' : '11.4'} mm</b> (Threshold 5.0mm)
          </p>
          <div className="map-metrics">
            <b>
              {active.id === 'SK001' ? '184' : '198'}
              <small>mm rain</small>
            </b>
            <b>
              {active.id === 'SK001' ? '91' : '94'}%
              <small>pore saturation</small>
            </b>
            <b>
              142<small>kPa borehole</small>
            </b>
          </div>
          <button className="btn primary map-detail">
            Open Digital Twin →
          </button>
        </div>
      </div>
    </Shell>
  );
}

function SlopeMonitor() {
  return (
    <Shell>
      <PageHead
        eyebrow="ACTIVE CRISIS MONITORING / NER GEOTECHNICAL GRID / 15 NODES ONLINE"
        title="Slope Monitoring Registry"
        desc="Continuous multi-parameter telemetry, real-time Factor of Safety calculations, and kinematic sensor arrays across critical North Eastern Region transport arteries."
        actions={
          <>
            <button className="btn">
              <Download size={15} /> Export CSV
            </button>
            <button className="btn">◉ GeoJSON</button>
            <button className="btn primary">⊕ Add Sensor Array</button>
          </>
        }
      />
      <div className="stats four">
        <StatCard
          label="PEAK DISPLACEMENT"
          value="11.4 mm/24h"
          sub="LM04 · Lumding Ridge"
          tone="pink"
          icon="↗"
        />
        <StatCard
          label="CRITICAL THRESHOLD"
          value="2 Slopes < 1.15 FoS"
          sub="Active Early Evacuation Alerts"
          tone="pink"
          icon="△"
        />
        <StatCard
          label="72H CUMULATIVE PRECIP"
          value="198.0 mm Max"
          sub="Assam - Dima Hasao Area"
          tone="blue"
          icon="☁"
        />
        <StatCard
          label="NETWORK HEALTH"
          value="100% (15/15 Synced)"
          sub="Avg ping 142ms • LoRaWAN Mesh"
          tone="green"
          icon="◉"
        />
      </div>
      <div className="panel table-panel">
        <div className="table-toolbar">
          <div className="search">
            <Search size={16} /> Search by slope, station ID, corridor
          </div>
          <div className="pill active">All Slopes (15)</div>
          <div className="pill pink">Critical (2)</div>
          <div className="pill blue">High Risk (4)</div>
          <div className="pill green">Moderate (6)</div>
          <div className="sort">SORT: Risk Score (High to Low)⌄</div>
        </div>
        <div className="table-head">
          <span>SLOPE IDENTIFIER / CORRIDOR</span>
          <span>STABILITY & RISK SCORE</span>
          <span>TREND / 24H</span>
          <span>72H PRECIP</span>
          <span>MOISTURE</span>
          <span>DISPLACEMENT</span>
          <span>FOS</span>
          <span>INSPECTION ACTION</span>
        </div>
        {slopes.map((s) => (
          <div className={`slope-row ${riskClass(s.risk)}`} key={s.id}>
            <div>
              <b>
                {s.name} <code>{s.id}</code>
              </b>
              <small>{s.location}</small>
              <em>
                ●{' '}
                {s.score > 80
                  ? 'Polled 30s · Telemetry Active'
                  : s.score > 50
                    ? 'Pore Pressure Normalizing'
                    : 'Fully Reinforced Retaining Grid'}
              </em>
            </div>
            <div>
              <strong>{s.score}/100</strong>
              <span className="risk-tag">{s.risk}</span>
            </div>
            <div>
              <MiniChart pink={s.score > 80} />
              <b>{s.trend}</b>
            </div>
            <div>
              <b>{s.rain}</b>
              <small>{s.score > 80 ? 'Extreme' : 'Heavy'}</small>
            </div>
            <div>
              <b>{s.moisture}</b>
              <small>{s.score > 80 ? 'Sat. limit' : 'Under limit'}</small>
            </div>
            <div>
              <b>{s.displacement}</b>
              <small>{s.score > 80 ? 'Shear slip' : 'Creep within tol.'}</small>
            </div>
            <div>
              <strong>{s.fos}</strong>
              <small>{s.fos < 1.2 ? 'NEAR FAIL' : 'STABLE RANGE'}</small>
            </div>
            <button className="btn">⬡ Inspect Twin</button>
          </div>
        ))}
      </div>
    </Shell>
  );
}

function Twin() {
  return (
    <Shell>
      <PageHead
        eyebrow="TARGET SLOPE / AI DIGITAL TWIN / CRITICAL SIM ACTIVE"
        title="Gangtok Slope 01"
        desc="East Sikkim, KM-14.2 NH-10 Corridor · 27.3314° N, 88.6138° E · Elevation: 1,640m MSL"
        actions={
          <>
            <button className="btn">What-If Sim</button>
            <button className="btn">GeoJSON / PDF</button>
            <button className="btn primary">Issue Advisory</button>
          </>
        }
      />
      <div className="stats four">
        <StatCard
          label="72H CUMULATIVE RAINFALL"
          value="184.4 mm"
          sub="Extreme Inundation · Threshold 150mm"
          tone="pink"
          icon="122%"
        />
        <StatCard
          label="PORE WATER SATURATION"
          value="91.2%"
          sub="Borehole Piezometer: 78 kPa"
          tone="pink"
          icon="CRIT"
        />
        <StatCard
          label="SHEAR DISPLACEMENT"
          value="7.2 mm"
          sub="Extensometer EX-02 · +1.8mm last 6h"
          tone="blue"
          icon="2.4×"
        />
        <StatCard
          label="SLOPE DIP & STRATA"
          value="34.0°"
          sub="Colluvium on Pelitic Schist · Aspect 135° SE"
          tone="blue"
          icon="⌁"
        />
      </div>
      <div className="twin-grid">
        <section className="panel xai">
          <div className="panel-heading">
            <h2>
              <BrainCircuit size={18} /> Explainable AI (XAI) Attribution
              Breakdown
            </h2>
            <span className="chip green">● MODEL VERIFIED</span>
          </div>
          {[
            [
              'Cumulative Rainfall Intensity (72h Threshold Breach)',
              '38.4% Impact',
              'pink',
            ],
            [
              'Soil Saturation & High Pore-Water Buildup (12m Depth)',
              '29.1% Impact',
              'blue',
            ],
            [
              'Downslope Shear Creep Velocity (+1.8mm/6h Extensometer)',
              '20.8% Impact',
              'blue',
            ],
            [
              'Historical Slide Reactivation Baseline & Thrust Fault Shear',
              '11.7% Impact',
              'gray',
            ],
          ].map((x, i) => (
            <div className="factor" key={i}>
              <b>{x[0]}</b>
              <strong className={x[2]}>{x[1]}</strong>
              <div>
                <i className={x[2]} style={{ width: x[1].slice(0, 4) + '%' }} />
              </div>
            </div>
          ))}
          <div className="diagnostic">
            <h3>SYNTHESIZED DIAGNOSTIC REASONING</h3>
            <p>
              Continuous precipitation has saturated the upper colluvium layer,
              reducing effective shear strength by 42.3%. Critical equilibrium
              failure projected within <b>14 to 28 hours</b> if current
              precipitation rate sustained.
            </p>
          </div>
        </section>
        <section className="panel twin-visual">
          <div className="panel-heading">
            <h2>Geotechnical Cross-Section Digital Twin</h2>
            <span className="chip blue">2.5D MODEL</span>
          </div>
          <div className="cross-section">
            <div className="slope-line" />
            <div className="sensor s-a">
              ●<small>Extensometer EX-02</small>
            </div>
            <div className="sensor s-b">
              ●<small>Piezometer PZ-01</small>
            </div>
            <div className="crack">TENSION CRACK / HEAD SCARP</div>
          </div>
          <div className="twin-foot">
            <span>
              Slip Surface Depth <b>11.8m (Shear Zone)</b>
            </span>
            <span>
              Water Table Elevation <b>+4.1m Above Normal</b>
            </span>
            <span>
              Estimated Runout Vol. <b>~34,000 m³</b>
            </span>
          </div>
        </section>
      </div>
      <div className="impact-grid">
        <section className="panel">
          <div className="panel-heading">
            <h2>♙ Downslope Impact Footprint</h2>
            <span className="chip critical">RED ZONE</span>
          </div>
          <div className="impact-row">
            <b>🚧 NH-10 Highway Corridor</b>
            <strong>140m Runout</strong>
            <p>
              Primary arterial lifeline connecting Gangtok with Siliguri. Direct
              debris path intersects KM-14.2 culvert.
            </p>
          </div>
          <div className="impact-row">
            <b>⚡ Singtam Substation Feeder</b>
            <strong>50m Offset</strong>
            <p>
              66kV high-tension transmission towers located on western shoulder.
            </p>
          </div>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <h2>
              <ShieldCheck size={18} /> Authorized SOP Incident Actions
            </h2>
            <span className="chip green">NDMA LEVEL-2 PROTOCOL</span>
          </div>
          {[
            'Issue Traffic Diversion on NH-10 (Rangpo-Rorathang Bypass)',
            'Dispatch SDRF Unit 03 to Inspect Tension Cracks Along Upper Ridge',
            'Activate Automated Early Warning Sirens at Singtam Cluster',
            'Set Sensor Polling Frequency to High-Rate (60-sec Burst)',
          ].map((x, i) => (
            <div className="action-row" key={i}>
              <span className={i === 2 ? 'box' : 'box checked'}>✓</span>
              <b>{x}</b>
              <button className="btn">
                {i === 0
                  ? 'EXECUTE'
                  : i === 1
                    ? 'DISPATCHED'
                    : i === 2
                      ? 'ARM SIREN'
                      : 'ACTIVE (60S)'}
              </button>
            </div>
          ))}
        </section>
      </div>
    </Shell>
  );
}

function Alerts() {
  return (
    <Shell>
      <PageHead
        eyebrow="DEFCON 2 DISASTER STREAM / SEC-NER-ALERT-ROUTER-04"
        title="Active Early Warning & Disaster Alert Stream"
        desc="Real-time automated threshold breaches, InSAR displacement triggers, and SDRF dispatch status across North Eastern Region command nodes."
        actions={
          <>
            <button className="btn primary">
              📡 Broadcast CAP Alert to District Collectors
            </button>
            <button className="btn">Mute Routine Warnings</button>
          </>
        }
      />
      <div className="stats six">
        <StatCard label="TOTAL ACTIVE" value="06" sub="STABLE" tone="blue" />
        <StatCard
          label="CRITICAL LEVEL 3"
          value="02"
          sub="IMMEDIATE"
          tone="pink"
        />
        <StatCard label="HIGH RISK" value="03" sub="ELEVATED" tone="blue" />
        <StatCard label="MODERATE" value="01" sub="WATCHLIST" tone="blue" />
        <StatCard
          label="DISPATCHED UNITS"
          value="05"
          sub="SDRF / BRO"
          tone="green"
        />
        <StatCard
          label="ACKNOWLEDGED"
          value="100%"
          sub="6 / 6 NODES"
          tone="blue"
        />
      </div>
      <div className="alert-layout">
        <div>
          {alerts.map((a) => (
            <div className="panel alert-card" key={a.id}>
              <div className={`alert-level ${riskClass(a.level)}`}>
                ✱ {a.level} SEVERITY
              </div>
              <small>{a.age}</small>
              <h2>{a.title}</h2>
              <code>{a.id}</code>
              <p>{a.text}</p>
              <div className="alert-actions">
                <span>✓ SDRF Notified · DM Acknowledged</span>
                <button className="btn">Acknowledge</button>
              </div>
            </div>
          ))}
        </div>
        <section className="panel checklist">
          <h2>
            ☑ Protocol Checklist <span className="chip green">100% READY</span>
          </h2>
          {[
            'CAP Protocol Gateway',
            'Acoustic Warning Sirens',
            'VHF Tactical Radio Relay',
            'Cell Broadcast Carrier Link',
          ].map((x) => (
            <div key={x}>
              <b>{x}</b>
              <small>CONNECTED TO NDMA GATEWAY CORE</small>
              <span>ONLINE</span>
            </div>
          ))}
        </section>
      </div>
    </Shell>
  );
}

function FieldReports() {
  return (
    <Shell>
      <PageHead
        eyebrow="NER GROUND INTEL PORTAL / SEC-L3 VERIFIED"
        title="Submit Geo-Tagged Field Observation"
        desc="Verified on-ground telemetry calibration for NER Landslide Hazard Matrix (LHM-v4). Field inputs tune automated radar displacement weighting."
        actions={
          <>
            <button className="btn">
              <Download size={15} /> Export CSV
            </button>
            <button className="btn primary">
              <RotateCcw size={15} /> Refresh Feed
            </button>
          </>
        }
      />
      <div className="field-grid">
        <section className="panel form-panel">
          <h3>
            1. OBSERVATION TYPE & HAZARD CLASS{' '}
            <span>SELECT PRIMARY ANOMALY</span>
          </h3>
          <div className="observation-grid">
            {[
              '⚑ Cracks in Road',
              '♧ Slope Bulge',
              '△ Active Slide',
              '⊘ Road Blockage',
              '♢ Water Seepage',
              '▧ Wall Distress',
            ].map((x, i) => (
              <button className={i === 2 ? 'selected' : ''}>
                {x}
                <small>
                  {
                    [
                      'Tensile fracture',
                      'Toe heave / creep',
                      'Mass downflow',
                      'Debris over asphalt',
                      'Mud & turbid spring',
                      'Gabion / masonry',
                    ][i]
                  }
                </small>
              </button>
            ))}
          </div>
          <h3>
            2. FIELD SEVERITY ASSESSMENT <span>ESCALATION THRESHOLD</span>
          </h3>
          <div className="severity-grid">
            {[
              'LVL 01|Low|Minor hairline cracks',
              'LVL 02|Moderate|Movement < 5cm',
              'LVL 03|Significant|Displacement 5-50cm',
              'LVL 04|Imminent|Immediate collapse risk',
            ].map((x, i) => {
              let [a, b, c] = x.split('|');
              return (
                <button className={i === 2 ? 'selected' : ''}>
                  <small>{a}</small>
                  <b>{b}</b>
                  <em>{c}</em>
                </button>
              );
            })}
          </div>
          <h3>3. GEOSPATIAL REFERENCE & CORRIDOR</h3>
          <div className="inputs">
            <input value="East Sikkim" readOnly />
            <input value="Gangtok Sub-division" readOnly />
          </div>
          <div className="dropzone">
            ▣<b>Drag & drop geotagged photos or click to browse</b>
            <small>
              Automatic EXIF extraction: GPS lat/lon, altitude, camera tilt &
              compass heading
            </small>
          </div>
          <h3>5. OFFICER CREDENTIAL & QUALITATIVE NOTES</h3>
          <div className="inputs">
            <input value="Insp. T. Norbu (Badge #SK-8821)" readOnly />
            <input
              value="SDRF Sikkim Battalion / East District Quick Response"
              readOnly
            />
          </div>
          <textarea
            value="Observed new transverse tension cracks widening across NH-10 road surface near KM-14.2 culvert. Soil bulging noticed at slope toe. Water oozing out turbid with silt, indicating internal piping failure behind retaining gabion. Traffic restricted to single lane."
            readOnly
          />
          <button className="btn primary submit">
            <Send size={16} /> Submit Verified Field Report to AI Engine
          </button>
        </section>
        <aside>
          <section className="panel">
            <h2>▱ Active Report Geotag Clusters</h2>
            <MapPanel light />
          </section>
          <section className="panel feed">
            <h2>▱ Live Field Reports Stream</h2>
            {[
              '#FR-1049 · Ballast Subsidence & Rockfall',
              '#FR-1047 · Tension Crack',
              'Model Calibration Impact',
            ].map((x) => (
              <div>
                <b>{x}</b>
                <small>VERIFIED BY SDRF · 15m ago</small>
              </div>
            ))}
          </section>
        </aside>
      </div>
    </Shell>
  );
}

function Simulation() {
  const [additionalRainfall, setAdditionalRainfall] = useState(65);
  const [soilMoisture, setSoilMoisture] = useState(98.5);
  const [seismicActivity, setSeismicActivity] = useState(0.12);
  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runSimulation = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...simulationBaseline,
        Rainfall_mm: simulationBaseline.Rainfall_mm + additionalRainfall,
        Rainfall_3Day: simulationBaseline.Rainfall_3Day + additionalRainfall,
        Soil_Moisture_Content: soilMoisture,
        Soil_Saturation: soilMoisture,
        Earthquake_Activity: seismicActivity,
      };
      const result = await getPrediction(payload);
      setSimulationResult(result);
    } catch (requestError) {
      setSimulationResult(null);
      setError(
        requestError.message ||
          'Unable to generate prediction. Please ensure the backend and ML services are running.'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetSimulation = () => {
    setAdditionalRainfall(65);
    setSoilMoisture(98.5);
    setSeismicActivity(0.12);
    setSimulationResult(null);
    setError('');
  };

  const outcome = simulationResult?.data;
  const runButtonLabel = loading
    ? 'Running AI Prediction...'
    : 'Run Physics-Informed Neural Sim';
  const scoreDelta = outcome ? Math.round(outcome.risk_score) - 87 : null;

  return (
    <Shell>
      <PageHead
        eyebrow="P-PINN ENGINE V4.2 / CRITICAL SIM ACTIVE"
        title="What-If Simulation"
        desc="Stress-test the Gangtok Slope 01 baseline against changing rainfall, saturation, and seismic conditions."
        actions={
          <button
            className="btn primary"
            onClick={runSimulation}
            disabled={loading}
            data-notoast="true"
          >
            <Play size={15} /> {runButtonLabel}
          </button>
        }
      />
      <div className="sim-top">
        <div className="target">
          <small>TARGET MONITORED SECTOR</small>
          <h2>Gangtok Slope 01 — SK001 (East Sikkim, NH-10)</h2>
          <div className="baseline">
            <b>
              BASELINE 72H RAIN <strong>184 mm</strong>
            </b>
            <b>
              CURRENT SOIL MOISTURE <strong>91.2%</strong>
            </b>
            <b>
              GROUND DISPLACEMENT <strong>7.2 mm/24h</strong>
            </b>
            <b>
              BASELINE AT RISK <strong>87/100</strong>
            </b>
            <b>
              BASELINE FoS <strong>1.14</strong>
            </b>
          </div>
        </div>
      </div>
      <div className="sim-grid">
        <section className="panel controls">
          <h2>
            <SlidersHorizontal size={19} /> Environmental Scenario Controls
          </h2>
          <p>
            Modify simulated monsoon cloudburst intensity and geophysical
            stressors to compute dynamic rupture thresholds.
          </p>
          <div className="slider-control">
            <b>☁ Additional Precipitation</b>
            <strong>+{additionalRainfall} mm</strong>
            <input
              type="range"
              min="0"
              max="150"
              value={additionalRainfall}
              onChange={(e) => setAdditionalRainfall(Number(e.target.value))}
            />
          </div>
          <div className="slider-control">
            <b>♢ Soil Moisture & Pore Saturation</b>
            <strong>{soilMoisture}%</strong>
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={soilMoisture}
              onChange={(e) => setSoilMoisture(Number(e.target.value))}
            />
          </div>
          <div className="slider-control">
            <b>◉ Seismic Micro-Tremor</b>
            <strong>{seismicActivity}g</strong>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={seismicActivity}
              onChange={(e) => setSeismicActivity(Number(e.target.value))}
            />
          </div>
          {error && (
            <p role="alert" className="error-message">
              {error}
            </p>
          )}
          <button
            className="btn primary wide"
            onClick={runSimulation}
            disabled={loading}
            data-notoast="true"
          >
            <Play size={16} /> {runButtonLabel}
          </button>
          <button
            className="btn wide"
            onClick={resetSimulation}
            disabled={loading}
            data-notoast="true"
          >
            Reset to Baseline
          </button>
        </section>
        <section className="panel scenario">
          <div className="panel-heading">
            <h2>⇆ Comparative Scenario Output</h2>
            <small>MONTE CARLO ITERATION: #40,000</small>
          </div>
          <div className="compare">
            <div>
              <small>CURRENT BASELINE</small>
              <strong>
                87 <i>/100</i>
              </strong>
              <p>
                Factor of Safety: <b>1.14</b>
                <br />
                Probability of Rupture: <b>38% in 48h</b>
                <br />
                Slope Strain Rate: <b>0.3 mm/h</b>
              </p>
            </div>
            <div className="arrow">
              →
              <small>
                {scoreDelta === null
                  ? '—'
                  : (scoreDelta >= 0 ? '+' : '') + scoreDelta + ' pts'}
              </small>
            </div>
            <div className="outcome">
              <small>SIMULATED OUTCOME</small>
              <strong>
                {outcome ? Math.round(outcome.risk_score) : '—'} <i>/100</i>
              </strong>
              <p>
                {outcome ? (
                  <>
                    Risk Level: <b>{outcome.risk_level}</b>
                    <br />
                    Risk Probability:{' '}
                    <b>{Math.round(outcome.risk_probability * 100)}%</b>
                    <br />
                    Prediction: <b>{outcome.prediction}</b>
                  </>
                ) : (
                  <>Run the simulation to receive a real ML prediction.</>
                )}
              </p>
            </div>
          </div>
          <div className="diagnostic">
            <h3>Explainable AI Simulation Interpretation</h3>
            <p>
              {outcome ? (
                <>
                  The backend ML service evaluated the scenario with{' '}
                  <b>+{additionalRainfall}mm precipitation</b>,{' '}
                  <b>{soilMoisture}% saturation</b>, and{' '}
                  <b>{seismicActivity}g seismic activity</b>. The returned risk
                  level is <b>{outcome.risk_level}</b>.
                </>
              ) : (
                <>
                  Adjust the scenario controls and run the simulation to
                  evaluate this prototype scenario with the connected ML model.
                </>
              )}
            </p>
          </div>
        </section>
      </div>
      <div className="impact-cards">
        <StatCard
          label="EST. DEBRIS VOLUME"
          value="~48,000 m³"
          sub="Colluvial soil & high rockfall fragments"
          tone="blue"
        />
        <StatCard
          label="RUNOUT DISTANCE"
          value="280 m"
          sub="Engulfs NH-10; threatens 14 Singtam Ward 4 units"
          tone="pink"
        />
        <StatCard
          label="HIGHWAY DOWNTIME"
          value="7–10 days"
          sub="Without pre-emptive berm reinforcement"
          tone="blue"
        />
      </div>
    </Shell>
  );
}

function App() {
  const [notice, setNotice] = useState('');
  useEffect(() => {
    const handler = (e) => {
      const button = e.target.closest('button');
      if (!button || button.dataset.notoast === 'true') return;
      if (button.classList.contains('broadcast')) return;
      setNotice(
        `${button.textContent.trim().replace(/\s+/g, ' ')} · mock action queued`
      );
      window.clearTimeout(window.__bhusToast);
      window.__bhusToast = window.setTimeout(() => setNotice(''), 2400);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/risk-map" element={<RiskMap />} />
        <Route path="/slope-monitor" element={<SlopeMonitor />} />
        <Route path="/digital-twin" element={<Twin />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/field-reports" element={<FieldReports />} />
        <Route path="/simulation" element={<Simulation />} />
      </Routes>
      {notice && <div className="toast">● {notice}</div>}
    </>
  );
}

export default App;
