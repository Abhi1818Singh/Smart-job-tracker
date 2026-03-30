import { useContext } from 'react';
import { AppContext } from '../context/ApplicationContext';

/**
 * useApplications — exposes the full application context.
 * Handles all CRUD operations for job applications.
 *
 * Usage:
 *   const { apps, add, update, remove, toggleBookmark, loading } = useApplications();
 */
const useApplications = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApplications must be used within an ApplicationProvider');
  }
  return context;
};

export default useApplications;
