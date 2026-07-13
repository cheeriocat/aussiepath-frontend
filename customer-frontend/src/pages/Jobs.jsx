import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiFilter, FiChevronRight, FiLoader } from 'react-icons/fi';
import { getJobs, getJob } from '../services/api';
import JobCard from '../components/JobCard';
import { submitApplication } from '../services/api';

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
    width: '100%', padding: '11px 14px', borderRadius: 8, border: '1.5px solid #e2e8f0',
    fontSize: '0.9rem', color: '#334155', outline: 'none',
    transition: 'border-color .2s',
  };

  return (
    <div style={{ paddingTop: 68, minHeight: '100vh', background: '#f0f4f8' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0d1f3c,#1a2d5a)', padding: '56px 0 40px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{ color: '#f5a623', fontSize: '0.75rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>OPPORTUNITIES</span>
          <h1 style={{ color: '#fff', fontSize: '2.6rem', fontWeight: 900, marginTop: 8, marginBottom: 12 }}>Find Your Role in Australia</h1>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '1rem' }}>Employer-sponsored positions specifically curated for skilled migrants</p>

          {/* Search Bar */}
          <div style={{ display: 'flex', gap: 12, maxWidth: 600, margin: '28px auto 0', background: '#fff', borderRadius: 12, padding: 8, boxShadow: '0 8px 30px rgba(0,0,0,.25)' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px' }}>
              <FiSearch size={18} color='#94a3b8' />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Job title, company..." style={{ border: 'none', outline: 'none', fontSize: '0.95rem', width: '100%', color: '#334155' }} />
            </div>
            <div style={{ width: 1, background: '#e2e8f0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px' }}>
              <FiMapPin size={18} color='#94a3b8' />
              <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: '0.9rem', color: '#334155', background: 'transparent', cursor: 'pointer' }}>
                {locations.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <button onClick={fetchJobs} style={{ background: '#f5a623', color: '#0d1f3c', padding: '10px 24px', borderRadius: 8, fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ padding: '32px 24px' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.875rem', color: '#64748b', alignSelf: 'center', marginRight: 4 }}><FiFilter size={14} style={{ verticalAlign: 'middle' }} /> Type:</span>
          {jobTypes.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} style={{
              padding: '7px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, transition: 'all .2s',
              background: typeFilter === t ? '#0d1f3c' : '#fff',
              color: typeFilter === t ? '#fff' : '#64748b',
              border: `1.5px solid ${typeFilter === t ? '#0d1f3c' : '#e2e8f0'}`,
            }}>{t}</button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '0.875rem', color: '#64748b', alignSelf: 'center' }}>
            {loading ? 'Loading...' : `${jobs.length} jobs found`}
          </span>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
            <FiLoader size={32} color='#f5a623' style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8' }}>
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
          <div style={{ background: '#fff', borderRadius: 20, maxWidth: 600, width: '100%', maxHeight: '85vh', overflow: 'auto', padding: 32 }} onClick={e => e.stopPropagation()}>
            {!showApplyModal ? (
              <>
                <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                  <img src={selectedJob.companyLogo} alt="" style={{ width: 56, height: 56, borderRadius: 12, border: '1px solid #e2e8f0' }} />
                  <div>
                    <h2 style={{ fontWeight: 800, fontSize: '1.3rem', color: '#0d1f3c' }}>{selectedJob.title}</h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{selectedJob.company} · {selectedJob.location}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                  <span style={{ padding: '4px 12px', borderRadius: 20, background: 'rgba(52,152,219,.1)', color: '#1a6ea8', fontSize: '0.78rem', fontWeight: 600 }}>{selectedJob.type}</span>
                  <span style={{ padding: '4px 12px', borderRadius: 20, background: 'rgba(39,174,96,.1)', color: '#1e7c47', fontSize: '0.78rem', fontWeight: 600 }}>{selectedJob.salary}</span>
                  {selectedJob.visaTypes.map(v => <span key={v} style={{ padding: '4px 12px', borderRadius: 20, background: 'rgba(245,166,35,.1)', color: '#c17d10', fontSize: '0.78rem', fontWeight: 600 }}>Visa {v}</span>)}
                </div>
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 8, color: '#0d1f3c' }}>About the Role</h4>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.7 }}>{selectedJob.description}</p>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 8, color: '#0d1f3c' }}>Requirements</h4>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {selectedJob.requirements.map(r => (
                      <li key={r} style={{ display: 'flex', gap: 8, color: '#475569', fontSize: '0.875rem' }}>
                        <FiChevronRight size={16} color='#f5a623' style={{ flexShrink: 0, marginTop: 2 }} />{r}
                      </li>
                    ))}
                  </ul>
                </div>
                <button onClick={() => setShowApplyModal(true)} style={{ width: '100%', background: '#f5a623', color: '#0d1f3c', padding: '14px', borderRadius: 10, fontWeight: 800, fontSize: '1rem' }}>
                  Apply for This Position
                </button>
              </>
            ) : applySuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎉</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#0d1f3c', marginBottom: 8 }}>Application Submitted!</h3>
                <p style={{ color: '#64748b', marginBottom: 24 }}>Our migration agents will review your profile and contact you within 2-3 business days.</p>
                <button onClick={() => { setSelectedJob(null); setShowApplyModal(false); setApplySuccess(false); }} style={{ background: '#f5a623', color: '#0d1f3c', padding: '12px 28px', borderRadius: 8, fontWeight: 700 }}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <button onClick={() => setShowApplyModal(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '1.2rem', cursor: 'pointer' }}>←</button>
                  <h3 style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0d1f3c' }}>Apply — {selectedJob.title}</h3>
                </div>
                <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[['Full Name', 'applicantName', 'text'], ['Email Address', 'email', 'email'], ['Phone Number', 'phone', 'tel'], ['Nationality', 'nationality', 'text']].map(([label, name, type]) => (
                    <div key={name}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 6 }}>{label}</label>
                      <input
                        type={type} required name={name} value={applyForm[name]}
                        onChange={e => setApplyForm(f => ({ ...f, [e.target.name]: e.target.value }))}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = '#f5a623'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                  ))}
                  <button type="submit" disabled={applyLoading} style={{ background: '#f5a623', color: '#0d1f3c', padding: '13px', borderRadius: 9, fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
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
