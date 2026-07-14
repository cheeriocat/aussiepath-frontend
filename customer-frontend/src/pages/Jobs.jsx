import React, { useEffect, useState } from 'react';
import { FiSearch, FiMapPin, FiFilter, FiChevronRight, FiLoader } from 'react-icons/fi';
import { getJobs, submitApplication } from '../services/api';
import JobCard from '../components/JobCard';

const jobTypes = ['All', 'Full Time', 'Part Time', 'Contract'];
const locations = ['All Locations', 'Melbourne, VIC', 'Sydney, NSW', 'Perth, WA', 'Brisbane, QLD'];

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({ applicantName: '', email: '', phone: '', nationality: '' });
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [search, locationFilter, typeFilter]);

  const fetchJobs = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (locationFilter !== 'All Locations') params.location = locationFilter;
    if (typeFilter !== 'All') params.type = typeFilter;
    getJobs(params)
      .then(r => setJobs(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleApply = async e => {
    e.preventDefault();
    setApplyLoading(true);
    try {
      await submitApplication({ ...applyForm, jobId: selectedJob.id, occupation: selectedJob.title });
      setApplySuccess(true);
    } catch { }
    finally { setApplyLoading(false); }
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 8, border: '1.5px solid var(--gray-100)',
    fontSize: '0.9rem', color: 'var(--gray-800)', background: 'var(--white)', outline: 'none',
    transition: 'all 0.2s',
  };

  return (
    <div style={{ paddingTop: 68, minHeight: '100vh', background: 'var(--off-white)', transition: 'all 0.3s ease' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0d1f3c,#1a2d5a)', padding: '56px 0 40px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{ color: '#f5a623', fontSize: '0.75rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>OPPORTUNITIES</span>
          <h1 style={{ color: '#fff', fontSize: '2.6rem', fontWeight: 900, marginTop: 8, marginBottom: 12 }}>Find Your Role in Australia</h1>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '1rem', maxWidth: 600, margin: '0 auto' }}>Employer-sponsored positions specifically curated for skilled migrants</p>

          {/* Search Bar */}
          <div className="jobs-search-bar" style={{ display: 'flex', gap: 12, maxWidth: 700, margin: '28px auto 0', background: 'var(--white)', borderRadius: 12, padding: 8, boxShadow: 'var(--shadow)', border: '1px solid var(--gray-100)', transition: 'all 0.3s ease' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px' }}>
              <FiSearch size={18} color='var(--gray-400)' />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Job title, company..." style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.95rem', width: '100%', color: 'var(--gray-800)' }} />
            </div>
            <div className="jobs-search-sep" style={{ width: 1, background: 'var(--gray-100)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px' }}>
              <FiMapPin size={18} color='var(--gray-400)' />
              <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: '0.9rem', color: 'var(--gray-800)', background: 'transparent', cursor: 'pointer' }}>
                {locations.map(l => <option key={l} style={{ background: 'var(--white)', color: 'var(--gray-800)' }}>{l}</option>)}
              </select>
            </div>
            <button className="jobs-search-btn" onClick={fetchJobs} style={{ background: '#f5a623', color: '#0d1f3c', padding: '10px 24px', borderRadius: 8, fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ padding: '32px 24px' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginRight: 4 }}><FiFilter size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Type:</span>
          {jobTypes.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} style={{
              padding: '7px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, transition: 'all .2s', cursor: 'pointer',
              background: typeFilter === t ? 'var(--navy)' : 'var(--white)',
              color: typeFilter === t ? 'var(--white)' : 'var(--gray-600)',
              border: `1.5px solid ${typeFilter === t ? 'var(--navy)' : 'var(--gray-100)'}`,
            }}>{t}</button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
            {loading ? 'Loading...' : `${jobs.length} jobs found`}
          </span>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
            <FiLoader size={32} color='#f5a623' style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray-400)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
            <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>No jobs found matching your search</p>
            <button onClick={() => { setSearch(''); setTypeFilter('All'); setLocationFilter('All Locations'); }} style={{ marginTop: 16, color: '#f5a623', fontWeight: 700, fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer' }}>Clear filters</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 24 }}>
            {jobs.map(job => (
              <div key={job.id} onClick={() => { setSelectedJob(job); setApplySuccess(false); }} style={{ cursor: 'pointer' }}>
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => { setSelectedJob(null); setShowApplyModal(false); setApplySuccess(false); }}>
          <div style={{ background: 'var(--white)', borderRadius: 20, maxWidth: 600, width: '100%', maxHeight: '85vh', overflow: 'auto', padding: 32, border: '1px solid var(--gray-100)', transition: 'all 0.3s ease' }} onClick={e => e.stopPropagation()}>
            {!showApplyModal ? (
              <>
                <div style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'center' }}>
                  <img src={selectedJob.companyLogo} alt="" style={{ width: 56, height: 56, borderRadius: 12, border: '1px solid var(--gray-100)' }} />
                  <div>
                    <h2 style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--navy)' }}>{selectedJob.title}</h2>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>{selectedJob.company} · {selectedJob.location}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                  <span style={{ padding: '4px 12px', borderRadius: 20, background: 'rgba(52,152,219,.15)', color: '#1a6ea8', fontSize: '0.78rem', fontWeight: 600 }}>{selectedJob.type}</span>
                  <span style={{ padding: '4px 12px', borderRadius: 20, background: 'rgba(39,174,96,.15)', color: '#1e7c47', fontSize: '0.78rem', fontWeight: 600 }}>{selectedJob.salary}</span>
                  {selectedJob.visaTypes.map(v => <span key={v} style={{ padding: '4px 12px', borderRadius: 20, background: 'rgba(245,166,35,.15)', color: '#c17d10', fontSize: '0.78rem', fontWeight: 600 }}>Visa {v}</span>)}
                </div>
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 8, color: 'var(--navy)' }}>About the Role</h4>
                  <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', lineHeight: 1.7 }}>{selectedJob.description}</p>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 8, color: 'var(--navy)' }}>Requirements</h4>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, listStyle: 'none' }}>
                    {selectedJob.requirements.map(r => (
                      <li key={r} style={{ display: 'flex', gap: 8, color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                        <FiChevronRight size={16} color='#f5a623' style={{ flexShrink: 0, marginTop: 2 }} />{r}
                      </li>
                    ))}
                  </ul>
                </div>
                <button onClick={() => setShowApplyModal(true)} style={{ width: '100%', background: '#f5a623', color: '#0d1f3c', padding: '14px', borderRadius: 10, fontWeight: 800, fontSize: '1rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
                  Apply for This Position
                </button>
              </>
            ) : applySuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎉</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--navy)', marginBottom: 8 }}>Application Submitted!</h3>
                <p style={{ color: 'var(--gray-600)', marginBottom: 24 }}>Our migration agents will review your profile and contact you within 2-3 business days.</p>
                <button onClick={() => { setSelectedJob(null); setShowApplyModal(false); setApplySuccess(false); }} style={{ background: '#f5a623', color: '#0d1f3c', padding: '12px 28px', borderRadius: 8, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <button onClick={() => setShowApplyModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--gray-500)', fontSize: '1.2rem', cursor: 'pointer' }}>←</button>
                  <h3 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--navy)' }}>Apply — {selectedJob.title}</h3>
                </div>
                <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[['Full Name', 'applicantName', 'text'], ['Email Address', 'email', 'email'], ['Phone Number', 'phone', 'tel'], ['Nationality', 'nationality', 'text']].map(([label, name, type]) => (
                    <div key={name}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 6 }}>{label}</label>
                      <input
                        type={type} required name={name} value={applyForm[name]}
                        onChange={e => setApplyForm(f => ({ ...f, [e.target.name]: e.target.value }))}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = '#f5a623'}
                        onBlur={e => e.target.style.borderColor = 'var(--gray-100)'}
                      />
                    </div>
                  ))}
                  <button type="submit" disabled={applyLoading} style={{ background: '#f5a623', color: '#0d1f3c', padding: '13px', borderRadius: 9, fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
                    {applyLoading ? <><FiLoader size={16} style={{ animation: 'spin 1s linear infinite' }} />Submitting...</> : 'Submit Application'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
