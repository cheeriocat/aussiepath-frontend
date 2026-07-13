import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiUsers, FiBriefcase, FiTrendingUp, FiChevronRight } from 'react-icons/fi';
import { getJobs } from '../services/api';
import JobCard from '../components/JobCard';
import EligibilityChecker from '../components/EligibilityChecker';

const HERO_BG = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [recentApps] = useState([
    { id: 1, company: 'HealthCare NSW', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=HN&backgroundColor=0d6efd', status: 'Under Review', statusColor: '#3498db', occupation: 'Registered Nurse' },
    { id: 2, company: 'Amazon Australia', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=AA&backgroundColor=ff9900', status: 'Active', statusColor: '#27ae60', occupation: 'Software Engineer' },
  ]);

  useEffect(() => {
    getJobs({ featured: 'true', limit: 3 })
      .then(r => setJobs(r.data.data))
      .catch(() => {})
      .finally(() => setLoadingJobs(false));

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      {/* ─── Hero ──────────────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative', height: '100vh', minHeight: 600,
        overflow: 'hidden',
        display: 'flex', alignItems: 'center',
      }}>
        {/* Background Image with parallax/zoom animation */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          transform: `scale(${1 + scrollY * 0.0005}) translateY(${scrollY * 0.15}px)`,
          transition: 'transform 0.1s ease-out',
          zIndex: 0,
        }} />

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg,rgba(10,25,50,.88) 55%,rgba(10,25,50,.35) 100%)',
          zIndex: 0,
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 620 }}>
            {/* Label */}
            <div className="animate-fadeInUp" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(245,166,35,.15)', border: '1px solid rgba(245,166,35,.3)',
              padding: '6px 16px', borderRadius: 20, marginBottom: 20,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f5a623' }} />
              <span style={{ color: '#f5a623', fontSize: '0.75rem', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                Expert Migration Consultancy
              </span>
            </div>

            {/* Heading */}
            <h1 className="animate-fadeInUp" style={{
              color: '#fff', fontSize: '3.4rem', fontWeight: 900, lineHeight: 1.1,
              marginBottom: 20, letterSpacing: '-1.5px',
              animationDelay: '.1s',
            }}>
              Your Professional<br />Journey to Australia<br />
              <span style={{ color: '#f5a623' }}>Starts Here.</span>
            </h1>

            <p className="animate-fadeInUp" style={{
              color: 'rgba(255,255,255,.75)', fontSize: '1.05rem', lineHeight: 1.7,
              marginBottom: 32, animationDelay: '.2s', maxWidth: 500,
            }}>
              Transparent, efficient and passionate pathways management for skilled professionals from all around the world of opportunity.
            </p>

            {/* Buttons */}
            <div className="animate-fadeInUp" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48, animationDelay: '.3s' }}>
              <Link to="/eligibility" className="btn-primary" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>
                Apply Now <FiArrowRight size={16} />
              </Link>
              <Link to="/jobs" style={{ padding: '14px 28px', fontSize: '0.95rem', border: '1.5px solid #fff', color: '#fff', background: 'transparent', borderRadius: '8px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                View Opportunities
              </Link>
            </div>

            {/* Stats */}
            <div className="animate-fadeInUp" style={{ display: 'flex', gap: 24, animationDelay: '.4s' }}>
              {[
                { icon: <FiUsers size={18} />, value: '895', label: 'Australian Paths', color: '#f5a623' },
                { icon: <FiCheckCircle size={18} />, value: '124', label: 'Eligible Paths', color: '#27ae60' },
              ].map(s => (
                <div key={s.label} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'rgba(255,255,255,.08)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,.12)', borderRadius: 12,
                  padding: '12px 18px',
                }}>
                  <div style={{ color: s.color }}>{s.icon}</div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1 }}>{s.value}</div>
                    <div style={{ color: 'rgba(255,255,255,.6)', fontSize: '0.75rem', marginTop: 2 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Eligibility Checker ────────────────────────────────────────────── */}
      <EligibilityChecker />

      {/* ─── Latest Opportunities ───────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--gray-50)' }}>
        <div className="container">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36 }}>
            <div>
              <span className="section-label">OPPORTUNITIES</span>
              <h2 className="section-title">Latest Opportunities in Australia</h2>
              <p className="section-subtitle">Explore roles specifically curated for efficient visa sponsorship</p>
            </div>
            <Link to="/jobs" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              color: 'var(--navy)', fontWeight: 700, fontSize: '0.875rem',
              padding: '10px 18px', borderRadius: 8,
              border: '1.5px solid var(--navy)', transition: 'all .2s',
              whiteSpace: 'nowrap', marginTop: 24,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--navy)'; e.currentTarget.style.color = 'var(--white)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--navy)'; }}
            >Browse All 81,024 Jobs <FiChevronRight size={16} /></Link>
          </div>

          {/* Job Cards Grid */}
          {loadingJobs ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ background: '#fff', borderRadius: 14, height: 320, border: '1px solid #e2e8f0', animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
              {jobs.map((job, i) => <JobCard key={job.id} job={job} style={{ animationDelay: `${i * .1}s` }} />)}
            </div>
          )}
        </div>
      </section>

      {/* ─── Quick Manage ───────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--white)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            {/* Left */}
            <div>
              <span className="section-label">DASHBOARD</span>
              <h2 className="section-title" style={{ marginBottom: 16 }}>Quick Manage</h2>
              <p style={{ color: '#64748b', lineHeight: 1.8, marginBottom: 28, fontSize: '0.95rem' }}>
                Keep track of your online applications and never miss a beat. Stay organised and plan your life efficiently.
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {['Track all applications in real-time', 'Get notified on status changes instantly', 'Upload and manage your documents securely', 'Connect directly with your migration agent'].map(item => (
                  <li key={item} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: '0.9rem', color: '#334155' }}>
                    <FiCheckCircle size={18} color='#27ae60' style={{ flexShrink: 0, marginTop: 2 }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/eligibility" className="btn-primary" style={{ marginTop: 32, display: 'inline-flex' }}>
                Get Started <FiArrowRight size={16} />
              </Link>
            </div>

            {/* Right – Recent Applications */}
            <div>
              <div style={{ background: 'var(--gray-50)', borderRadius: 16, padding: 24, border: '1px solid var(--gray-100)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--navy)' }}>Recent Applications</h3>
                  <Link to="/jobs" style={{ fontSize: '0.8rem', color: '#f5a623', fontWeight: 600 }}>View All</Link>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {recentApps.map(app => (
                    <div key={app.id} style={{
                      background: 'var(--white)', borderRadius: 12, padding: '14px 16px',
                      border: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', gap: 14,
                      boxShadow: '0 1px 4px rgba(0,0,0,.05)',
                    }}>
                      <img src={app.logo} alt={app.company} style={{ width: 42, height: 42, borderRadius: 10, border: '1px solid var(--gray-100)' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy)' }}>{app.company}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{app.occupation}</div>
                      </div>
                      <span style={{
                        padding: '4px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700,
                        background: app.statusColor === '#27ae60' ? 'rgba(39,174,96,.1)' : 'rgba(52,152,219,.1)',
                        color: app.statusColor,
                      }}>{app.status}</span>
                    </div>
                  ))}
                </div>

                {/* Progress indicator */}
                <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(245,166,35,.08)', borderRadius: 10, border: '1px solid rgba(245,166,35,.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.8rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--navy)' }}>Application Progress</span>
                    <span style={{ fontWeight: 700, color: '#f5a623' }}>65%</span>
                  </div>
                  <div style={{ background: '#e2e8f0', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                    <div style={{ width: '65%', height: '100%', background: 'linear-gradient(90deg,#f5a623,#fbb740)', borderRadius: 4, transition: 'width 1s ease' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─────────────────────────────────────────────────────── */}
      <section style={{
        padding: '72px 0',
        background: 'linear-gradient(135deg,#0d1f3c 0%,#1a2d5a 100%)',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontSize: '2.2rem', fontWeight: 900, marginBottom: 14, letterSpacing: '-0.5px' }}>
            Ready to Start Your Australian Journey?
          </h2>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '1rem', marginBottom: 32 }}>
            Join thousands of skilled professionals who have made Australia their home.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/eligibility" className="btn-primary" style={{ padding: '14px 32px', fontSize: '0.95rem' }}>
              Check My Eligibility <FiArrowRight size={16} />
            </Link>
            <Link to="/jobs" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              color: '#fff', border: '2px solid rgba(255,255,255,.3)',
              padding: '14px 32px', borderRadius: 8, fontWeight: 600, fontSize: '0.95rem',
              transition: 'all .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.08)'; e.currentTarget.style.borderColor = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.3)'; }}
            >Browse Jobs <FiChevronRight size={16} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
