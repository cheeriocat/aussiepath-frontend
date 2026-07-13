import React, { useState } from 'react';
import { checkEligibility } from '../services/api';
import { FiLoader, FiCheckCircle, FiAlertCircle, FiChevronRight } from 'react-icons/fi';

const occupations = ['Registered Nurse','Software Engineer','Civil Engineer','Accountant','Project Manager','Teacher','Chef','Electrician','Plumber','Doctor','Dentist','Pharmacist'];
const englishLevels = ['Competent','Proficient','Superior'];
const experienceOptions = ['0','1','3','5','8'];
const qualifications = ['Trade Qualification','Diploma',"Bachelor's Degree","Master's Degree","Doctorate"];

export default function EligibilityChecker() {
  const [form, setForm] = useState({
    occupation: '', englishLevel: 'Proficient', yearsOfExperience: '3',
    qualification: "Bachelor's Degree", age: '30',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('check');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.occupation) { setError('Please select your occupation'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const { data } = await checkEligibility(form);
      setResult(data.data);
    } catch {
      setError('Failed to calculate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 8,
    border: '1.5px solid var(--gray-100)', fontSize: '0.9rem', color: 'var(--gray-700)',
    background: 'var(--white)', outline: 'none', appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2394a3b8' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
    transition: 'border-color .2s, background 0.3s ease, color 0.3s ease',
    cursor: 'pointer',
  };

  return (
    <section id="eligibility-checker" style={{ padding: '80px 0', background: 'var(--off-white)', transition: 'background 0.3s ease' }}>
      <div className="container" style={{ maxWidth: 780 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span className="section-label">POINTS ASSESSMENT</span>
          <h2 className="section-title" style={{ fontSize: '2rem', color: 'var(--navy)' }}>Check Your Eligibility</h2>
          <p className="section-subtitle" style={{ color: 'var(--gray-600)' }}>Get a preliminary assessment of your migration points in less than 2 minutes</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'var(--gray-50)', borderRadius: 10, padding: 4, width: 'fit-content', margin: '0 auto 28px', transition: 'background 0.3s ease' }}>
          {[['check', 'Check Eligibility'], ['about', 'What is it?']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '9px 22px', borderRadius: 7, fontWeight: 600, fontSize: '0.875rem',
              background: activeTab === key ? 'var(--navy)' : 'transparent',
              color: activeTab === key ? 'var(--white)' : 'var(--gray-600)',
              transition: 'all .2s',
            }}>{label}</button>
          ))}
        </div>

        {activeTab === 'about' ? (
          <div style={{ background: 'var(--gray-50)', borderRadius: 14, padding: 32, border: '1px solid var(--gray-100)', transition: 'background 0.3s ease, border-color 0.3s ease' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 12, color: 'var(--navy)' }}>Australian Points Test</h3>
            <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, fontSize: '0.9rem' }}>
              The Australian points test is used for skilled migration visas (subclass 189, 190, 491). You need a minimum of <strong>65 points</strong> to be eligible to apply. Points are awarded for age, English ability, skilled employment, educational qualifications, and other factors.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 20 }}>
              {[['Occupation', '60 pts'], ['Age (25-32)', '30 pts'], ['English (Superior)', '20 pts'], ['Qualification (Masters)', '15 pts'], ['Experience (8+ yrs)', '20 pts']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--white)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--gray-100)', fontSize: '0.85rem', transition: 'background 0.3s ease, border-color 0.3s ease' }}>
                  <span style={{ color: 'var(--gray-600)' }}>{k}</span>
                  <span style={{ fontWeight: 700, color: 'var(--gold)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Form */}
            <div style={{ background: 'var(--gray-50)', borderRadius: 16, padding: 32, border: '1px solid var(--gray-100)', transition: 'background 0.3s ease, border-color 0.3s ease' }}>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                  {/* Occupation */}
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 6 }}>Primary Occupation</label>
                    <select name="occupation" value={form.occupation} onChange={handleChange} style={selectStyle}>
                      <option value="">Select occupation...</option>
                      {occupations.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>

                  {/* English */}
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 6 }}>English Proficiency (IELTS/PTE)</label>
                    <select name="englishLevel" value={form.englishLevel} onChange={handleChange} style={selectStyle}>
                      {englishLevels.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>

                  {/* Experience */}
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 6 }}>Years of Experience</label>
                    <select name="yearsOfExperience" value={form.yearsOfExperience} onChange={handleChange} style={selectStyle}>
                      {experienceOptions.map(y => <option key={y} value={y}>{y === '0' ? 'Less than 1 year' : y === '1' ? '1-2 years' : y === '3' ? '3-4 years' : y === '5' ? '5-7 years' : '8+ years'}</option>)}
                    </select>
                  </div>

                  {/* Qualification */}
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 6 }}>Highest Qualification</label>
                    <select name="qualification" value={form.qualification} onChange={handleChange} style={selectStyle}>
                      {qualifications.map(q => <option key={q}>{q}</option>)}
                    </select>
                  </div>

                  {/* Age */}
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 6 }}>Age</label>
                    <select name="age" value={form.age} onChange={handleChange} style={selectStyle}>
                      {Array.from({ length: 27 }, (_, i) => i + 18).map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                </div>

                {error && (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, marginBottom: 16, color: '#dc2626', fontSize: '0.875rem' }}>
                    <FiAlertCircle size={16} />{error}
                  </div>
                )}

                <button type="submit" disabled={loading} style={{
                  width: '100%', background: loading ? '#e0941a' : 'var(--gold)', color: '#0d1f3c',
                  padding: '14px', borderRadius: 10, fontWeight: 800, fontSize: '1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all .2s', boxShadow: '0 4px 14px rgba(245,166,35,.3)',
                }}>
                  {loading ? <><FiLoader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Calculating...</> : <>Calculate Points <FiChevronRight size={18} /></>}
                </button>
              </form>
            </div>

            {/* Result */}
            {result && (
              <div className="animate-fadeInUp" style={{
                marginTop: 24, borderRadius: 14, padding: 28,
                background: result.eligible ? 'linear-gradient(135deg,#f0fdf4,#dcfce7)' : 'linear-gradient(135deg,#fffbeb,#fef3c7)',
                border: `2px solid ${result.eligible ? '#86efac' : '#fcd34d'}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  {result.eligible
                    ? <FiCheckCircle size={28} color='#16a34a' />
                    : <FiAlertCircle size={28} color='#d97706' />}
                  <div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: result.eligible ? '#15803d' : '#b45309', lineHeight: 1 }}>
                      {result.total} <span style={{ fontSize: '1rem', fontWeight: 600 }}>points</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: result.eligible ? '#15803d' : '#92400e', marginTop: 4 }}>{result.message}</p>
                  </div>
                </div>

                {/* Breakdown */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  {result.breakdown.filter(b => b.points > 0).map(b => (
                    <div key={b.category} style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--white)', padding: '8px 12px', borderRadius: 8, fontSize: '0.82rem', border: '1px solid var(--gray-100)' }}>
                      <span style={{ color: 'var(--gray-600)' }}>{b.category}</span>
                      <span style={{ fontWeight: 700, color: 'var(--navy)' }}>+{b.points}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
