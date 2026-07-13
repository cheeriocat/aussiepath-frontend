import React from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { RiSettingsLine } from 'react-icons/ri';

export default function Settings() {
  const { user } = useAuth();
  return (
    <>
      <Header title="Settings" subtitle="Account & system settings" />
      <main className="admin-main">
        <div className="card" style={{ padding: 32, maxWidth: 560 }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.15rem', color: '#0d1f3c', marginBottom: 20 }}>Account Settings</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, padding: '16px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <img src={user?.avatar} alt="" style={{ width: 56, height: 56, borderRadius: '50%', border: '3px solid #f5a623' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0d1f3c' }}>{user?.name}</div>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{user?.email}</div>
              <div style={{ fontSize: '0.72rem', color: '#f5a623', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{user?.role}</div>
            </div>
          </div>
          {[['Name', user?.name], ['Email', user?.email], ['Role', 'Administrator'], ['API URL', 'http://localhost:5000/api']].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f4f8', fontSize: '0.875rem' }}>
              <span style={{ color: '#64748b', fontWeight: 500 }}>{label}</span>
              <span style={{ color: '#1e293b', fontWeight: 600 }}>{val}</span>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
