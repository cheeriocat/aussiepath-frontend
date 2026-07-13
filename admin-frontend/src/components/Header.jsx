import React, { useState, useEffect } from 'react';
import { FiSearch, FiBell, FiMapPin, FiChevronDown, FiSun, FiMoon, FiMenu } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Header({ title = 'Migration Hub', subtitle = '31 Lakeside, Victoria' }) {
  const { user } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const notifications = [
    { id: 1, text: 'New application from Grace Davies', time: '2m ago', unread: true },
    { id: 2, text: 'Documents uploaded by Mikael Ferreira', time: '15m ago', unread: true },
    { id: 3, text: 'Chris Topalian status updated', time: '1h ago', unread: false },
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'var(--white)', height: 'var(--header-h)',
      borderBottom: '1px solid var(--gray-100)',
      display: 'flex', alignItems: 'center',
      padding: '0 28px', gap: 20,
      boxShadow: '0 1px 6px rgba(0,0,0,.06)',
      transition: 'all 0.3s ease',
    }}>
      {/* Mobile Hamburger Menu Trigger */}
      <button className="admin-menu-toggle" onClick={() => document.body.classList.toggle('sidebar-open')} style={{
        background: 'var(--gray-50)', border: '1.5px solid var(--gray-100)',
        borderRadius: 8, width: 36, height: 36, display: 'none', alignItems: 'center', justifyContent: 'center',
        color: 'var(--gray-600)', cursor: 'pointer', flexShrink: 0
      }}>
        <FiMenu size={18} />
      </button>

      {/* Title */}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy)', lineHeight: 1 }}>{title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2, color: 'var(--gray-500)', fontSize: '0.78rem' }}>
          <FiMapPin size={11} />{subtitle}
        </div>
      </div>

      {/* Search */}
      <div className="admin-search-container" style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'var(--gray-50)', border: searchFocused ? '1.5px solid #f5a623' : '1.5px solid var(--gray-100)',
        borderRadius: 10, padding: '9px 16px', width: searchFocused ? 380 : 260,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <FiSearch size={15} color='var(--gray-400)' />
        <input
          placeholder="Search applicants..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={{
            background: 'transparent', border: 'none', outline: 'none',
            fontSize: '0.85rem', color: 'var(--gray-700)', width: '100%',
          }}
        />
      </div>

      {/* Theme Toggle */}
      <button onClick={toggleTheme} style={{
        width: 38, height: 38, borderRadius: 10,
        background: 'var(--gray-50)', border: '1.5px solid var(--gray-100)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--gray-600)', transition: 'all .2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,166,35,.08)'; e.currentTarget.style.borderColor = '#f5a623'; e.currentTarget.style.color = '#f5a623'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--gray-50)'; e.currentTarget.style.borderColor = 'var(--gray-100)'; e.currentTarget.style.color = 'var(--gray-600)'; }}
      >
        {theme === 'light' ? <FiMoon size={17} /> : <FiSun size={17} />}
      </button>

      {/* Notifications */}
      <div className="admin-notifs-container" style={{ position: 'relative' }}>
        <button onClick={() => setNotifOpen(o => !o)} style={{
          position: 'relative', width: 38, height: 38, borderRadius: 10,
          background: 'var(--gray-50)', border: '1.5px solid var(--gray-100)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--gray-600)', transition: 'all .2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,166,35,.08)'; e.currentTarget.style.borderColor = '#f5a623'; e.currentTarget.style.color = '#f5a623'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--gray-50)'; e.currentTarget.style.borderColor = 'var(--gray-100)'; e.currentTarget.style.color = 'var(--gray-600)'; }}
        >
          <FiBell size={17} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: -4, right: -4,
              background: '#e74c3c', color: '#fff', fontSize: '0.65rem', fontWeight: 800,
              width: 16, height: 16, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #fff',
            }}>{unreadCount}</span>
          )}
        </button>

        {/* Dropdown */}
        {notifOpen && (
          <div style={{
            position: 'absolute', top: 46, right: 0, width: 300,
            background: 'var(--white)', borderRadius: 12, boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--gray-100)', zIndex: 200,
            animation: 'fadeInUp .2s ease',
          }}>
            <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--gray-800)' }}>Notifications</span>
              <span style={{ fontSize: '0.75rem', color: '#f5a623', fontWeight: 600, cursor: 'pointer' }}>Mark all read</span>
            </div>
            {notifications.map(n => (
              <div key={n.id} style={{
                padding: '12px 16px', borderBottom: '1px solid var(--gray-50)',
                background: n.unread ? 'rgba(245,166,35,.04)' : 'var(--white)',
                display: 'flex', gap: 10, cursor: 'pointer',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.unread ? '#f5a623' : 'transparent', flexShrink: 0, marginTop: 5 }} />
                <div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--gray-800)', lineHeight: 1.4 }}>{n.text}</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--gray-500)', marginTop: 3 }}>{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className="admin-profile-container" style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 10px', borderRadius: 10, transition: 'background .2s' }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <img
          src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
          alt="avatar"
          style={{ width: 34, height: 34, borderRadius: '50%', border: '2px solid #f5a623', background: '#e2e8f0' }}
        />
        <div className="admin-profile-info">
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gray-800)' }}>{user?.name || 'Admin User'}</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--gray-500)' }}>{user?.role || 'Administrator'}</div>
        </div>
        <FiChevronDown size={14} color='var(--gray-400)' className="admin-profile-chevron" />
      </div>
    </header>
  );
}
