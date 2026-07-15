import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { getApplications, updateApplication, deleteApplication } from '../../services/api';
import { RiSearchLine, RiEditLine, RiDeleteBinLine, RiEyeLine, RiAddLine } from 'react-icons/ri';
import { FiLoader, FiDownload } from 'react-icons/fi';

const statusColors = { 'Active': 'badge-active', 'Documents': 'badge-documents', 'Pending Documentation': 'badge-pending', 'Rejected': 'badge-rejected' };
const statuses = ['All', 'Active', 'Documents', 'Pending Documentation', 'Rejected'];

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [editApp, setEditApp] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deletingId, setDeletingId] = useState(null);
  const LIMIT = 8;

  const fetchApps = async () => {
    setLoading(true);
    const params = { page, limit: LIMIT };
    if (search) params.search = search;
    if (statusFilter !== 'All') params.status = statusFilter;
    try {
      const { data } = await getApplications(params);
      setApps(data.data);
      setTotal(data.total);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchApps(); }, [page, search, statusFilter]);

  const handleEditSave = async () => {
    try {
      await updateApplication(editApp.id, editForm);
      setApps(a => a.map(x => x.id === editApp.id ? { ...x, ...editForm } : x));
      setEditApp(null);
    } catch {}
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this application?')) return;
    setDeletingId(id);
    try {
      await deleteApplication(id);
      setApps(a => a.filter(x => x.id !== id));
      setTotal(t => t - 1);
    } catch {}
    finally { setDeletingId(null); }
  };

  const totalPages = Math.ceil(total / LIMIT);

  const inputStyle = {
    width: '100%', padding: '10px 13px', borderRadius: 8,
    border: '1.5px solid var(--gray-100)', fontSize: '0.875rem',
    color: 'var(--gray-800)', background: 'var(--white)', outline: 'none',
    transition: 'all 0.2s'
  };

  return (
    <>
      <Header title="Applications" subtitle="Manage all visa applications" />
      <main className="admin-main">
        {/* Page Header */}
        <div className="page-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--navy)' }}>All Applications</h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>{total} total applicants in the system</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card" style={{ padding: 16, marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--gray-50)', border: '1.5px solid var(--gray-100)', borderRadius: 8, padding: '9px 14px', flex: 1, minWidth: 200, transition: 'all 0.3s ease' }}>
            <RiSearchLine size={16} color='var(--gray-400)' />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or occupation..." style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.85rem', color: 'var(--gray-800)', width: '100%' }} />
          </div>

          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {statuses.map(s => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} style={{
                padding: '7px 14px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600, transition: 'all .2s', cursor: 'pointer',
                background: statusFilter === s ? 'var(--navy)' : 'var(--gray-50)',
                color: statusFilter === s ? 'var(--white)' : 'var(--gray-500)',
                border: `1.5px solid ${statusFilter === s ? 'var(--navy)' : 'var(--gray-100)'}`,
              }}>{s}</button>
            ))}
          </div>

          <button className="btn-outline" style={{ fontSize: '0.8rem', padding: '8px 14px' }}><FiDownload size={14} /> Export</button>
        </div>

        {/* Table */}
        <div className="card" style={{ overflow: 'hidden' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
              <FiLoader size={28} color='#f5a623' style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : (
            <div style={{ overflowX: 'auto', width: '100%', maxWidth: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: 'var(--gray-50)', borderBottom: '2px solid var(--gray-100)' }}>
                  <tr>
                    {['Applicant', 'Occupation', 'Visa Type', 'Points', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: .5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {apps.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--gray-400)' }}>No applications found</td></tr>
                  ) : apps.map(app => (
                    <tr key={app.id} style={{ borderBottom: '1px solid var(--gray-100)', transition: 'background .15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${app.applicantName}`} alt="" style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid var(--gray-100)', background: 'var(--gray-50)' }} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--gray-800)' }}>{app.applicantName}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>{app.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: 'var(--gray-600)' }}>{app.occupation}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ padding: '3px 9px', borderRadius: 20, background: 'rgba(52,152,219,.15)', color: '#1a6ea8', fontSize: '0.72rem', fontWeight: 600 }}>{app.visaType}</span>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, fontSize: '0.875rem', color: app.points >= 65 ? '#27ae60' : '#e74c3c' }}>{app.points || '0'}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className={`badge ${statusColors[app.status] || 'badge-pending'}`}>{app.status}</span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: 'var(--gray-400)' }}>{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          {[
                            { icon: <RiEyeLine size={13} />, color: '#3498db', title: 'View', onClick: () => { setEditApp(app); setEditForm({ ...app }); } },
                            { icon: <RiEditLine size={13} />, color: '#f5a623', title: 'Edit', onClick: () => { setEditApp(app); setEditForm({ ...app }); } },
                            { icon: deletingId === app.id ? <FiLoader size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <RiDeleteBinLine size={13} />, color: '#e74c3c', title: 'Delete', onClick: () => handleDelete(app.id) },
                          ].map((btn, i) => (
                            <button key={i} title={btn.title} onClick={btn.onClick} style={{
                              width: 29, height: 29, borderRadius: 7, border: 'none', cursor: 'pointer',
                              background: `${btn.color}18`, color: btn.color,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s',
                            }}
                              onMouseEnter={e => { e.currentTarget.style.background = btn.color; e.currentTarget.style.color = '#fff'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = `${btn.color}18`; e.currentTarget.style.color = btn.color; }}
                            >{btn.icon}</button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="table-pagination" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderTop: '1px solid var(--gray-100)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>Showing {Math.min((page - 1) * LIMIT + 1, total)}-{Math.min(page * LIMIT, total)} of {total} applicants</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '6px 12px', borderRadius: 7, border: '1px solid var(--gray-100)', background: 'var(--white)', cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: '0.8rem', color: 'var(--gray-600)', opacity: page === 1 ? .5 : 1 }}>← Prev</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} style={{ width: 32, height: 32, borderRadius: 7, border: `1px solid ${page === p ? 'var(--navy)' : 'var(--gray-100)'}`, background: page === p ? 'var(--navy)' : 'var(--white)', color: page === p ? 'var(--white)' : 'var(--gray-600)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '6px 12px', borderRadius: 7, border: '1px solid var(--gray-100)', background: 'var(--white)', cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: '0.8rem', color: 'var(--gray-600)', opacity: page === totalPages ? .5 : 1 }}>Next →</button>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {editApp && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setEditApp(null)}>
          <div className="responsive-modal" style={{ background: 'var(--white)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 460, border: '1px solid var(--gray-100)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 20, color: 'var(--navy)' }}>Edit Application — {editApp.applicantName}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[['Applicant Name', 'applicantName'], ['Email', 'email'], ['Occupation', 'occupation'], ['Visa Type', 'visaType']].map(([label, key]) => (
                <div key={key}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray-500)', display: 'block', marginBottom: 5 }}>{label}</label>
                  <input value={editForm[key] || ''} onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#f5a623'}
                    onBlur={e => e.target.style.borderColor = 'var(--gray-100)'}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray-500)', display: 'block', marginBottom: 5 }}>Status</label>
                <select value={editForm.status || ''} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))} style={inputStyle}>
                  {['Active', 'Documents', 'Pending Documentation', 'Rejected'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setEditApp(null)} className="btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button onClick={handleEditSave} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </>
  );
}
