
import React, { createContext, useState, useCallback, useEffect } from 'react';
import { fetchMockJobs, mapProductToJob } from '../services/api';
import useLocalStorage from '../hooks/useLocalStorage';
import { uid } from '../utils/helpers';

export const AppContext = createContext(null);

export const ApplicationProvider = ({ children }) => {
  const [apps, setApps, clearApps] = useLocalStorage('jt_applications_v1', []);
  const [loading, setLoading]      = useState(false);
  const [apiError, setApiError]    = useState(null);
  const [apiLoaded, setApiLoaded]  = useState(false);

  /* ── Fetch from DummyJSON on first boot (via Axios) ── */
  useEffect(() => {
    const alreadyLoaded = localStorage.getItem('jt_api_loaded');
    if (alreadyLoaded && apps.length > 0) {
      setApiLoaded(true);
      return;
    }

    const load = async () => {
      setLoading(true);
      setApiError(null);
      try {
        // fetchMockJobs uses Axios under the hood (see services/api.js)
        const products = await fetchMockJobs();
        const mapped   = products.map((p, i) => mapProductToJob(p, i));
        setApps(mapped);
        localStorage.setItem('jt_api_loaded', 'true');
        setApiLoaded(true);
      } catch (err) {
        console.error('Axios fetch failed:', err.message);
        setApiError(`Failed to load job listings: ${err.message}`);
        setApiLoaded(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []); // eslint-disable-line

  /* ── CRUD ── */
  const add = useCallback((applicationData) => {
    const newApp = {
      ...applicationData,
      id:          uid(),
      bookmarked:  false,
      _fromApi:    false,
      appliedDate: applicationData.appliedDate || new Date().toISOString().split('T')[0],
    };
    setApps((prev) => [newApp, ...prev]);
    return newApp;
  }, [setApps]);

  const update = useCallback((id, data) => {
    setApps((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...data } : app))
    );
  }, [setApps]);

  const remove = useCallback((id) => {
    setApps((prev) => prev.filter((app) => app.id !== id));
  }, [setApps]);

  const toggleBookmark = useCallback((id) => {
    setApps((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, bookmarked: !app.bookmarked } : app
      )
    );
  }, [setApps]);

  const resetToApi = useCallback(async () => {
    localStorage.removeItem('jt_api_loaded');
    clearApps();
    setLoading(true);
    setApiError(null);
    try {
      const products = await fetchMockJobs();
      const mapped   = products.map((p, i) => mapProductToJob(p, i));
      setApps(mapped);
      localStorage.setItem('jt_api_loaded', 'true');
    } catch (err) {
      setApiError(`Reset failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [clearApps, setApps]);

  const value = {
    apps,
    loading,
    apiError,
    apiLoaded,
    add,
    update,
    remove,
    toggleBookmark,
    resetToApi,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};