import React from 'react';
import { MdBookmark } from 'react-icons/md';
import { toast } from 'react-toastify';
import useApplications from '../../hooks/useApplications';
import JobCard from '../../components/JobCard/JobCard';
import './Bookmarks.css';

const Bookmarks = () => {
  const { apps, remove } = useApplications();
  const bookmarked = apps.filter((a) => a.bookmarked);

  const handleDelete = (id) => {
    remove(id);
    toast.success('Application removed');
  };

  return (
    <div className="bookmarks anim-fadeUp">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <MdBookmark style={{ verticalAlign: 'middle', color: 'var(--accent-amber)' }} />
            {' '}Bookmarks
          </h1>
          <p className="page-subtitle">{bookmarked.length} saved application{bookmarked.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {bookmarked.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">🔖</div>
            <h3>No bookmarks yet</h3>
            <p>Click the bookmark icon on any job card to save it here</p>
          </div>
        </div>
      ) : (
        <div className="bookmarks-grid">
          {bookmarked.map((app) => (
            <JobCard key={app.id} app={app} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
