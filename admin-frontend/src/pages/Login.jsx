import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLoader } from 'react-icons/fi';

export default function Login() {
  const [form, setForm] = useState({ email: 'admin@aussiepath.com.au', password: 'admin123' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Try admin@aussiepath.com.au / admin123');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (icon) => ({
    width: '100%', padding: '12px 14px 12px 42px', borderRadius: 9,
    border: '1.5px solid #e2e8f0', fontSize: '0.9rem', color: '#334155',
    outline: 'none', transition: 'border-color .2s', background: '#f8fafc',
  });

  return (
    <div className="login-page" style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg,#0b1a30 0%,#1a2d5a 60%,#0d1f3c 100%)',
    }}>
      {/* Left decorative panel */}
      <div className="login-hero" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#f5a623,#e0941a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 22, color: '#0d1f3c' }}>A</div>
          <span style={{ fontWeight: 800, fontSize: '1.3rem' }}>AussiePath</span>
        </div>

        <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#f5a623', marginBottom: 16 }}>MIGRATION HUB</div>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1.15, marginBottom: 20, letterSpacing: '-1px' }}>
          Manage Migration<br />
          <span style={{ color: '#f5a623' }}>Applications</span><br />
          with Confidence
        </h1>
        <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 380 }}>
          Your comprehensive dashboard for tracking visa applications, managing documents, and monitoring job placements across Australia.
        </p>

        {/* Stats preview */}
        <div className="login-stats" style={{ display: 'flex', gap: 20, marginTop: 40 }}>
          {[['1,284', 'Applicants'], ['156', 'Active Jobs'], ['892', 'Successes']].map(([v, l]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,.08)', borderRadius: 12, padding: '14px 20px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.1)' }}>
              <div style={{ fontWeight: 900, fontSize: '1.4rem', color: '#f5a623' }}>{v}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,.55)', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Login Form */}
      <div className="login-panel" style={{ width: 460, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'rgba(255,255,255,.03)', backdropFilter: 'blur(20px)', borderLeft: '1px solid rgba(255,255,255,.08)' }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <div className="login-card" style={{ background: '#fff', borderRadius: 20, padding: 36, boxShadow: '0 24px 60px rgba(0,0,0,.3)' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#0d1f3c', marginBottom: 4 }}>Welcome back</h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: 28 }}>Sign in to your admin account</p>

            {/* Demo Hint */}
            <div style={{ background: 'rgba(245,166,35,.08)', border: '1px solid rgba(245,166,35,.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: '0.78rem', color: '#b45309' }}>
              <strong>Demo:</strong> admin@aussiepath.com.au / admin123
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Email */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 6 }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <FiMail size={16} color='#94a3b8' style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    style={inputStyle()}
                    onFocus={e => e.target.style.borderColor = '#f5a623'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 6 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <FiLock size={16} color='#94a3b8' style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    style={{ ...inputStyle(), paddingRight: 44 }}
                    onFocus={e => e.target.style.borderColor = '#f5a623'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    required
                  />
                  <button type="button" onClick={() => setShowPw(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>
                    {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', color: '#dc2626', fontSize: '0.82rem' }}>{error}</div>
              )}

              <button type="submit" disabled={loading} style={{
                background: loading ? '#e0941a' : '#f5a623', color: '#0d1f3c',
                padding: '13px', borderRadius: 9, fontWeight: 800, fontSize: '0.95rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 14px rgba(245,166,35,.3)', transition: 'all .2s',
              }}>
                {loading ? <><FiLoader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Signing in...</> : 'Sign In to Dashboard'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.8rem', color: '#94a3b8' }}>
              Customer portal? <a href="http://localhost:3000" style={{ color: '#f5a623', fontWeight: 600 }}>Visit AussiePath</a>
            </p>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}
