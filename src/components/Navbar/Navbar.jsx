import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  MdDashboard, MdWork, MdAddCircle, MdBarChart,
  MdBookmark, MdClose, MdSearch,
} from 'react-icons/md';
import useApplications from '../../hooks/useApplications';
import './Navbar.css';

const NAV_ITEMS = [
  { to: '/dashboard',    icon: <MdDashboard />,  label: 'Dashboard'    },
  { to: '/applications', icon: <MdWork />,        label: 'Applications' },
  { to: '/browse',       icon: <MdSearch />,      label: 'Browse Jobs'  },
  { to: '/analytics',    icon: <MdBarChart />,    label: 'Analytics'    },
  { to: '/bookmarks',    icon: <MdBookmark />,    label: 'Bookmarks'    },
];

const Navbar = ({ mobileOpen, setMobileOpen }) => {
  const navigate = useNavigate();
  const { apps } = useApplications();
  const bookmarkCount = apps.filter((a) => a.bookmarked).length;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="nav-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`navbar ${mobileOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="nav-logo">
          <div className="nav-logo-icon">JT</div>
          <div>
            <div className="nav-logo-title">JobTrack</div>
            <div className="nav-logo-sub">Smart Dashboard</div>
          </div>
          <button className="nav-close-btn" onClick={() => setMobileOpen(false)}>
            <MdClose />
          </button>
        </div>

        {/* Add button */}
        <button
          className="nav-add-btn"
          onClick={() => { navigate('/applications/new'); setMobileOpen(false); }}
        >
          <MdAddCircle size={18} />
          Add Application
        </button>

        {/* Nav links */}
        <nav className="nav-links">
          <div className="nav-section-label">Menu</div>
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="nav-item-icon">{icon}</span>
              <span className="nav-item-label">{label}</span>
              {label === 'Browse Jobs' && (
                <span className="nav-badge nav-badge--new">New</span>
              )}
              {label === 'Bookmarks' && bookmarkCount > 0 && (
                <span className="nav-badge">{bookmarkCount}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer stats */}
        <div className="nav-footer">
          <div className="nav-footer-stat">
            <span className="nav-footer-num">{apps.length}</span>
            <span className="nav-footer-text">Total Apps</span>
          </div>
          <div className="nav-footer-divider" />
          <div className="nav-footer-stat">
            <span className="nav-footer-num">
              {apps.filter((a) => a.status === 'Interviewing').length}
            </span>
            <span className="nav-footer-text">Interviews</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;