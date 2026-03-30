import React from 'react';
import { MdFilterList, MdRefresh } from 'react-icons/md';
import { STATUSES, PLATFORMS, LOC_TYPES } from '../../utils/helpers';
import './Filters.css';

const Filters = ({ filters, onFilterChange, onReset, sortBy, onSortChange }) => {
  const hasActiveFilter =
    filters.status || filters.platform || filters.location || sortBy !== 'appliedDate';

  return (
    <div className="filters-bar">
      <div className="filters-left">
        <MdFilterList size={16} color="var(--text-muted)" />

        <select
          className="filter-select"
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          className="filter-select"
          value={filters.platform}
          onChange={(e) => onFilterChange('platform', e.target.value)}
        >
          <option value="">All Platforms</option>
          {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        <select
          className="filter-select"
          value={filters.location}
          onChange={(e) => onFilterChange('location', e.target.value)}
        >
          <option value="">All Locations</option>
          {LOC_TYPES.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div className="filters-right">
        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="appliedDate">Sort: Date Applied</option>
          <option value="salary">Sort: Salary</option>
          <option value="company">Sort: Company</option>
        </select>

        {hasActiveFilter && (
          <button className="btn-ghost filter-reset" onClick={onReset}>
            <MdRefresh size={14} /> Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default Filters;
