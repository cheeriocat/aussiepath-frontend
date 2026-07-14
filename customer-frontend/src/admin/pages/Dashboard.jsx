import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { getStats, getActivity, getApplications, getJobs, deleteApplication, updateApplication } from '../../services/api';
import {
  RiUserLine, RiFileList3Line, RiBriefcaseLine, RiCheckboxCircleLine,
  RiAddLine, RiEditLine, RiDeleteBinLine, RiEyeLine, RiArrowRightLine,
} from 'react-icons/ri';
import { FiLoader, FiDownload, FiFilter } from 'react-icons/fi';

const StatCard = ({ icon, label, value, color, bg, delta }) => (
  <div className="card animate-fadeInUp" style={{ padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
    <div style={{ width: 52, height: 52, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0, fontSize: 22 }}>{icon}</div>
    <div>
      <div style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--gray-800)', lineHeight: 1 }}>{value?.toLocaleString()}</div>
      <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: 4 }}>{label}</div>
    </div>
    {delta && <span style={{ marginLeft: 'auto', fontSize: '0.72rem', fontWeight: 700, color: delta > 0 ? '#27ae60' : '#e74c3c', background: delta > 0 ? 'rgba(39,174,96,.1)' : 'rgba(231,76,60,.1)', padding: '3px 8px', borderRadius: 20 }}>{delta > 0 ? '+' : ''}{delta}%</span>}
  </div>
);

