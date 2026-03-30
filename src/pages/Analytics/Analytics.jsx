import React from 'react';
import { MdTrendingUp, MdShowChart, MdPieChart } from 'react-icons/md';
import useApplications from '../../hooks/useApplications';
import {
  StatusPieChart, MonthlyBarChart,
  StatusBarChart, PlatformAreaChart,
} from '../../components/Charts/Charts';
import { fmtSalary, STATUS_COLORS } from '../../utils/helpers';
import './Analytics.css';

const AnalyticsCard = ({ title, icon, children }) => (
  <div className="card analytics-card">
    <div className="card-title">{icon} {title}</div>
    {children}
  </div>
);

const Analytics = () => {
  const { apps, loading } = useApplications();

  if (loading) {
    return (
      <div className="loading-wrap">
        <div className="spinner" />
        <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Loading analytics…</p>
      </div>
    );
  }

  /* ── Derived stats ── */
  const total        = apps.length || 1;
  const salaries     = apps.filter((a) => a.salary > 0).map((a) => a.salary);
  const avgSalary    = salaries.length ? salaries.reduce((s, v) => s + v, 0) / salaries.length : 0;
  const maxSalary    = salaries.length ? Math.max(...salaries) : 0;
  const successRate  = ((apps.filter((a) => a.status === 'Offer').length / total) * 100).toFixed(1);
  const responseRate = ((apps.filter((a) => ['Interviewing','Offer','Rejected'].includes(a.status)).length / total) * 100).toFixed(1);

  const byStatus = Object.entries(
    apps.reduce((acc, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc; }, {})
  ).map(([status, count]) => ({
    status, count,
    pct: ((count / total) * 100).toFixed(0),
    color: STATUS_COLORS[status],
  }));

  const topPlatform = Object.entries(
    apps.reduce((acc, a) => { acc[a.platform] = (acc[a.platform] || 0) + 1; return acc; }, {})
  ).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  return (
    <div className="analytics anim-fadeUp">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Deep insights into your job search</p>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Success Rate',   value: `${successRate}%`,       color: 'var(--accent-purple)', sub: 'offers / total' },
          { label: 'Response Rate',  value: `${responseRate}%`,      color: 'var(--accent-blue)',   sub: 'companies responded' },
          { label: 'Avg Salary',     value: fmtSalary(avgSalary),    color: 'var(--accent-green)',  sub: 'across all offers' },
          { label: 'Best Offer',     value: fmtSalary(maxSalary),    color: 'var(--accent-amber)',  sub: 'highest salary' },
        ].map((kpi, i) => (
          <div key={i} className="stat-card" style={{ '--accent-color': kpi.color }}>
            <div className="stat-number" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="stat-label">{kpi.label}</div>
            <div className="stat-sub">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Status breakdown */}
      <div className="analytics-row">
        <AnalyticsCard title="Application Pipeline" icon={<MdPieChart size={15} />}>
          <StatusPieChart apps={apps} />
        </AnalyticsCard>

        <AnalyticsCard title="Status Breakdown" icon="📊">
          <div className="status-breakdown">
            {byStatus.map((s, i) => (
              <div key={i} className="breakdown-item">
                <div className="breakdown-top">
                  <span className="breakdown-label">{s.status}</span>
                  <span className="breakdown-count" style={{ color: s.color }}>{s.count}</span>
                </div>
                <div className="breakdown-bar-bg">
                  <div
                    className="breakdown-bar-fill"
                    style={{ width: `${s.pct}%`, background: s.color }}
                  />
                </div>
                <div className="breakdown-pct">{s.pct}%</div>
              </div>
            ))}
          </div>

          <div className="analytics-insight">
            <span className="insight-label">🏆 Top Platform</span>
            <span className="insight-value">{topPlatform}</span>
          </div>
        </AnalyticsCard>
      </div>

      {/* Charts row 2 */}
      <div className="analytics-row" style={{ marginTop: 20 }}>
        <AnalyticsCard title="Monthly Applications" icon={<MdShowChart size={15} />}>
          <MonthlyBarChart apps={apps} />
        </AnalyticsCard>
        <AnalyticsCard title="Applications by Platform" icon={<MdTrendingUp size={15} />}>
          <PlatformAreaChart apps={apps} />
        </AnalyticsCard>
      </div>

      {/* Stacked status chart */}
      <div style={{ marginTop: 20 }}>
        <AnalyticsCard title="Monthly Status Breakdown" icon="📅">
          <StatusBarChart apps={apps} />
        </AnalyticsCard>
      </div>
    </div>
  );
};

export default Analytics;
