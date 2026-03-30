import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdWork, MdEvent, MdCheckCircle, MdCancel,
  MdAddCircle, MdRefresh, MdTrendingUp,
} from 'react-icons/md';
import useApplications from '../../hooks/useApplications';
import { StatusPieChart, MonthlyBarChart } from '../../components/Charts/Charts';
import { CompanyLogo, StatusBadge } from '../../components/JobCard/JobCard';
import { fmtSalary, fmtDate } from '../../utils/helpers';
import './Dashboard.css';

const StatCard = ({ label, value, icon, color, sub }) => (
  <div className="stat-card" style={{ '--accent-color': color }}>
    <div className="stat-card-header">
      <span className="stat-icon" style={{ background: `${color}18`, color }}>{icon}</span>
    </div>
    <div className="stat-number" style={{ color }}>{value}</div>
    <div className="stat-label">{label}</div>
    {sub && <div className="stat-sub">{sub}</div>}
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { apps, loading, apiError, resetToApi } = useApplications();

  const stats = {
    total:        apps.length,
    interviewing: apps.filter((a) => a.status === 'Interviewing').length,
    offers:       apps.filter((a) => a.status === 'Offer').length,
    rejected:     apps.filter((a) => a.status === 'Rejected').length,
    applied:      apps.filter((a) => a.status === 'Applied').length,
    bookmarked:   apps.filter((a) => a.bookmarked).length,
  };

  const recentApps = [...apps]
    .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
    .slice(0, 5);

  const upcomingInterviews = apps
    .filter((a) => a.interviewDate && new Date(a.interviewDate) >= new Date())
    .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate))
    .slice(0, 4);

  if (loading) {
    return (
      <div className="loading-wrap">
        <div className="spinner" />
        <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
          Loading job data from API…
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard anim-fadeUp">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Track your job search · {apps.length} total applications
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-ghost" onClick={resetToApi}>
            <MdRefresh size={15} /> Refresh API
          </button>
          <button className="btn-primary" onClick={() => navigate('/applications/new')}>
            <MdAddCircle size={16} /> Add Job
          </button>
        </div>
      </div>

      {apiError && (
        <div className="dashboard-error">⚠ {apiError}</div>
      )}

      {/* Stat cards */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        <StatCard label="Total Applications" value={stats.total}        icon={<MdWork size={20} />}        color="var(--accent-blue)"   sub={`${stats.applied} pending`} />
        <StatCard label="Interviewing"        value={stats.interviewing} icon={<MdEvent size={20} />}       color="var(--accent-green)"  sub="Active rounds" />
        <StatCard label="Offers Received"     value={stats.offers}       icon={<MdCheckCircle size={20} />} color="var(--accent-purple)" sub="Congratulations!" />
        <StatCard label="Rejected"            value={stats.rejected}     icon={<MdCancel size={20} />}      color="var(--accent-red)"    sub="Keep going 💪" />
      </div>

      {/* Charts row */}
      <div className="dashboard-charts">
        <div className="card">
          <div className="card-title">
            <MdTrendingUp size={16} /> Application Pipeline
          </div>
          <StatusPieChart apps={apps} />
        </div>
        <div className="card">
          <div className="card-title">📅 Monthly Applications</div>
          <MonthlyBarChart apps={apps} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="dashboard-bottom">
        {/* Recent applications */}
        <div className="card">
          <div className="card-title">🕐 Recent Applications</div>
          {recentApps.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📂</div>
              <h3>No applications yet</h3>
              <p>Add your first job application to get started</p>
            </div>
          ) : (
            <div className="recent-list">
              {recentApps.map((app) => (
                <div key={app.id} className="recent-item"
                  onClick={() => navigate(`/applications/${app.id}`)}>
                  <CompanyLogo company={app.company} size={34} />
                  <div className="recent-info">
                    <div className="recent-company">{app.company}</div>
                    <div className="recent-role">{app.role}</div>
                  </div>
                  <div className="recent-right">
                    <StatusBadge status={app.status} />
                    <div className="recent-date">{fmtDate(app.appliedDate)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming interviews */}
        <div className="card">
          <div className="card-title">🗓 Upcoming Interviews</div>
          {upcomingInterviews.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <h3>No upcoming interviews</h3>
              <p>Interview dates will appear here</p>
            </div>
          ) : (
            <div className="interview-list">
              {upcomingInterviews.map((app) => (
                <div key={app.id} className="interview-item">
                  <div className="interview-date-box">
                    <span className="interview-day">
                      {new Date(app.interviewDate).getDate()}
                    </span>
                    <span className="interview-month">
                      {new Date(app.interviewDate).toLocaleString('en-IN', { month: 'short' })}
                    </span>
                  </div>
                  <div className="interview-info">
                    <div className="interview-company">{app.company}</div>
                    <div className="interview-role">{app.role}</div>
                  </div>
                  <div className="interview-salary">{fmtSalary(app.salary)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
