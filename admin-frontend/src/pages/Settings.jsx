import React from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  return (
    <>
      <Header title="Settings" subtitle="Account & system settings" />
      <main className="admin-main">
        <div className="card" style={{ padding: 32, maxWidth: 560 }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--navy)', marginBottom: 20 }}>Account Settings</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, padding: '16px', background: 'var(--gray-50)', borderRadius: 12, border: '1px solid var(--gray-100)', transition: 'all 0.3s ease' }}>
            <img src={user?.avatar} alt="" style={{ width: 56, height: 56, borderRadius: '50%', border: '3px solid #f5a623' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--navy)' }}>{user?.name}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>{user?.email}</div>
              <div style={{ fontSize: '0.72rem', color: '#f5a623', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{user?.role}</div>
            </div>
          </div>
          {[['Name', user?.name], ['Email', user?.email], ['Role', 'Administrator'], ['API URL', 'http://localhost:5000/api']].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--gray-100)', fontSize: '0.875rem', transition: 'all 0.3s ease' }}>
              <span style={{ color: 'var(--gray-500)', fontWeight: 500 }}>{label}</span>
              <span style={{ color: 'var(--gray-800)', fontWeight: 600 }}>{val}</span>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
