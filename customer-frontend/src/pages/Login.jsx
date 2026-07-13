import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLoader, FiAlertCircle } from 'react-icons/fi';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(form.email, form.password);
      if (data.success) {
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px 12px 42px',
    borderRadius: 8,
    border: '1.5px solid var(--gray-100)',
    fontSize: '0.9rem',
    color: 'var(--gray-800)',
    outline: 'none',
    transition: 'all 0.2s',
    background: 'var(--gray-50)',
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--off-white)',
      padding: '100px 24px 60px',
    }}>
      <div className="animate-fadeInUp" style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ background: 'var(--white)', borderRadius: 20, padding: 36, boxShadow: 'var(--shadow)', border: '1px solid var(--gray-100)', transition: 'all 0.3s ease' }}>
          {/* Logo / Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: 'linear-gradient(135deg,#f5a623,#e0941a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 22, color: '#0d1f3c',
              margin: '0 auto 12px',
            }}>A</div>
            <h2 style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--navy)', marginBottom: 4 }}>Login / Sign In</h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>Sign in to access your AussiePath dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Email */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 6 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail size={16} color='var(--gray-400)' style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#f5a623'}
                  onBlur={e => e.target.style.borderColor = 'var(--gray-100)'}
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock size={16} color='var(--gray-400)' style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={e => e.target.style.borderColor = '#f5a623'}
                  onBlur={e => e.target.style.borderColor = 'var(--gray-100)'}
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPw(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer', padding: 0 }}>
                  {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                display: 'flex', gap: 8, alignItems: 'center',
                padding: '10px 14px', background: 'rgba(231,76,60,0.1)',
                border: '1px solid rgba(231,76,60,0.2)', borderRadius: 8,
                color: '#e74c3c', fontSize: '0.82rem',
              }}>
                <FiAlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              background: loading ? '#e0941a' : '#f5a623', color: '#0d1f3c',
              padding: '13px', borderRadius: 9, fontWeight: 800, fontSize: '0.95rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 14px rgba(245,166,35,.3)', transition: 'all .2s',
              cursor: 'pointer', border: 'none', outline: 'none'
            }}>
              {loading ? <><FiLoader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Logging in...</> : 'Login / Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.85rem', color: 'var(--gray-500)' }}>
            Don't have an account? <Link to="/register" style={{ color: '#f5a623', fontWeight: 600 }}>Register here</Link>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}
