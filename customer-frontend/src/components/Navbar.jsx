import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSearch, FiBell, FiUser, FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [searchFocused, setSearchFocused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const isActive = path => location.pathname === path;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(13,31,60,.98)' : 'rgba(13,31,60,.92)',
      backdropFilter: 'blur(12px)',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,.3)' : 'none',
      transition: 'all .3s ease',
      borderBottom: '1px solid rgba(255,255,255,.08)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: 68, gap: 24, justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: 'linear-gradient(135deg,#f5a623,#e0941a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 900, color: '#0d1f3c',
          }}>A</div>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-.3px' }}>
            AussiePath
          </span>
        </Link>

        {/* Nav Links */}
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {[
            ['/', 'Home'],
            ['/jobs', 'Jobs'],
            ['/eligibility', 'Eligibility'],
            ...(isAdmin ? [[import.meta.env.VITE_ADMIN_URL || 'http://localhost:3001/dashboard', 'Admin Panel']] : []),
          ].map(([href, label]) => {
            const external = href.startsWith('http');
            const Tag = external ? 'a' : Link;
            const props = external ? { href, target: '_blank', rel: 'noopener noreferrer' } : { to: href };
            return (
              <Tag key={label} {...props} style={{
                color: isActive(href) ? '#f5a623' : 'rgba(255,255,255,.85)',
                fontWeight: isActive(href) ? 700 : 500,
                fontSize: '0.9rem',
                padding: '8px 14px',
                borderRadius: 6,
                transition: 'all .2s',
                background: isActive(href) ? 'rgba(245,166,35,.1)' : 'transparent',
                width: menuOpen ? '100%' : 'auto',
                display: 'block'
              }}
                onMouseEnter={e => { e.currentTarget.style.color = '#f5a623'; e.currentTarget.style.background = 'rgba(245,166,35,.08)'; }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = isActive(href) ? '#f5a623' : 'rgba(255,255,255,.85)';
                  e.currentTarget.style.background = isActive(href) ? 'rgba(245,166,35,.1)' : 'transparent';
                }}
              >{label}</Tag>
            );
          })}

          {/* Mobile Auth Panel */}
          <div className="nav-auth-mobile" style={{ display: 'none', width: '100%', borderTop: '1px solid rgba(255,255,255,.08)', marginTop: 8, paddingTop: 16 }}>
            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ color: 'rgba(255,255,255,.6)', fontSize: '0.82rem', padding: '0 14px' }}>Logged in as: <strong style={{ color: '#fff' }}>{user.name}</strong></div>
                <button onClick={logout} style={{
                  background: 'rgba(231,76,60,0.15)', border: '1px solid #e74c3c',
                  color: '#e74c3c', padding: '10px 14px', borderRadius: 8,
                  fontWeight: 600, fontSize: '0.85rem', width: '100%',
                  cursor: 'pointer'
                }}>Log Out</button>
              </div>
            ) : (
              <Link to="/login" style={{
                background: 'var(--gold)', color: '#0d1f3c', padding: '10px 14px', borderRadius: 8,
                fontWeight: 700, fontSize: '0.85rem', display: 'block', textAlign: 'center',
              }}>Login / Sign In</Link>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Search */}
          <div className="nav-search-container" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,.08)', border: searchFocused ? '1px solid #f5a623' : '1px solid rgba(255,255,255,.12)',
            borderRadius: 8, padding: '8px 14px', width: searchFocused ? 320 : 200,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <FiSearch size={15} color='rgba(255,255,255,.5)' />
            <input
              placeholder="Search..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                background: 'transparent', border: 'none', color: 'rgba(255,255,255,.85)',
                fontSize: '0.85rem', outline: 'none', width: '100%',
              }}
            />
          </div>

          {/* Icons (Hidden on small mobile screens to prevent clutter) */}
          <div className="nav-icons-desktop" style={{ display: 'flex', gap: 8 }}>
            {[FiBell, FiUser].map((Icon, i) => (
              <button key={i} style={{
                width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,.08)',
                border: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all .2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,166,35,.15)'; e.currentTarget.style.color = '#f5a623'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.08)'; e.currentTarget.style.color = 'rgba(255,255,255,.7)'; }}
              ><Icon size={16} /></button>
            ))}
          </div>

          {/* Theme Toggle */}
          <button onClick={toggleTheme} style={{
            width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,.08)',
            border: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all .2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,166,35,.15)'; e.currentTarget.style.color = '#f5a623'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.08)'; e.currentTarget.style.color = 'rgba(255,255,255,.7)'; }}
          >
            {theme === 'light' ? <FiMoon size={16} /> : <FiSun size={16} />}
          </button>

          {/* Sign In / Out */}
          <div className="nav-auth-desktop" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="nav-username" style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</span>
                <button onClick={logout} style={{
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff', padding: '8px 16px', borderRadius: 8,
                  fontWeight: 600, fontSize: '0.8rem', transition: 'all .2s',
                  cursor: 'pointer'
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(231,76,60,0.15)'; e.currentTarget.style.color = '#e74c3c'; e.currentTarget.style.borderColor = '#e74c3c'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                >Log Out</button>
              </div>
            ) : (
              <Link to="/login" style={{
                background: 'var(--gold)', color: '#0d1f3c', padding: '9px 20px', borderRadius: 8,
                fontWeight: 700, fontSize: '0.85rem', transition: 'all .2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#e0941a'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f5a623'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >Login / Sign In</Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} style={{
            width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,.08)',
            border: '1px solid rgba(255,255,255,.1)', color: '#fff',
            display: 'none', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer'
          }}>
            {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
