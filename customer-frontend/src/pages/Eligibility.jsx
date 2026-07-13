import React from 'react';
import EligibilityChecker from '../components/EligibilityChecker';
import { FiInfo, FiCheckCircle, FiClock, FiStar } from 'react-icons/fi';

const steps = [
  { icon: <FiCheckCircle size={24} />, title: 'Check Your Points', desc: 'Use our calculator to see if you meet the 65-point threshold for skilled migration.', color: '#f5a623' },
  { icon: <FiInfo size={24} />, title: 'Skills Assessment', desc: 'Have your qualifications and experience assessed by the relevant Australian authority.', color: '#3498db' },
  { icon: <FiClock size={24} />, title: 'Lodge Expression of Interest', desc: 'Submit your EOI through SkillSelect and wait for an invitation to apply.', color: '#27ae60' },
  { icon: <FiStar size={24} />, title: 'Receive Visa & Migrate', desc: 'Once invited, lodge your visa application and prepare for your Australian journey.', color: '#9b59b6' },
];

export default function Eligibility() {
  return (
    <div style={{ paddingTop: 68, background: '#f0f4f8', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0d1f3c,#1a2d5a)', padding: '60px 0 50px', textAlign: 'center' }}>
        <div className="container">
          <span style={{ color: '#f5a623', fontSize: '0.75rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>ELIGIBILITY CHECK</span>
          <h1 style={{ color: '#fff', fontSize: '2.6rem', fontWeight: 900, marginTop: 8, marginBottom: 12 }}>Australian Points Test</h1>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '1rem', maxWidth: 500, margin: '0 auto' }}>Check if you have enough points to apply for Australia's skilled migration program</p>
        </div>
      </div>

      {/* Steps */}
      <div style={{ background: '#fff', padding: '56px 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: '1.6rem', color: '#0d1f3c', marginBottom: 40 }}>How the Process Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
            {steps.map((s, i) => (
              <div key={i} style={{
                background: '#f8fafc', borderRadius: 14, padding: 24,
                border: '1px solid #e2e8f0', textAlign: 'center',
                transition: 'all .25s',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: s.color, background: `${s.color}15` }}>
                  {s.icon}
                </div>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: s.color, color: '#fff', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>{i + 1}</div>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0d1f3c', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Checker embedded */}
      <EligibilityChecker />

      {/* Visa types info */}
      <div style={{ background: '#fff', padding: '60px 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: '1.6rem', color: '#0d1f3c', marginBottom: 8 }}>Common Skilled Visa Types</h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: 36 }}>Understanding which visa suits your circumstances</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {[
              { code: '189', name: 'Skilled Independent', desc: 'Points-tested visa for skilled workers not sponsored by an employer or family member.', points: '65+', pr: true },
              { code: '190', name: 'Skilled Nominated', desc: 'Points-tested visa for skilled workers nominated by a state or territory government.', points: '65+', pr: true },
              { code: '482', name: 'Temporary Skill Shortage', desc: 'Employer-sponsored visa allowing skilled workers to live and work in Australia temporarily.', points: 'N/A', pr: false },
            ].map(v => (
              <div key={v.code} style={{ borderRadius: 14, padding: 24, border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontWeight: 900, fontSize: '1.3rem', color: '#f5a623' }}>Subclass {v.code}</span>
                  {v.pr && <span style={{ padding: '3px 10px', background: 'rgba(39,174,96,.1)', color: '#27ae60', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700 }}>PR Pathway</span>}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#0d1f3c', marginBottom: 8 }}>{v.name}</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.7, marginBottom: 12 }}>{v.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: '#94a3b8' }}>Min. Points Required:</span>
                  <span style={{ fontWeight: 700, color: '#0d1f3c' }}>{v.points}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
