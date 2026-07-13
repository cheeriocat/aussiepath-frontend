import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { RiDashboardLine, RiFileList3Line, RiFolderLine, RiBriefcaseLine, RiSettingsLine, RiAddLine, RiLogoutBoxLine } from 'react-icons/ri';
import { FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: <RiDashboardLine size={20} />, label: 'Dashboard' },
  { to: '/applications', icon: <RiFileList3Line size={20} />, label: 'Applications' },
  { to: '/documents', icon: <RiFolderLine size={20} />, label: 'Documents' },
  { to: '/jobs', icon: <RiBriefcaseLine size={20} />, label: 'Jobs' },
  { to: '/settings', icon: <RiSettingsLine size={20} />, label: 'Settings' },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  // Close sidebar on mobile when path changes
  React.useEffect(() => {
    document.body.classList.remove('sidebar-open');
  }, [location.pathname]);

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, bottom: 0, width: 'var(--sidebar-w)',
      background: 'var(--navy-side)',
      display: 'flex', flexDirection: 'column',
      zIndex: 100,
      borderRight: '1px solid rgba(255,255,255,.06)',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg,#f5a623,#e0941a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 18, color: '#0d1f3c',
            }}>A</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem', lineHeight: 1 }}>AussiePath</div>
              <div style={{ color: 'rgba(255,255,255,.4)', fontSize: '0.68rem', marginTop: 2 }}>Admin Console</div>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          <button className="sidebar-close-btn" onClick={() => document.body.classList.remove('sidebar-open')} style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
            cursor: 'pointer', display: 'none', padding: 4
          }}>
            <FiX size={18} />
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: 1.5, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', padding: '8px 10px', marginBottom: 4 }}>Main</div>
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '11px 14px', borderRadius: 10, marginBottom: 2,
            color: isActive ? '#fff' : 'rgba(255,255,255,.55)',
            background: isActive ? 'linear-gradient(90deg,rgba(245,166,35,.2),rgba(245,166,35,.05))' : 'transparent',
            borderLeft: isActive ? '3px solid #f5a623' : '3px solid transparent',
            fontWeight: isActive ? 600 : 400,
            fontSize: '0.875rem',
            transition: 'all .2s',
            textDecoration: 'none',
          })}>
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px 10px 16px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
        {/* New Application */}
        <button onClick={() => navigate('/applications')} style={{
          width: '100%', background: '#f5a623', color: '#0d1f3c',
          padding: '11px', borderRadius: 10, fontWeight: 700, fontSize: '0.85rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          marginBottom: 8, transition: 'all .2s', border: 'none', outline: 'none',
          cursor: 'pointer'
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#e0941a'}
          onMouseLeave={e => e.currentTarget.style.background = '#f5a623'}
        >
          <RiAddLine size={18} /> New Application
        </button>

        {/* Logout */}
        <button onClick={handleLogout} style={{
          width: '100%', background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.55)',
          padding: '10px', borderRadius: 10, fontSize: '0.82rem', fontWeight: 500,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'all .2s', border: 'none', outline: 'none', cursor: 'pointer'
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(231,76,60,.15)'; e.currentTarget.style.color = '#e74c3c'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.06)'; e.currentTarget.style.color = 'rgba(255,255,255,.55)'; }}
        >
          <RiLogoutBoxLine size={16} /> Log Out
        </button>
      </div>
    </aside>
  );
}
