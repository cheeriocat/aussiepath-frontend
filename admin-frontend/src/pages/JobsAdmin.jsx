import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { getJobs, createJob, updateJob, deleteJob } from '../services/api';
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiSearchLine } from 'react-icons/ri';
import { FiLoader, FiMapPin, FiDollarSign } from 'react-icons/fi';

const EMPTY_FORM = { title: '', company: '', location: '', type: 'Full Time', salary: '', description: '', skills: '', visaTypes: '' };

export default function JobsAdmin() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchJobs = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    getJobs(params)
      .then(r => setJobs(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(); }, [search]);

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setModal('add'); };
  const openEdit = job => {
    setForm({ title: job.title, company: job.company, location: job.location, type: job.type, salary: job.salary, description: job.description, skills: (job.skills || []).join(', '), visaTypes: (job.visaTypes || []).join(', ') });
    setEditId(job.id); setModal('edit');
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean), visaTypes: form.visaTypes.split(',').map(s => s.trim()).filter(Boolean) };
    try {
      if (modal === 'add') { const { data } = await createJob(payload); setJobs(j => [data.data, ...j]); }
      else { await updateJob(editId, payload); setJobs(j => j.map(x => x.id === editId ? { ...x, ...payload } : x)); }
      setModal(null);
    } catch {}
    finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this job?')) return;
    setDeletingId(id);
    try { await deleteJob(id); setJobs(j => j.filter(x => x.id !== id)); }
    catch {}
    finally { setDeletingId(null); }
  };

  const inputStyle = {
    width: '100%', padding: '10px 13px', borderRadius: 8,
    border: '1.5px solid var(--gray-100)', fontSize: '0.875rem',
    color: 'var(--gray-800)', background: 'var(--white)', outline: 'none',
    transition: 'all 0.2s'
  };

  return (
    <>
      <Header title="Jobs" subtitle="Manage job listings" />
      <main className="admin-main">
        {/* Header Row */}
        <div className="page-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--navy)' }}>Job Market Listings</h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>{jobs.length} active job listings</p>
          </div>
          <button onClick={openAdd} className="btn-primary"><RiAddLine size={18} /> Add New Listing</button>
        </div>

        {/* Search */}
        <div className="card" style={{ padding: 14, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--gray-50)', border: '1.5px solid var(--gray-100)', borderRadius: 8, padding: '9px 14px', transition: 'all 0.3s ease' }}>
            <RiSearchLine size={16} color='var(--gray-400)' />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs..." style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.875rem', color: 'var(--gray-800)', width: '100%' }} />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <FiLoader size={28} color='#f5a623' style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <div className="jobs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 18 }}>
            {jobs.map(job => (
              <div key={job.id} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                  <img src={job.companyLogo} alt="" style={{ width: 46, height: 46, borderRadius: 10, border: '1px solid var(--gray-100)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy)' }}>{job.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>{job.company}</div>
                  </div>
                  <span style={{ padding: '3px 10px', borderRadius: 20, background: 'rgba(52,152,219,.15)', color: '#1a6ea8', fontSize: '0.72rem', fontWeight: 600, height: 'fit-content' }}>{job.type}</span>
                </div>
                <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                  <span style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: '0.8rem', color: 'var(--gray-500)' }}><FiMapPin size={12} color='#f5a623' />{job.location}</span>
                  <span style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: '0.8rem', color: 'var(--gray-500)' }}><FiDollarSign size={12} color='#27ae60' />{job.salary}</span>
                </div>
                {job.skills?.length > 0 && (
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
                    {job.skills.slice(0, 3).map(s => <span key={s} style={{ padding: '2px 8px', borderRadius: 20, background: 'var(--gray-50)', color: 'var(--gray-600)', fontSize: '0.7rem', fontWeight: 500, border: '1px solid var(--gray-100)' }}>{s}</span>)}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8, borderTop: '1px solid var(--gray-100)', paddingTop: 14, marginTop: 2 }}>
                  <button onClick={() => openEdit(job)} className="btn-outline" style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '8px' }}>
                    <RiEditLine size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(job.id)} disabled={deletingId === job.id} className="btn-danger" style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '8px', display: 'flex', alignItems: 'center', gap: 5 }}>
                    {deletingId === job.id ? <FiLoader size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <RiDeleteBinLine size={14} />} Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setModal(null)}>
          <div style={{ background: 'var(--white)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--gray-100)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--navy)', marginBottom: 20 }}>{modal === 'add' ? '+ Add New Job Listing' : 'Edit Job Listing'}</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="job-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[['Job Title', 'title', true], ['Company', 'company', true], ['Location', 'location', true], ['Salary', 'salary', false]].map(([label, key, req]) => (
                  <div key={key}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray-500)', display: 'block', marginBottom: 5 }}>{label}</label>
                    <input required={req} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#f5a623'}
                      onBlur={e => e.target.style.borderColor = 'var(--gray-100)'}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray-500)', display: 'block', marginBottom: 5 }}>Job Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={inputStyle}>
                  {['Full Time', 'Part Time', 'Contract'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray-500)', display: 'block', marginBottom: 5 }}>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray-500)', display: 'block', marginBottom: 5 }}>Skills (comma-separated)</label>
                <input value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} placeholder="e.g. JavaScript, React, AWS" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#f5a623'}
                  onBlur={e => e.target.style.borderColor = 'var(--gray-100)'}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray-500)', display: 'block', marginBottom: 5 }}>Visa Types (comma-separated)</label>
                <input value={form.visaTypes} onChange={e => setForm(f => ({ ...f, visaTypes: e.target.value }))} placeholder="e.g. 482, 186, 189" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#f5a623'}
                  onBlur={e => e.target.style.borderColor = 'var(--gray-100)'}
                />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                <button type="button" onClick={() => setModal(null)} className="btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  {saving ? <><FiLoader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : modal === 'add' ? 'Add Listing' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </>
  );
}
