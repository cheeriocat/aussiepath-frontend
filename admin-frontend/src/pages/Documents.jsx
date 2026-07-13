import React from 'react';
import Header from '../components/Header';
import { RiFolderLine } from 'react-icons/ri';

export default function Documents() {
  return (
    <>
      <Header title="Documents" subtitle="Manage applicant documents" />
      <main className="admin-main">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', color: '#94a3b8', textAlign: 'center' }}>
          <RiFolderLine size={60} color='#e2e8f0' style={{ marginBottom: 16 }} />
          <h3 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#cbd5e1', marginBottom: 8 }}>Document Management</h3>
          <p style={{ fontSize: '0.9rem', maxWidth: 360 }}>This section will allow you to manage uploaded documents for each applicant — passports, skills assessments, IELTS results, and more.</p>
        </div>
      </main>
    </>
  );
}
