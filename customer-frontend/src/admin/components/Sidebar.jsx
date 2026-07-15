import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FiHome, FiFileText, FiFolder, FiBriefcase, FiSettings, FiLogOut, FiGlobe } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { logout } = useAuth();

  const menuItems = [
    { icon: <FiHome size={18} />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <FiFileText size={18} />, label: 'Applications', path: '/admin/applications' },
    { icon: <FiFolder size={18} />, label: 'Documents', path: '/admin/documents' },
    { icon: <FiBriefcase size={18} />, label: 'Jobs Admin', path: '/admin/jobs' },
    { icon: <FiSettings size={18} />, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <aside style={{
      width: 'var(--sidebar-w)',
      background: '#0d1f3c',
      color: '#fff',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid rgba(255,255,255,.05)',
      boxShadow: '2px 0 10px rgba(0,0,0,.15)',
      transition: 'all 0.3s ease',
    }} className="admin-sidebar">
      {/* Brand */}
      <div style={{ height: 'var(--header-h)', display: 'flex', alignItems: 'center', padding: '0 24px', borderBottom: '1px solid rgba(255,255,255,.05)', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg,#f5a623,#e0941a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 900, color: '#0d1f3c',
        }}>A</div>
        <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-.3px' }}>AP Admin</span>
      </div>

      {/* Nav Menu */}
      <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {menuItems.map(item => (
          <NavLink
            key={item.label}
            to={item.path}
            onClick={() => document.body.classList.remove('sidebar-open')}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              borderRadius: 8,
              fontSize: '0.88rem',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#0d1f3c' : 'rgba(255,255,255,.65)',
              background: isActive ? '#f5a623' : 'transparent',
              transition: 'all .25s ease',
              boxShadow: isActive ? '0 4px 15px rgba(245,166,35,.3)' : 'none',
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.style.background.includes('f5a623')) {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.background = 'rgba(255,255,255,.04)';
              }
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.style.background.includes('f5a623')) {
                e.currentTarget.style.color = 'rgba(255,255,255,.65)';
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer Controls */}
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 6, borderTop: '1px solid rgba(255,255,255,.05)' }}>
        {/* Go back to Client Portal link */}
        <Link to="/" onClick={() => document.body.classList.remove('sidebar-open')} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 16px', borderRadius: 8, fontSize: '0.85rem',
          color: 'rgba(255,255,255,.65)', transition: 'all .2s'
        }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,.04)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,.65)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <FiGlobe size={18} />
          <span>Client Site</span>
        </Link>

        {/* Log Out button */}
        <button onClick={logout} style={{
          display: 'flex', alignItems: 'center', gap: 12, width: '100%',
          padding: '12px 16px', borderRadius: 8, fontSize: '0.85rem',
          color: '#ff6b6b', background: 'transparent', border: 'none',
          textAlign: 'left', cursor: 'pointer', transition: 'all .2s'
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,107,.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <FiLogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
