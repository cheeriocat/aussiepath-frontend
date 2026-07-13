import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const FooterLink = ({ children, to }) => (
  <li>
    <Link to={to || '#'} style={{ color: 'var(--footer-link)', fontSize: '0.875rem', transition: 'color .2s' }}
      onMouseEnter={e => e.currentTarget.style.color = '#f5a623'}
      onMouseLeave={e => e.currentTarget.style.color = 'var(--footer-link)'}
    >{children}</Link>
  </li>
);

export default function Footer() {
  return (
    <footer style={{ background: 'var(--footer-bg)', color: 'var(--footer-text)', paddingTop: 60, borderTop: '1px solid var(--footer-border)', transition: 'background 0.3s ease, color 0.3s ease' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: 48, paddingBottom: 48, borderBottom: '1px solid var(--footer-border)', transition: 'border-color 0.3s ease' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg,#f5a623,#e0941a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#0d1f3c' }}>A</div>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--footer-text)' }}>AussiePath</span>
            </div>
            <p style={{ color: 'var(--footer-link)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: 20, maxWidth: 260 }}>
              Australia's leading visa and migration consultancy. Expert guidance for skilled professionals seeking their Australian journey.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--footer-link)',
                  transition: 'all .2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f5a623'; e.currentTarget.style.color = '#0d1f3c'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.08)'; e.currentTarget.style.color = 'var(--footer-link)'; }}
                ><Icon size={15} /></a>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 16, color: 'var(--footer-text)' }}>Resources</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <FooterLink>Visa Types</FooterLink>
              <FooterLink>Score Calculator</FooterLink>
              <FooterLink>Cost of Living</FooterLink>
              <FooterLink>State Nomination</FooterLink>
              <FooterLink>Skills Assessment</FooterLink>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 16, color: 'var(--footer-text)' }}>Legal</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <FooterLink>Privacy Policy</FooterLink>
              <FooterLink>Terms of Service</FooterLink>
              <FooterLink>Skills Code of Conduct</FooterLink>
              <FooterLink>Cookie Policy</FooterLink>
              <FooterLink>Refund Policy</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 16, color: 'var(--footer-text)' }}>Contact</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li style={{ display: 'flex', gap: 10, color: 'var(--footer-link)', fontSize: '0.875rem' }}>
                <FiMapPin size={16} style={{ flexShrink: 0, marginTop: 2, color: '#f5a623' }} />
                <span>400 Lonsdale Consulting Drive, ACT Canberra 2601</span>
              </li>
              <li style={{ display: 'flex', gap: 10, color: 'var(--footer-link)', fontSize: '0.875rem' }}>
                <FiPhone size={16} style={{ flexShrink: 0, color: '#f5a623' }} />
                <span>1300 AU PATH (287 284)</span>
              </li>
              <li style={{ display: 'flex', gap: 10, color: 'var(--footer-link)', fontSize: '0.875rem' }}>
                <FiMail size={16} style={{ flexShrink: 0, color: '#f5a623' }} />
                <span>hello@aussiepath.com.au</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', color: 'var(--footer-link)', fontSize: '0.82rem', opacity: 0.8 }}>
          <span>© 2024 AussiePath Consulting. All Rights Reserved.</span>
          <span>MARN 0000000 · Registered Migration Agent</span>
        </div>
      </div>
    </footer>
  );
}
