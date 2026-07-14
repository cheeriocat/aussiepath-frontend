import React, { useState, useEffect } from 'react';
import EligibilityChecker from '../components/EligibilityChecker';
import { FiInfo, FiCheckCircle, FiClock, FiStar } from 'react-icons/fi';

const steps = [
  { icon: <FiCheckCircle size={24} />, title: 'Check Your Points', desc: 'Use our calculator to see if you meet the 65-point threshold for skilled migration.', color: '#f5a623' },
  { icon: <FiInfo size={24} />, title: 'Skills Assessment', desc: 'Have your qualifications and experience assessed by the relevant Australian authority.', color: '#3498db' },
  { icon: <FiClock size={24} />, title: 'Lodge Expression of Interest', desc: 'Submit your EOI through SkillSelect and wait for an invitation to apply.', color: '#27ae60' },
  { icon: <FiStar size={24} />, title: 'Receive Visa & Migrate', desc: 'Once invited, lodge your visa application and prepare for your Australian journey.', color: '#9b59b6' },
];

export default function Eligibility() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activeVisaIndex, setActiveVisaIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStepsScroll = (e) => {
    if (!isMobile) return;
    const scrollLeft = e.target.scrollLeft;
    const itemWidth = e.target.clientWidth * 0.82 + 16;
    const index = Math.round(scrollLeft / itemWidth);
    setActiveStepIndex(index);
  };

  const handleVisaScroll = (e) => {
    if (!isMobile) return;
    const scrollLeft = e.target.scrollLeft;
    const itemWidth = e.target.clientWidth * 0.82 + 16;
    const index = Math.round(scrollLeft / itemWidth);
    setActiveVisaIndex(index);
  };

  return (
    <div style={{ paddingTop: 68, background: 'var(--off-white)', minHeight: '100vh', transition: 'all 0.3s ease' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0d1f3c,#1a2d5a)', padding: '60px 0 50px', textAlign: 'center' }}>
        <div className="container">
          <span style={{ color: '#f5a623', fontSize: '0.75rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>ELIGIBILITY CHECK</span>
          <h1 style={{ color: '#fff', fontSize: '2.6rem', fontWeight: 900, marginTop: 8, marginBottom: 12 }}>Australian Points Test</h1>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '1rem', maxWidth: 500, margin: '0 auto' }}>Check if you have enough points to apply for Australia's skilled migration program</p>
        </div>
      </div>

      {/* Steps */}
      <div style={{ background: 'var(--white)', padding: '56px 0', borderBottom: '1px solid var(--gray-100)', transition: 'all 0.3s ease' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: '1.6rem', color: 'var(--navy)', marginBottom: 40 }}>How the Process Works</h2>
          <div className="mobile-swipe-list" onScroll={handleStepsScroll} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 24 }}>
            {steps.map((s, i) => (
              <div 
                className="mobile-swipe-item" 
                key={i} 
                style={{
                  background: 'var(--gray-50)', borderRadius: 14, padding: 24,
                  border: '1px solid var(--gray-100)', textAlign: 'center',
                  transition: 'all .25s, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
                  transform: isMobile && activeStepIndex === i ? 'scale(1)' : isMobile ? 'scale(0.93)' : 'scale(1)',
                  opacity: isMobile && activeStepIndex !== i ? 0.85 : 1,
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = isMobile && activeStepIndex === i ? 'scale(1)' : isMobile ? 'scale(0.93)' : 'scale(0)'; }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: s.color, background: `${s.color}15` }}>
                  {s.icon}
                </div>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: s.color, color: '#fff', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>{i + 1}</div>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy)', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--gray-500)', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Checker embedded */}
      <EligibilityChecker />

      {/* Visa types info */}
      <div style={{ background: 'var(--white)', padding: '60px 0', borderTop: '1px solid var(--gray-100)', transition: 'all 0.3s ease' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: '1.6rem', color: 'var(--navy)', marginBottom: 8 }}>Common Skilled Visa Types</h2>
          <p style={{ textAlign: 'center', color: 'var(--gray-500)', marginBottom: 36 }}>Understanding which visa suits your circumstances</p>
          <div className="mobile-swipe-list" onScroll={handleVisaScroll} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
            {[
              { code: '189', name: 'Skilled Independent', desc: 'Points-tested visa for skilled workers not sponsored by an employer or family member.', points: '65+', pr: true },
              { code: '190', name: 'Skilled Nominated', desc: 'Points-tested visa for skilled workers nominated by a state or territory government.', points: '65+', pr: true },
              { code: '482', name: 'Temporary Skill Shortage', desc: 'Employer-sponsored visa allowing skilled workers to live and work in Australia temporarily.', points: 'N/A', pr: false },
            ].map((v, i) => (
              <div 
                className="mobile-swipe-item" 
                key={v.code} 
                style={{ 
                  borderRadius: 14, padding: 24, border: '1px solid var(--gray-100)', background: 'var(--gray-50)',
                  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
                  transform: isMobile && activeVisaIndex === i ? 'scale(1)' : isMobile ? 'scale(0.93)' : 'scale(1)',
                  opacity: isMobile && activeVisaIndex !== i ? 0.85 : 1,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontWeight: 900, fontSize: '1.3rem', color: '#f5a623' }}>Subclass {v.code}</span>
                  {v.pr && <span style={{ padding: '3px 10px', background: 'rgba(39,174,96,.15)', color: '#27ae60', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700 }}>PR Pathway</span>}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--navy)', marginBottom: 8 }}>{v.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: 12 }}>{v.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--gray-400)' }}>Min. Points Required:</span>
                  <span style={{ fontWeight: 700, color: 'var(--navy)' }}>{v.points}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
