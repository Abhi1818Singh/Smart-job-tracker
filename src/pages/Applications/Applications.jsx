import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdAddCircle, MdGridView, MdTableRows } from 'react-icons/md';
import { toast } from 'react-toastify';
import useApplications from '../../hooks/useApplications';
import useDebounce from '../../hooks/useDebounce';
import SearchBar from '../../components/SearchBar/SearchBar';
import Filters from '../../components/Filters/Filters';
import JobCard, { JobRow } from '../../components/JobCard/JobCard';
import { STATUSES } from '../../utils/helpers';
import './Applications.css';

const TABS = ['All', ...STATUSES];

const Applications = () => {
  const navigate = useNavigate();
  const { apps, remove, loading } = useApplications();

  const [searchTerm, setSearchTerm]   = useState('');
  const [activeTab, setActiveTab]     = useState('All');
  const [viewMode, setViewMode]       = useState('table'); // 'table' | 'grid'
  const [sortBy, setSortBy]           = useState('appliedDate');
  const [filters, setFilters]         = useState({ status: '', platform: '', location: '' });

  const debounced = useDebounce(searchTerm, 400);

  const handleFilterChange = (key, val) =>
    setFilters((prev) => ({ ...prev, [key]: val }));

  const handleReset = () => {
    setFilters({ status: '', platform: '', location: '' });
    setSortBy('appliedDate');
    setSearchTerm('');
    setActiveTab('All');
  };

  const handleDelete = (id) => {
    remove(id);
    toast.success('Application removed');
  };

  const filtered = useMemo(() => {
    let result = [...apps];

    // Tab filter
    if (activeTab !== 'All') result = result.filter((a) => a.status === activeTab);

    // Search (debounced)
    if (debounced.trim()) {
      const q = debounced.toLowerCase();
      result = result.filter(
        (a) => a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q)
      );
    }

    // Dropdown filters
    if (filters.status)   result = result.filter((a) => a.status   === filters.status);
    if (filters.platform) result = result.filter((a) => a.platform === filters.platform);
    if (filters.location) result = result.filter((a) => a.location === filters.location);

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'salary')      return (b.salary || 0) - (a.salary || 0);
      if (sortBy === 'company')     return a.company.localeCompare(b.company);
      return new Date(b.appliedDate) - new Date(a.appliedDate); // default: date
    });

    return result;
  }, [apps, activeTab, debounced, filters, sortBy]);

  const tabCount = (tab) =>
    tab === 'All' ? apps.length : apps.filter((a) => a.status === tab).length;

  if (loading) {
    return (
      <div className="loading-wrap">
        <div className="spinner" />
        <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Fetching applications from API…</p>
      </div>
    );
  }

  return (
    <div className="applications anim-fadeUp">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Applications</h1>
          <p className="page-subtitle">{apps.length} total · {filtered.length} shown</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/applications/new')}>
          <MdAddCircle size={16} /> Add Application
        </button>
      </div>

      {/* Search + View toggle */}
      <div className="apps-toolbar">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <div className="view-toggle">
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Card view"
          >
            <MdGridView size={18} />
          </button>
          <button
            className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Table view"
          >
            <MdTableRows size={18} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-row">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            <span className="tab-count">{tabCount(tab)}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <Filters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No applications found</h3>
            <p>Try adjusting your filters or search term</p>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="apps-grid">
          {filtered.map((app) => (
            <JobCard key={app.id} app={app} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="card table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Company / Role</th>
                <th>Status</th>
                <th>Platform</th>
                <th>Location</th>
                <th>Salary</th>
                <th>Applied</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <JobRow key={app.id} app={app} onDelete={handleDelete} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Applications;
