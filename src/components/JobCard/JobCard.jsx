import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdEdit, MdDelete, MdBookmark, MdBookmarkBorder, MdCalendarToday, MdAttachMoney } from 'react-icons/md';
import { getLogoUrl, domainOf } from '../../services/api';
import { fmtSalary, fmtDate, STATUS_META } from '../../utils/helpers';
import useApplications from '../../hooks/useApplications';
import './JobCard.css';

/* ── Company Logo — Clearbit + initial fallback ── */
export const CompanyLogo = ({ company, domain, size = 38 }) => {
  const [err, setErr] = useState(false);
  const COLORS = ['#3b82f6','#10b981','#a855f7','#f59e0b','#ef4444','#06b6d4','#f97316'];
  const bg     = COLORS[(company?.charCodeAt(0) || 0) % COLORS.length];

  // Prefer explicit domain prop; fall back to deriving from company name
  const resolvedDomain = domain || domainOf(company);

  if (err || !resolvedDomain) {
    return (
      <div
        className="company-logo-fallback"
        style={{ width: size, height: size, background: bg, fontSize: size * 0.42 }}
      >
        {company?.[0]?.toUpperCase() || '?'}
      </div>
    );
  }

  return (
    <img
      src={getLogoUrl(resolvedDomain)}   // → https://logo.clearbit.com/{domain}
      alt={company}
      onError={() => setErr(true)}
      style={{ width: size, height: size }}
      className="company-logo-img"
    />
  );
};

/* ── Status Badge ── */
export const StatusBadge = ({ status }) => {
  const m = STATUS_META[status] || STATUS_META.Applied;
  return (
    <span
      className="badge"
      style={{ background: m.bg, color: m.text, border: `1px solid ${m.border}` }}
    >
      <span className="badge-dot" style={{ background: m.dot }} />
      {status}
    </span>
  );
};

/* ── Job Card (grid view) ── */
const JobCard = ({ app, onDelete }) => {
  const navigate           = useNavigate();
  const { toggleBookmark } = useApplications();

  return (
    <div className="job-card anim-fadeUp">
      {/* Header */}
      <div className="job-card-header">
        <CompanyLogo company={app.company} domain={app.domain} />
        <div className="job-card-info">
          <h3 className="job-card-company">{app.company}</h3>
          <p className="job-card-role">{app.role}</p>
        </div>
        <button
          className="btn-icon bookmark-btn"
          onClick={() => toggleBookmark(app.id)}
          title="Bookmark"
        >
          {app.bookmarked
            ? <MdBookmark size={20} color="var(--accent-amber)" />
            : <MdBookmarkBorder size={20} />}
        </button>
      </div>

      {/* Meta */}
      <div className="job-card-meta">
        <span className="job-card-tag">{app.location}</span>
        <span className="job-card-tag">{app.platform}</span>
        <StatusBadge status={app.status} />
      </div>

      {/* Stats */}
      <div className="job-card-stats">
        <div className="job-card-stat">
          <MdAttachMoney size={14} />
          <span>{fmtSalary(app.salary)}</span>
        </div>
        <div className="job-card-stat">
          <MdCalendarToday size={13} />
          <span>{fmtDate(app.appliedDate)}</span>
        </div>
      </div>

      {app.interviewDate && (
        <div className="job-card-interview">
          🗓 Interview: {fmtDate(app.interviewDate)}
        </div>
      )}

      {app.notes && (
        <p className="job-card-notes">{app.notes}</p>
      )}

      {/* Actions */}
      <div className="job-card-actions">
        <button
          className="btn-ghost"
          onClick={() => navigate(`/applications/${app.id}`)}
        >
          <MdEdit size={14} /> Edit
        </button>
        <button className="btn-danger" onClick={() => onDelete(app.id)}>
          <MdDelete size={14} /> Delete
        </button>
      </div>
    </div>
  );
};

/* ── Table Row variant ── */
export const JobRow = ({ app, onDelete }) => {
  const navigate           = useNavigate();
  const { toggleBookmark } = useApplications();

  return (
    <tr className="anim-fadeIn">
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <CompanyLogo company={app.company} domain={app.domain} size={32} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{app.company}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{app.role}</div>
          </div>
        </div>
      </td>
      <td><StatusBadge status={app.status} /></td>
      <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{app.platform}</td>
      <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{app.location}</td>
      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{fmtSalary(app.salary)}</td>
      <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{fmtDate(app.appliedDate)}</td>
      <td>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button className="btn-icon" onClick={() => toggleBookmark(app.id)}>
            {app.bookmarked
              ? <MdBookmark size={18} color="var(--accent-amber)" />
              : <MdBookmarkBorder size={18} />}
          </button>
          <button
            className="btn-ghost"
            style={{ padding: '5px 10px', fontSize: 12 }}
            onClick={() => navigate(`/applications/${app.id}`)}
          >
            <MdEdit size={13} /> Edit
          </button>
          <button
            className="btn-danger"
            style={{ padding: '5px 10px', fontSize: 12 }}
            onClick={() => onDelete(app.id)}
          >
            <MdDelete size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default JobCard;