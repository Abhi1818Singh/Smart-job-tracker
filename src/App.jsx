import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ApplicationProvider } from './context/ApplicationContext';
import Navbar from './components/Navbar/Navbar';

import Dashboard       from './pages/Dashboard/Dashboard';
import Applications    from './pages/Applications/Applications';
import AddApplication  from './pages/AddApplication/AddApplication';
import EditApplication from './pages/EditApplication/EditApplication';
import Analytics       from './pages/Analytics/Analytics';
import Bookmarks       from './pages/Bookmarks/Bookmarks';
import BrowseJobs      from './pages/BrowseJobs/Browsejobs';

import { MdMenu } from 'react-icons/md';
import './App.css';

const App = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <BrowserRouter>
      <ApplicationProvider>
        <div className="app-shell">
          {/* Sidebar */}
          <Navbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

          {/* Main content */}
          <main className="main-content">
            {/* Mobile top bar */}
            <div className="mobile-topbar">
              <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
                <MdMenu size={22} />
              </button>
              <span className="mobile-logo">JobTrack</span>
            </div>

            <Routes>
              <Route path="/"                    element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard"           element={<Dashboard />} />
              <Route path="/applications"        element={<Applications />} />
              <Route path="/applications/new"    element={<AddApplication />} />
              <Route path="/applications/:id"    element={<EditApplication />} />
              <Route path="/analytics"           element={<Analytics />} />
              <Route path="/bookmarks"           element={<Bookmarks />} />
              <Route path="/browse"              element={<BrowseJobs />} />
              <Route path="*"                    element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>

        {/* Toast notifications */}
        <ToastContainer
          position="bottom-right"
          autoClose={2800}
          theme="dark"
          toastStyle={{
            background: '#111827',
            border: '1px solid #1f2937',
            fontFamily: "'Syne', sans-serif",
            fontWeight: 600,
            fontSize: 14,
          }}
        />
      </ApplicationProvider>
    </BrowserRouter>
  );
};

export default App;