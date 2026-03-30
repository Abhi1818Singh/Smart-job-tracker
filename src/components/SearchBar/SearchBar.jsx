import React from 'react';
import { MdSearch, MdClose } from 'react-icons/md';
import './SearchBar.css';

const SearchBar = ({ value, onChange, placeholder = 'Search by company or role…' }) => {
  return (
    <div className="search-bar">
      <MdSearch className="search-icon" size={18} />
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button className="search-clear" onClick={() => onChange('')}>
          <MdClose size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
