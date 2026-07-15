import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, loading } = useAuth();

  // Close mobile sidebar on route change
  useEffect(() => {
    document.body.classList.remove('sidebar-open');
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '100vh', gap: 16, background: 'var(--off-white)'
      }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(245,166,35,.15)', borderTopColor: '#f5a623', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '0.9rem', color: 'var(--gray-500)', fontWeight: 500 }}>Authorizing session...</span>
      </div>
    );
  }

  // Route Guard: Redirect unauthorized users back to login page
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main-wrapper">
        <Outlet />
      </div>
    </div>
  );
}
