import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line, Area, AreaChart,
} from 'recharts';
import { STATUS_COLORS } from '../../utils/helpers';
import './Charts.css';

/* ── Custom Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        {label && <p className="chart-tooltip-label">{label}</p>}
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color || p.fill }}>
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/* ── Status Pie Chart ── */
export const StatusPieChart = ({ apps }) => {
  const data = Object.entries(
    apps.reduce((acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value, color: STATUS_COLORS[name] || '#6b7280' }));

  if (!data.length) return <div className="chart-empty">No data yet</div>;

  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="pie-legend">
        {data.map((d, i) => (
          <div key={i} className="pie-legend-item">
            <span className="pie-legend-dot" style={{ background: d.color }} />
            <span className="pie-legend-label">{d.name}</span>
            <span className="pie-legend-val">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Monthly Applications Bar Chart ── */
export const MonthlyBarChart = ({ apps }) => {
  const monthMap = {};
  apps.forEach((a) => {
    if (!a.appliedDate) return;
    const month = new Date(a.appliedDate).toLocaleString('en-IN', { month: 'short', year: '2-digit' });
    monthMap[month] = (monthMap[month] || 0) + 1;
  });

  const data = Object.entries(monthMap)
    .sort((a, b) => new Date('01 ' + a[0]) - new Date('01 ' + b[0]))
    .slice(-6)
    .map(([month, count]) => ({ month, count }));

  if (!data.length) return <div className="chart-empty">No data yet</div>;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fill: '#6b7280', fontSize: 12, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,.06)' }} />
        <Bar dataKey="count" name="Applications" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
};

/* ── Status Grouped Bar Chart ── */
export const StatusBarChart = ({ apps }) => {
  const monthMap = {};
  apps.forEach((a) => {
    if (!a.appliedDate) return;
    const month = new Date(a.appliedDate).toLocaleString('en-IN', { month: 'short' });
    if (!monthMap[month]) monthMap[month] = { month };
    monthMap[month][a.status] = (monthMap[month][a.status] || 0) + 1;
  });

  const data = Object.values(monthMap).slice(-5);
  if (!data.length) return <div className="chart-empty">No data yet</div>;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fill: '#6b7280', fontSize: 12, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,.06)' }} />
        <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Syne', paddingTop: 10 }} />
        {Object.keys(STATUS_COLORS).map((s) => (
          <Bar key={s} dataKey={s} fill={STATUS_COLORS[s]} radius={[4, 4, 0, 0]} maxBarSize={16} stackId="a" />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

/* ── Platform Area Chart ── */
export const PlatformAreaChart = ({ apps }) => {
  const platMap = apps.reduce((acc, a) => {
    acc[a.platform] = (acc[a.platform] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(platMap)
    .sort((a, b) => b[1] - a[1])
    .map(([platform, count]) => ({ platform, count }));

  if (!data.length) return <div className="chart-empty">No data yet</div>;

  const COLORS = ['#3b82f6','#10b981','#a855f7','#f59e0b','#ef4444','#06b6d4','#f97316'];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
        <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 12, fontFamily: 'Syne' }} axisLine={false} tickLine={false} allowDecimals={false} />
        <YAxis type="category" dataKey="platform" tick={{ fill: '#9ca3af', fontSize: 12, fontFamily: 'Syne' }} axisLine={false} tickLine={false} width={80} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,.06)' }} />
        <Bar dataKey="count" name="Applications" radius={[0, 6, 6, 0]} maxBarSize={20}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
