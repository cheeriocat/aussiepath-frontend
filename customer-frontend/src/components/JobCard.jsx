import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiDollarSign, FiBookmark, FiArrowRight } from 'react-icons/fi';

export default function JobCard({ job, style = {} }) {
  return (
    <div style={{
      background: 'var(--white)',
      borderRadius: 14,
      padding: '20px',
      border: '1px solid var(--gray-100)',
      boxShadow: '0 2px 12px rgba(0,0,0,.06)',
      display: 'flex', flexDirection: 'column', gap: 14,
      transition: 'all .25s, background 0.3s ease, border-color 0.3s ease',
      position: 'relative',
      ...style,
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,.14)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = '#f5a623'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,.06)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--gray-100)'; }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <img
            src={job.companyLogo}
            alt={job.company}
            style={{ width: 44, height: 44, borderRadius: 10, border: '1px solid var(--gray-100)', objectFit: 'cover' }}
          />
          <div>
            <p style={{ fontSize: '0.78rem', color: 'var(--gray-600)', fontWeight: 500 }}>{job.company}</p>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.3 }}>{job.title}</h3>
          </div>
        </div>
        <button style={{
          background: 'transparent', border: '1.5px solid var(--gray-100)',
          color: 'var(--gray-400)', width: 34, height: 34, borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .2s', flexShrink: 0,
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#f5a623'; e.currentTarget.style.color = '#f5a623'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-100)'; e.currentTarget.style.color = 'var(--gray-400)'; }}
        ><FiBookmark size={15} /></button>
      </div>

      {/* Type Badge */}
      <span style={{
        display: 'inline-block', padding: '3px 10px', borderRadius: 20,
        background: 'rgba(52,152,219,.15)', color: '#1a6ea8',
        fontSize: '0.72rem', fontWeight: 600, width: 'fit-content',
      }}>{job.type}</span>

      {/* Meta */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gray-600)', fontSize: '0.83rem' }}>
          <FiMapPin size={13} color='#f5a623' />
          <span>{job.location}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gray-600)', fontSize: '0.83rem' }}>
          <FiDollarSign size={13} color='#27ae60' />
          <span>{job.salary}</span>
        </div>
      </div>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {job.skills.map(s => (
            <span key={s} style={{
              padding: '3px 10px', borderRadius: 20,
              background: 'var(--gray-50)', color: 'var(--gray-700)',
              fontSize: '0.72rem', fontWeight: 500,
              border: '1px solid var(--gray-100)',
            }}>{s}</span>
          ))}
        </div>
      )}

      {/* Apply Button */}
      <Link to={`/jobs/${job.id}`} style={{
        background: '#f5a623', color: '#0d1f3c',
        padding: '11px 0', borderRadius: 8, fontWeight: 700,
        fontSize: '0.875rem', textAlign: 'center', marginTop: 'auto',
        transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }}
        onMouseEnter={e => { e.currentTarget.style.background = '#e0941a'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#f5a623'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        Apply Now <FiArrowRight size={15} />
      </Link>
    </div>
  );
}