const statusBadge = status => {
  const map = { 'Active': 'badge-active', 'Documents': 'badge-documents', 'Pending Documentation': 'badge-pending', 'Rejected': 'badge-rejected' };
  return map[status] || 'badge-pending';
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [editApp, setEditApp] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('');

  useEffect(() => {
    Promise.all([getStats(), getActivity(), getApplications({ page: 1, limit: 5 }), getJobs({ limit: 3 })])
      .then(([statsR, actR, appsR, jobsR]) => {
        setStats(statsR.data.data);
        setActivities(actR.data.data);
        setApplications(appsR.data.data);
        setJobs(jobsR.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async id => {
    if (!window.confirm('Delete this application?')) return;
    setDeletingId(id);
    try {
      await deleteApplication(id);
      setApplications(a => a.filter(x => x.id !== id));
    } catch {}
    finally { setDeletingId(null); }
  };

  const handleStatusSave = async () => {
    try {
      await updateApplication(editApp.id, { status: statusUpdate });
      setApplications(a => a.map(x => x.id === editApp.id ? { ...x, status: statusUpdate } : x));
      setEditApp(null);
    } catch {}
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--gray-500)', flexDirection: 'column', gap: 16, background: 'var(--bg)' }}>
      <FiLoader size={32} color='#f5a623' style={{ animation: 'spin 1s linear infinite' }} />
      <p style={{ fontSize: '0.9rem' }}>Loading dashboard...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );

  return (
    <>
      <Header />
      <main className="admin-main">
        {/* Stats */}
        <div className="dashboard-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 28 }}>
          <StatCard icon={<RiUserLine />} label="Total Applicants" value={stats?.totalApplicants} color='#3498db' bg='rgba(52,152,219,.12)' delta={12} />
          <StatCard icon={<RiFileList3Line />} label="Pending Files" value={stats?.pendingFiles} color='#f39c12' bg='rgba(243,156,18,.12)' delta={-3} />
          <StatCard icon={<RiBriefcaseLine />} label="Active Jobs" value={stats?.activeJobs} color='#27ae60' bg='rgba(39,174,96,.12)' delta={8} />
          <StatCard icon={<RiCheckboxCircleLine />} label="Success Cases" value={stats?.successCases} color='#9b59b6' bg='rgba(155,89,182,.12)' delta={5} />
        </div>

        {/* Application Management */}
        <div className="card animate-fadeInUp" style={{ padding: 24, marginBottom: 24, animationDelay: '.1s' }}>
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div className="section-title" style={{ color: 'var(--navy)' }}>Application Management</div>
              <div className="section-sub" style={{ color: 'var(--gray-500)' }}>Real-time overview of candidate filings in the Coastal region</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-outline" style={{ fontSize: '0.8rem', padding: '8px 14px' }}><FiFilter size={14} /> Filter</button>
              <button className="btn-outline" style={{ fontSize: '0.8rem', padding: '8px 14px' }}><FiDownload size={14} /> Export CSV</button>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--gray-100)' }}>
                  {['Applicant Name', 'Occupation', 'Visa Type', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: .5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.map((app, i) => (
                  <tr key={app.id} style={{ borderBottom: '1px solid var(--gray-100)', transition: 'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '13px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${app.applicantName}`} alt="" style={{ width: 34, height: 34, borderRadius: '50%', border: '2px solid var(--gray-100)', background: 'var(--gray-50)' }} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--gray-800)' }}>{app.applicantName}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)' }}>{app.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '13px 14px', fontSize: '0.85rem', color: 'var(--gray-600)' }}>{app.occupation}</td>
                    <td style={{ padding: '13px 14px', fontSize: '0.85rem', color: 'var(--gray-600)' }}>{app.visaType}</td>
                    <td style={{ padding: '13px 14px' }}>
                      <span className={`badge ${statusBadge(app.status)}`}>{app.status}</span>
                    </td>
                    <td style={{ padding: '13px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button title="View/Edit" onClick={() => { setEditApp(app); setStatusUpdate(app.status); }} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(52,152,219,.1)', color: '#3498db', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', transition: 'all .2s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#3498db'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(52,152,219,.1)'; e.currentTarget.style.color = '#3498db'; }}
                        ><RiEyeLine size={14} /></button>
                        <button title="Edit Status" onClick={() => { setEditApp(app); setStatusUpdate(app.status); }} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(245,166,35,.1)', color: '#f5a623', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', transition: 'all .2s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#f5a623'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,166,35,.1)'; e.currentTarget.style.color = '#f5a623'; }}
                        ><RiEditLine size={14} /></button>
                        <button title="Delete" onClick={() => handleDelete(app.id)} disabled={deletingId === app.id} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(231,76,60,.1)', color: '#e74c3c', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', transition: 'all .2s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#e74c3c'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(231,76,60,.1)'; e.currentTarget.style.color = '#e74c3c'; }}
                        ><RiDeleteBinLine size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="table-pagination" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, padding: '12px 0 0', borderTop: '1px solid var(--gray-100)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>Showing 1-5 of 124 applicants</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {[1, 2, 3, '...', 25].map((p, i) => (
                <button key={i} style={{
                  width: 32, height: 32, borderRadius: 7, fontSize: '0.8rem', fontWeight: 600,
                  background: p === 1 ? 'var(--navy)' : 'transparent',
                  color: p === 1 ? 'var(--white)' : 'var(--gray-500)',
                  border: `1px solid ${p === 1 ? 'var(--navy)' : 'var(--gray-100)'}`,
                  cursor: 'pointer',
                }}>{p}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="dashboard-bottom-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Job Market Pulse */}
          <div className="card animate-fadeInUp" style={{ padding: 22, animationDelay: '.2s' }}>
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div className="section-title" style={{ color: 'var(--navy)' }}>Job Market Pulse</div>
                <div className="section-sub" style={{ color: 'var(--gray-500)' }}>Live market listings</div>
              </div>
              <Link to="/admin/jobs" className="btn-primary" style={{ fontSize: '0.78rem', padding: '8px 14px', gap: 4 }}>
                <RiAddLine size={15} /> Add New Listing
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {jobs.map(job => (
                <div key={job.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px', borderRadius: 10, background: 'var(--gray-50)', border: '1px solid var(--gray-100)', transition: 'all .2s', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--gray-100)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--gray-50)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--gray-100)'; }}
                >
                  <img src={job.companyLogo} alt="" style={{ width: 40, height: 40, borderRadius: 10, border: '1px solid var(--gray-100)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--gray-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.title}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)' }}>{job.company} · {job.location}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#27ae60', background: 'rgba(39,174,96,.1)', padding: '3px 8px', borderRadius: 20, marginBottom: 3 }}>High</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>{job.type}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/admin/jobs" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f5a623', fontWeight: 600, fontSize: '0.8rem', marginTop: 14, justifyContent: 'center' }}>
              View All Jobs <RiArrowRightLine size={14} />
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="card animate-fadeInUp" style={{ padding: 22, animationDelay: '.25s' }}>
            <div style={{ marginBottom: 16 }}>
              <div className="section-title" style={{ color: 'var(--navy)' }}>Recent User Activity</div>
              <div className="section-sub" style={{ color: 'var(--gray-500)' }}>Latest applicant interactions</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {activities.map(act => (
                <div key={act.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px', borderRadius: 10, background: 'var(--gray-50)', border: '1px solid var(--gray-100)' }}>
                  <img src={act.avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--gray-100)', background: 'var(--gray-50)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--gray-800)' }}>{act.userName}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)' }}>{act.role}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--gray-500)', marginTop: 2 }}>
                      <span style={{ color: '#f5a623' }}>●</span> {act.action} · {act.time}
                    </div>
                  </div>
                  <button style={{
                    fontSize: '0.75rem', fontWeight: 700, color: 'var(--navy)',
                    border: '1.5px solid var(--gray-100)', background: 'var(--white)',
                    padding: '6px 12px', borderRadius: 7, cursor: 'pointer',
                    transition: 'all .2s', flexShrink: 0,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--navy)'; e.currentTarget.style.color = 'var(--white)'; e.currentTarget.style.borderColor = 'var(--navy)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.color = 'var(--navy)'; e.currentTarget.style.borderColor = 'var(--gray-100)'; }}
                  >Manage</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="dashboard-footer" style={{ marginTop: 32, background: 'var(--gray-50)', border: '1px solid var(--gray-100)', borderRadius: 16, padding: '28px 32px', transition: 'all 0.3s ease' }}>
          <div className="dashboard-footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 32 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#f5a623,#e0941a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#0d1f3c' }}>A</div>
                <span style={{ color: 'var(--navy)', fontWeight: 800 }}>AussiePath</span>
              </div>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.78rem', lineHeight: 1.7, maxWidth: 220 }}>
                Engineering for career professionals in both global placements in both Australia and New Zealand with MARN 0000000 Registered.
              </p>
            </div>
            {[['Resources', ['Privacy Policy', 'Terms of Service', 'Skills Code of Conduct']], ['Regulatory', ['Skills Code Office', 'MARA Complaints', 'OMARA Reporting']], ['Contact', ['400 Lonsdale Drive, Canberra', 'hello@aussiepath.com.au', '1300 287 284']]].map(([col, items]) => (
              <div key={col}>
                <div style={{ color: 'var(--navy)', fontWeight: 700, fontSize: '0.82rem', marginBottom: 10 }}>{col}</div>
                {items.map(item => <div key={item} style={{ color: 'var(--gray-500)', fontSize: '0.75rem', marginBottom: 6 }}>{item}</div>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--gray-100)', marginTop: 20, paddingTop: 16, textAlign: 'center', color: 'var(--gray-400)', fontSize: '0.75rem' }}>
            © 2024 AussiePath Consulting, All Rights Reserved.
          </div>
        </footer>
      </main>

      {/* Edit Status Modal */}
      {editApp && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setEditApp(null)}>
          <div className="responsive-modal" style={{ background: 'var(--white)', borderRadius: 16, padding: 28, width: 380, border: '1px solid var(--gray-100)', boxShadow: 'var(--shadow-lg)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontWeight: 800, marginBottom: 4, color: 'var(--navy)' }}>Update Application Status</h3>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginBottom: 20 }}>{editApp.applicantName} — {editApp.occupation}</p>
            <select value={statusUpdate} onChange={e => setStatusUpdate(e.target.value)} style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1.5px solid var(--gray-100)', fontSize: '0.9rem', color: 'var(--gray-800)', background: 'var(--white)', marginBottom: 16, outline: 'none' }}>
              {['Active', 'Documents', 'Pending Documentation', 'Rejected'].map(s => <option key={s}>{s}</option>)}
            </select>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setEditApp(null)} className="btn-outline" style={{ flex: 1 }}>Cancel</button>
              <button onClick={handleStatusSave} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </>
  );
}
